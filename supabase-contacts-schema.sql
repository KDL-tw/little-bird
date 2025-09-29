-- Enhanced Contacts and Tagging Schema
-- Run this in Supabase SQL Editor

-- Create general contacts table (separate from client contacts)
CREATE TABLE IF NOT EXISTS general_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  organization VARCHAR(255),
  contact_type VARCHAR(50) CHECK (contact_type IN ('Legislator', 'Aide', 'Lobbyist', 'Stakeholder', 'Staff', 'Other')) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  office_location VARCHAR(255),
  notes TEXT,
  relationship_strength VARCHAR(20) CHECK (relationship_strength IN ('Strong', 'Good', 'Neutral', 'Weak', 'Unknown')) DEFAULT 'Unknown',
  last_contact_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bill-contact relationships table
CREATE TABLE IF NOT EXISTS bill_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES general_contacts(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) CHECK (relationship_type IN ('Sponsor', 'Co-sponsor', 'Supporter', 'Opponent', 'Neutral', 'Monitor')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (bill_id, contact_id)
);

-- Create issue tags table
CREATE TABLE IF NOT EXISTS issue_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact-issue relationships
CREATE TABLE IF NOT EXISTS contact_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES general_contacts(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issue_tags(id) ON DELETE CASCADE,
  expertise_level VARCHAR(20) CHECK (expertise_level IN ('Expert', 'Knowledgeable', 'Familiar', 'Basic')) DEFAULT 'Familiar',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (contact_id, issue_id)
);

-- Create bill-issue relationships
CREATE TABLE IF NOT EXISTS bill_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  issue_id UUID REFERENCES issue_tags(id) ON DELETE CASCADE,
  relevance_level VARCHAR(20) CHECK (relevance_level IN ('Primary', 'Secondary', 'Related')) DEFAULT 'Primary',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (bill_id, issue_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_general_contacts_type ON general_contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_general_contacts_organization ON general_contacts(organization);
CREATE INDEX IF NOT EXISTS idx_bill_contacts_bill_id ON bill_contacts(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_contacts_contact_id ON bill_contacts(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_issues_contact_id ON contact_issues(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_issues_issue_id ON contact_issues(issue_id);
CREATE INDEX IF NOT EXISTS idx_bill_issues_bill_id ON bill_issues(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_issues_issue_id ON bill_issues(issue_id);

-- Create triggers
CREATE TRIGGER update_general_contacts_updated_at BEFORE UPDATE ON general_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE general_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_issues ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on general_contacts" ON general_contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on bill_contacts" ON bill_contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations on issue_tags" ON issue_tags FOR ALL USING (true);
CREATE POLICY "Allow all operations on contact_issues" ON contact_issues FOR ALL USING (true);
CREATE POLICY "Allow all operations on bill_issues" ON bill_issues FOR ALL USING (true);

-- Insert sample issue tags
INSERT INTO issue_tags (name, description, color) VALUES
('Clean Energy', 'Renewable energy, solar, wind, carbon reduction', '#10B981'),
('Healthcare', 'Medical care, insurance, public health', '#EF4444'),
('Education', 'Schools, universities, student issues', '#3B82F6'),
('Criminal Justice', 'Law enforcement, prisons, sentencing', '#8B5CF6'),
('Transportation', 'Infrastructure, roads, public transit', '#F59E0B'),
('Environment', 'Climate, conservation, pollution', '#059669'),
('Business', 'Commerce, regulations, economic development', '#6B7280'),
('Technology', 'Digital services, privacy, innovation', '#8B5CF6');

-- Insert sample general contacts
INSERT INTO general_contacts (name, title, organization, contact_type, email, phone, office_location, relationship_strength, notes) VALUES
('Sen. Chris Hansen', 'State Senator', 'Colorado Senate', 'Legislator', 'chris.hansen@coleg.gov', '(303) 866-4882', 'Room 200', 'Strong', 'Key ally on transportation and environment issues'),
('Rep. Julie McCluskie', 'State Representative', 'Colorado House', 'Legislator', 'julie.mccluskie@coleg.gov', '(303) 866-2952', 'Room 271', 'Good', 'Supports clean energy initiatives'),
('Sarah Johnson', 'Chief of Staff', 'Sen. Hansen Office', 'Aide', 'sarah.johnson@coleg.gov', '(303) 866-4883', 'Room 200', 'Strong', 'Very responsive, good gatekeeper'),
('Mike Chen', 'Legislative Director', 'Rep. McCluskie Office', 'Aide', 'mike.chen@coleg.gov', '(303) 866-2953', 'Room 271', 'Good', 'Policy-focused, explains complex issues well'),
('Lisa Rodriguez', 'Government Relations', 'Colorado Business Association', 'Lobbyist', 'lisa@cobiz.org', '(303) 555-0201', 'Denver Office', 'Neutral', 'Represents business interests'),
('Dr. Jennifer Smith', 'Policy Director', 'Colorado Health Coalition', 'Stakeholder', 'jennifer@cohealth.org', '(303) 555-0202', 'Denver Office', 'Good', 'Healthcare policy expert');

-- Link contacts to issues
INSERT INTO contact_issues (contact_id, issue_id, expertise_level, notes) VALUES
((SELECT id FROM general_contacts WHERE name = 'Sen. Chris Hansen'), (SELECT id FROM issue_tags WHERE name = 'Transportation'), 'Expert', 'Primary sponsor of transportation bills'),
((SELECT id FROM general_contacts WHERE name = 'Sen. Chris Hansen'), (SELECT id FROM issue_tags WHERE name = 'Environment'), 'Expert', 'Strong environmental advocate'),
((SELECT id FROM general_contacts WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM issue_tags WHERE name = 'Clean Energy'), 'Expert', 'Leading clean energy advocate'),
((SELECT id FROM general_contacts WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM issue_tags WHERE name = 'Environment'), 'Knowledgeable', 'Supports environmental initiatives'),
((SELECT id FROM general_contacts WHERE name = 'Lisa Rodriguez'), (SELECT id FROM issue_tags WHERE name = 'Business'), 'Expert', 'Business regulation specialist'),
((SELECT id FROM general_contacts WHERE name = 'Dr. Jennifer Smith'), (SELECT id FROM issue_tags WHERE name = 'Healthcare'), 'Expert', 'Healthcare policy expert');

SELECT 'Enhanced contacts and tagging schema created successfully!' as status;
