-- OpenStates-Aligned Schema for Little Bird
-- This schema matches OpenStates API v3 structure exactly, then adds user-specific fields

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS user_bill_notes CASCADE;
DROP TABLE IF EXISTS user_bill_actions CASCADE;
DROP TABLE IF EXISTS user_bills CASCADE;
DROP TABLE IF EXISTS bills CASCADE;
DROP TABLE IF EXISTS legislators CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Create clients table first (referenced by user_bills)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create legislators table (referenced by bills)
CREATE TABLE legislators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create bills table with OpenStates structure
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- OpenStates core fields (exact match)
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
  
  -- System fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create user_bills junction table for user-specific data
CREATE TABLE user_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
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
  UNIQUE(user_id, bill_id)
);

-- Create user_bill_actions table for tracking user actions
CREATE TABLE user_bill_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'viewed', 'edited', 'commented', 'shared', etc.
  action_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create user_bill_notes table for detailed notes
CREATE TABLE user_bill_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  note_type TEXT CHECK (note_type IN ('General', 'Strategy', 'Meeting', 'Update', 'Analysis')) DEFAULT 'General',
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create indexes for performance
CREATE INDEX idx_bills_openstates_id ON bills(openstates_id);
CREATE INDEX idx_bills_session ON bills(session);
CREATE INDEX idx_bills_identifier ON bills(identifier);
CREATE INDEX idx_bills_jurisdiction ON bills(jurisdiction_id);
CREATE INDEX idx_bills_updated_at ON bills(updated_at_openstates);

CREATE INDEX idx_user_bills_user_id ON user_bills(user_id);
CREATE INDEX idx_user_bills_bill_id ON user_bills(bill_id);
CREATE INDEX idx_user_bills_position ON user_bills(position);
CREATE INDEX idx_user_bills_priority ON user_bills(priority);
CREATE INDEX idx_user_bills_watchlist ON user_bills(watchlist);

CREATE INDEX idx_legislators_openstates_id ON legislators(openstates_id);
CREATE INDEX idx_legislators_chamber ON legislators(chamber);
CREATE INDEX idx_legislators_party ON legislators(party);

-- Enable Row Level Security
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bill_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bill_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislators ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Bills are readable by all authenticated users
CREATE POLICY "Bills are readable by authenticated users" ON bills
  FOR SELECT USING (auth.role() = 'authenticated');

-- User bills are only accessible by the user who owns them
CREATE POLICY "Users can manage their own bills" ON user_bills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bill actions" ON user_bill_actions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bill notes" ON user_bill_notes
  FOR ALL USING (auth.uid() = user_id);

-- Legislators are readable by all authenticated users
CREATE POLICY "Legislators are readable by authenticated users" ON legislators
  FOR SELECT USING (auth.role() = 'authenticated');

-- Clients are readable by all authenticated users (for now)
CREATE POLICY "Clients are readable by authenticated users" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO clients (name, industry, contact_email) VALUES
  ('Colorado Clean Energy Coalition', 'Energy', 'contact@cocec.org'),
  ('Healthcare Access Alliance', 'Healthcare', 'info@healthcareaccess.org'),
  ('Criminal Justice Reform Network', 'Legal', 'contact@cjrn.org');

INSERT INTO legislators (openstates_id, name, party, chamber, district, email) VALUES
  ('ocd-person/12345', 'Rep. Julie McCluskie', 'Democratic', 'House', 'HD-13', 'julie.mccluskie@coleg.gov'),
  ('ocd-person/67890', 'Sen. Faith Winter', 'Democratic', 'Senate', 'SD-24', 'faith.winter@coleg.gov'),
  ('ocd-person/11111', 'Rep. Bob Gardner', 'Republican', 'House', 'HD-21', 'bob.gardner@coleg.gov');

-- Insert sample bills (matching OpenStates structure)
INSERT INTO bills (
  openstates_id, session, jurisdiction_id, jurisdiction_name,
  from_organization_id, from_organization_name, identifier, title,
  classification, subject, created_at_openstates, updated_at_openstates,
  first_action_date, latest_action_date, latest_action_description,
  openstates_url
) VALUES
  (
    'ocd-bill/sample-1',
    '2025B',
    'ocd-jurisdiction/country:us/state:co/government',
    'Colorado',
    'ocd-organization/house-co',
    'House',
    'HB 25B-1001',
    'Colorado Clean Energy Act',
    ARRAY['bill'],
    ARRAY['Energy', 'Environment'],
    '2025-01-01T00:00:00Z',
    '2025-01-15T00:00:00Z',
    '2025-01-01T00:00:00Z',
    '2025-01-15T00:00:00Z',
    'Passed House Committee on Energy',
    'https://openstates.org/co/bills/2025B/HB25B-1001/'
  ),
  (
    'ocd-bill/sample-2',
    '2025B',
    'ocd-jurisdiction/country:us/state:co/government',
    'Colorado',
    'ocd-organization/senate-co',
    'Senate',
    'SB 25B-0123',
    'Healthcare Access Expansion',
    ARRAY['bill'],
    ARRAY['Healthcare', 'Insurance'],
    '2025-01-01T00:00:00Z',
    '2025-01-15T00:00:00Z',
    '2025-01-01T00:00:00Z',
    '2025-01-15T00:00:00Z',
    'Introduced in Senate',
    'https://openstates.org/co/bills/2025B/SB25B-0123/'
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_bills_updated_at BEFORE UPDATE ON user_bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_bill_notes_updated_at BEFORE UPDATE ON user_bill_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legislators_updated_at BEFORE UPDATE ON legislators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
