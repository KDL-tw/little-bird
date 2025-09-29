-- ADMIN DATA REPOSITORY
-- This is a completely independent data repository for admin use only
-- No user data, no authentication dependencies - just raw OpenStates data

-- Drop existing tables
DROP TABLE IF EXISTS admin_bill_sponsors CASCADE;
DROP TABLE IF EXISTS admin_bills CASCADE;
DROP TABLE IF EXISTS admin_legislators CASCADE;

-- Admin Legislators Repository (raw OpenStates data)
CREATE TABLE admin_legislators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- OpenStates core fields
  openstates_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  party TEXT,
  chamber TEXT,
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

-- Admin Bills Repository (raw OpenStates data)
CREATE TABLE admin_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- OpenStates core fields
  openstates_id TEXT UNIQUE NOT NULL,
  session TEXT NOT NULL,
  jurisdiction_id TEXT NOT NULL,
  jurisdiction_name TEXT NOT NULL,
  from_organization_id TEXT NOT NULL,
  from_organization_name TEXT NOT NULL,
  identifier TEXT NOT NULL,
  title TEXT NOT NULL,
  classification TEXT[] DEFAULT '{}',
  subject TEXT[] DEFAULT '{}',
  extras JSONB DEFAULT '{}',
  
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

-- Admin Bill Sponsors Repository (raw OpenStates data)
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

-- Create indexes for performance
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

-- No RLS needed - this is admin data only
-- No authentication required - this is a pure data repository
