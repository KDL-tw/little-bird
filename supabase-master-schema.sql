-- MASTER SCHEMA FOR LITTLE BIRD
-- This file contains all schemas in the correct execution order
-- Run this file to set up the complete database

-- ==============================================
-- STEP 1: ADMIN REPOSITORY (Independent data store)
-- ==============================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS admin_bill_sponsors CASCADE;
DROP TABLE IF EXISTS admin_bills CASCADE;
DROP TABLE IF EXISTS admin_legislators CASCADE;

-- Create admin_legislators table (raw OpenStates data)
CREATE TABLE admin_legislators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- OpenStates core fields
  openstates_id TEXT UNIQUE NOT NULL, -- OpenStates person ID
  name TEXT NOT NULL,
  party TEXT,
  chamber TEXT, -- 'House' or 'Senate'
  district TEXT,
  email TEXT,
  phone TEXT,
  office_location TEXT,
  photo_url TEXT,
  bio TEXT,
  
  -- Additional fields we might need
  twitter_handle TEXT,
  facebook_page TEXT,
  website TEXT,
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create admin_bills table (raw OpenStates data)
CREATE TABLE admin_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- OpenStates core fields
  openstates_id TEXT UNIQUE NOT NULL, -- OpenStates bill ID
  session TEXT NOT NULL,
  jurisdiction_id TEXT NOT NULL, -- OpenStates jurisdiction ID
  jurisdiction_name TEXT NOT NULL,
  from_organization_id TEXT NOT NULL, -- OpenStates organization ID
  from_organization_name TEXT NOT NULL,
  identifier TEXT NOT NULL, -- Bill number (e.g., "HB 25B-1003")
  title TEXT NOT NULL,
  classification TEXT[] DEFAULT '{}', -- Array of classifications
  subject TEXT[] DEFAULT '{}', -- Array of subjects
  extras JSONB DEFAULT '{}', -- OpenStates extras field
  
  -- OpenStates dates
  created_at_openstates TIMESTAMP WITH TIME ZONE,
  updated_at_openstates TIMESTAMP WITH TIME ZONE,
  first_action_date TIMESTAMP WITH TIME ZONE,
  latest_action_date TIMESTAMP WITH TIME ZONE,
  latest_action_description TEXT,
  latest_passage_date TIMESTAMP WITH TIME ZONE,
  
  -- OpenStates URLs
  openstates_url TEXT,
  
  -- Fiscal note fields
  fiscal_note_url TEXT,
  fiscal_note_status TEXT CHECK (fiscal_note_status IN ('Not Found', 'Found', 'Processing', 'Error')) DEFAULT 'Not Found',
  fiscal_note_last_checked TIMESTAMP WITH TIME ZONE,
  fiscal_note_agent_version TEXT,
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create admin_bill_sponsors table (raw OpenStates data)
CREATE TABLE admin_bill_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES admin_bills(id) ON DELETE CASCADE,
  legislator_id UUID NOT NULL REFERENCES admin_legislators(id) ON DELETE CASCADE,
  sponsor_type TEXT NOT NULL, -- 'Primary', 'Co-sponsor', 'Co-prime'
  openstates_sponsor_id TEXT, -- OpenStates sponsor ID if available
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  
  -- Ensure unique sponsor per bill
  UNIQUE(bill_id, legislator_id)
);

-- ==============================================
-- STEP 2: USER SCHEMAS (User-specific data)
-- ==============================================

-- Drop existing user tables
DROP TABLE IF EXISTS user_fiscal_notes CASCADE;
DROP TABLE IF EXISTS user_bill_notes CASCADE;
DROP TABLE IF EXISTS user_bill_actions CASCADE;
DROP TABLE IF EXISTS user_bills CASCADE;
DROP TABLE IF EXISTS user_legislators CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Create clients table (user-specific)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create user_bills table (user-specific bill tracking)
CREATE TABLE user_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_bill_id UUID NOT NULL REFERENCES admin_bills(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- User-specific fields
  position TEXT CHECK (position IN ('Support', 'Monitor', 'Oppose', 'None', 'Hypothetical')) DEFAULT 'None',
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low', 'None')) DEFAULT 'None',
  watchlist BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  -- Tracking fields
  added_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  
  -- Ensure one record per user per bill
  UNIQUE(user_id, admin_bill_id)
);

-- Create user_legislators table (user-specific legislator tracking)
CREATE TABLE user_legislators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_legislator_id UUID NOT NULL REFERENCES admin_legislators(id) ON DELETE CASCADE,
  
  -- User-specific fields
  relationship_score TEXT CHECK (relationship_score IN ('High', 'Medium', 'Low', 'None')) DEFAULT 'None',
  last_contact_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Tracking fields
  added_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  
  -- Ensure one record per user per legislator
  UNIQUE(user_id, admin_legislator_id)
);

-- ==============================================
-- STEP 3: FISCAL NOTES (AI Analysis)
-- ==============================================

-- Create fiscal_notes table for storing processed fiscal note data
CREATE TABLE fiscal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_bill_id UUID NOT NULL REFERENCES admin_bills(id) ON DELETE CASCADE,
  
  -- Source information
  source_url TEXT NOT NULL,
  source_title TEXT,
  source_author TEXT,
  source_date TIMESTAMP WITH TIME ZONE,
  
  -- AI processed content
  raw_content TEXT, -- Original scraped content
  processed_content TEXT, -- AI processed/cleaned content
  summary TEXT, -- AI generated summary
  key_findings TEXT[], -- Array of key findings
  fiscal_impact JSONB, -- Structured fiscal impact data
  
  -- AI analysis metadata
  ai_model_version TEXT,
  processing_status TEXT CHECK (processing_status IN ('Pending', 'Processing', 'Completed', 'Error')) DEFAULT 'Pending',
  processing_notes TEXT,
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_processed_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create fiscal_note_versions table for tracking changes over time
CREATE TABLE fiscal_note_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_note_id UUID NOT NULL REFERENCES fiscal_notes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Content snapshots
  raw_content_snapshot TEXT,
  processed_content_snapshot TEXT,
  summary_snapshot TEXT,
  key_findings_snapshot TEXT[],
  fiscal_impact_snapshot JSONB,
  
  -- Change detection
  changes_detected TEXT[], -- Array of detected changes
  change_summary TEXT, -- AI generated summary of changes
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  
  -- Ensure unique version numbers per fiscal note
  UNIQUE(fiscal_note_id, version_number)
);

-- Create user_fiscal_notes table for user-specific fiscal note data
CREATE TABLE user_fiscal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fiscal_note_id UUID NOT NULL REFERENCES fiscal_notes(id) ON DELETE CASCADE,
  
  -- User-specific fields
  is_watched BOOLEAN DEFAULT FALSE,
  user_notes TEXT,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low', 'None')) DEFAULT 'None',
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  
  -- Ensure one record per user per fiscal note
  UNIQUE(user_id, fiscal_note_id)
);

-- ==============================================
-- STEP 4: INDEXES AND PERFORMANCE
-- ==============================================

-- Admin repository indexes
CREATE INDEX idx_admin_legislators_openstates_id ON admin_legislators(openstates_id);
CREATE INDEX idx_admin_legislators_chamber ON admin_legislators(chamber);
CREATE INDEX idx_admin_legislators_party ON admin_legislators(party);

CREATE INDEX idx_admin_bills_openstates_id ON admin_bills(openstates_id);
CREATE INDEX idx_admin_bills_session ON admin_bills(session);
CREATE INDEX idx_admin_bills_identifier ON admin_bills(identifier);
CREATE INDEX idx_admin_bills_jurisdiction ON admin_bills(jurisdiction_id);
CREATE INDEX idx_admin_bills_updated_at ON admin_bills(updated_at_openstates);

CREATE INDEX idx_admin_bill_sponsors_bill_id ON admin_bill_sponsors(bill_id);
CREATE INDEX idx_admin_bill_sponsors_legislator_id ON admin_bill_sponsors(legislator_id);

-- User schema indexes
CREATE INDEX idx_user_bills_user_id ON user_bills(user_id);
CREATE INDEX idx_user_bills_admin_bill_id ON user_bills(admin_bill_id);
CREATE INDEX idx_user_bills_position ON user_bills(position);
CREATE INDEX idx_user_bills_priority ON user_bills(priority);
CREATE INDEX idx_user_bills_watchlist ON user_bills(watchlist);

CREATE INDEX idx_user_legislators_user_id ON user_legislators(user_id);
CREATE INDEX idx_user_legislators_admin_legislator_id ON user_legislators(admin_legislator_id);
CREATE INDEX idx_user_legislators_relationship_score ON user_legislators(relationship_score);

CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Fiscal notes indexes
CREATE INDEX idx_fiscal_notes_admin_bill_id ON fiscal_notes(admin_bill_id);
CREATE INDEX idx_fiscal_notes_processing_status ON fiscal_notes(processing_status);
CREATE INDEX idx_fiscal_notes_created_at ON fiscal_notes(created_at);

CREATE INDEX idx_fiscal_note_versions_fiscal_note_id ON fiscal_note_versions(fiscal_note_id);
CREATE INDEX idx_fiscal_note_versions_version_number ON fiscal_note_versions(version_number);

CREATE INDEX idx_user_fiscal_notes_user_id ON user_fiscal_notes(user_id);
CREATE INDEX idx_user_fiscal_notes_fiscal_note_id ON user_fiscal_notes(fiscal_note_id);

-- ==============================================
-- STEP 5: ROW LEVEL SECURITY
-- ==============================================

-- Enable RLS
ALTER TABLE user_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_legislators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_fiscal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_note_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User bills are only accessible by the user who owns them
CREATE POLICY "Users can manage their own bills" ON user_bills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legislators" ON user_legislators
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own fiscal notes" ON user_fiscal_notes
  FOR ALL USING (auth.uid() = user_id);

-- Fiscal notes are readable by all authenticated users (they reference public bills)
CREATE POLICY "Fiscal notes are readable by authenticated users" ON fiscal_notes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Fiscal note versions are readable by authenticated users" ON fiscal_note_versions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ==============================================
-- STEP 6: TRIGGERS AND FUNCTIONS
-- ==============================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_legislators_updated_at BEFORE UPDATE ON admin_legislators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_bills_updated_at BEFORE UPDATE ON admin_bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_bill_sponsors_updated_at BEFORE UPDATE ON admin_bill_sponsors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_bills_updated_at BEFORE UPDATE ON user_bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_legislators_updated_at BEFORE UPDATE ON user_legislators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fiscal_notes_updated_at BEFORE UPDATE ON fiscal_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_fiscal_notes_updated_at BEFORE UPDATE ON user_fiscal_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- STEP 7: SAMPLE DATA (Optional)
-- ==============================================

-- Sample data will be inserted after users are created
-- You can add sample clients through the UI or API after user registration
