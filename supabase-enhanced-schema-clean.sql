-- Enhanced Little Bird Database Schema
-- Run this in Supabase SQL Editor to add new features

-- Add new columns to existing tables
ALTER TABLE bills ADD COLUMN IF NOT EXISTS priority VARCHAR(20) CHECK (priority IN ('High', 'Medium', 'Low', 'None')) DEFAULT 'None';
ALTER TABLE bills ADD COLUMN IF NOT EXISTS watchlist BOOLEAN DEFAULT false;
ALTER TABLE bills ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- Create Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  industry VARCHAR(100),
  relationship_type VARCHAR(50) CHECK (relationship_type IN ('Client', 'Prospect', 'Partner', 'Vendor')) DEFAULT 'Client',
  status VARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Prospect')) DEFAULT 'Active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Bill Notes table
CREATE TABLE IF NOT EXISTS bill_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  note_type VARCHAR(50) CHECK (note_type IN ('General', 'Strategy', 'Meeting', 'Update', 'Analysis')) DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create User Actions table for tracking
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_bills_priority ON bills(priority);
CREATE INDEX IF NOT EXISTS idx_bills_watchlist ON bills(watchlist);
CREATE INDEX IF NOT EXISTS idx_bills_client_id ON bills(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_relationship_type ON clients(relationship_type);
CREATE INDEX IF NOT EXISTS idx_bill_notes_bill_id ON bill_notes(bill_id);
CREATE INDEX IF NOT EXISTS idx_contacts_client_id ON contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_entity_type ON user_actions(entity_type);

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bill_notes_updated_at BEFORE UPDATE ON bill_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all operations on bill_notes" ON bill_notes FOR ALL USING (true);
CREATE POLICY "Allow all operations on contacts" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_actions" ON user_actions FOR ALL USING (true);

-- Insert sample clients
INSERT INTO clients (name, organization, contact_person, email, phone, industry, relationship_type, status, notes) VALUES
('Colorado Clean Energy Coalition', 'CCEC', 'Sarah Johnson', 'sarah@ccec.org', '(303) 555-0101', 'Energy', 'Client', 'Active', 'Major client focused on renewable energy legislation'),
('Healthcare Access Alliance', 'HAA', 'Mike Chen', 'mike@haa.org', '(303) 555-0102', 'Healthcare', 'Client', 'Active', 'Healthcare advocacy group'),
('Small Business Federation', 'SBF', 'Lisa Rodriguez', 'lisa@sbf.org', '(303) 555-0103', 'Business', 'Prospect', 'Active', 'Potential client interested in business regulations');

-- Insert sample contacts
INSERT INTO contacts (client_id, name, title, email, phone, role, notes) VALUES
((SELECT id FROM clients WHERE name = 'Colorado Clean Energy Coalition'), 'Sarah Johnson', 'Executive Director', 'sarah@ccec.org', '(303) 555-0101', 'Primary Contact', 'Very responsive, prefers email communication'),
((SELECT id FROM clients WHERE name = 'Healthcare Access Alliance'), 'Mike Chen', 'Policy Director', 'mike@haa.org', '(303) 555-0102', 'Primary Contact', 'Policy expert, good for technical discussions'),
((SELECT id FROM clients WHERE name = 'Small Business Federation'), 'Lisa Rodriguez', 'Government Relations', 'lisa@sbf.org', '(303) 555-0103', 'Primary Contact', 'New contact, building relationship');

-- Update some bills with client relationships
UPDATE bills SET client_id = (SELECT id FROM clients WHERE name = 'Colorado Clean Energy Coalition') WHERE bill_number = 'HB24-1001';
UPDATE bills SET client_id = (SELECT id FROM clients WHERE name = 'Healthcare Access Alliance') WHERE bill_number = 'SB24-0123';

-- Insert sample bill notes
INSERT INTO bill_notes (bill_id, content, author, note_type) VALUES
((SELECT id FROM bills WHERE bill_number = 'HB24-1001'), 'Client CCEC is very supportive of this bill. They want to ensure the 2040 target is maintained.', 'John Doe', 'Strategy'),
((SELECT id FROM bills WHERE bill_number = 'SB24-0123'), 'Met with HAA leadership yesterday. They have concerns about rural coverage provisions.', 'Jane Smith', 'Meeting'),
((SELECT id FROM bills WHERE bill_number = 'HB24-0456'), 'Opposition from law enforcement groups is stronger than expected. Need to address public safety concerns.', 'Mike Johnson', 'Analysis');

-- Success message
SELECT 'Enhanced Little Bird database schema created successfully!' as status;
