-- Enhanced Legislator CRM System Schema
-- Run this in Supabase SQL Editor

-- First, let's enhance the existing legislators table with additional fields
ALTER TABLE legislators ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE legislators ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255);
ALTER TABLE legislators ADD COLUMN IF NOT EXISTS term_start DATE;
ALTER TABLE legislators ADD COLUMN IF NOT EXISTS term_end DATE;
ALTER TABLE legislators ADD COLUMN IF NOT EXISTS leadership_role VARCHAR(100);
ALTER TABLE legislators ADD COLUMN IF NOT EXISTS voting_record JSONB;
ALTER TABLE legislators ADD COLUMN IF NOT EXISTS campaign_finance JSONB;

-- Create Staff Members table
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  influence_level VARCHAR(20) CHECK (influence_level IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  policy_areas TEXT[] DEFAULT '{}',
  notes TEXT,
  is_primary_contact BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Organizations table (caucuses, PACs, committees, etc.)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization_type VARCHAR(50) CHECK (organization_type IN ('Caucus', 'PAC', 'Committee', 'Lobbying Firm', 'Nonprofit', 'Trade Association', 'Other')) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address TEXT,
  influence_level VARCHAR(20) CHECK (influence_level IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  political_leaning VARCHAR(20) CHECK (political_leaning IN ('Liberal', 'Conservative', 'Moderate', 'Nonpartisan')) DEFAULT 'Nonpartisan',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Legislator-Organization relationships
CREATE TABLE IF NOT EXISTS legislator_organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) CHECK (relationship_type IN ('Member', 'Board Member', 'Chair', 'Vice Chair', 'Treasurer', 'Secretary', 'Advisor', 'Supporter', 'Opponent')) NOT NULL,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  influence_score INTEGER CHECK (influence_score >= 0 AND influence_score <= 100) DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (legislator_id, organization_id)
);

-- Create Policy Areas table
CREATE TABLE IF NOT EXISTS policy_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50) CHECK (category IN ('Economic', 'Social', 'Environmental', 'Infrastructure', 'Healthcare', 'Education', 'Criminal Justice', 'Other')) DEFAULT 'Other',
  color VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Legislator-Policy Area relationships
CREATE TABLE IF NOT EXISTS legislator_policy_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  policy_area_id UUID REFERENCES policy_areas(id) ON DELETE CASCADE,
  expertise_level VARCHAR(20) CHECK (expertise_level IN ('Expert', 'Knowledgeable', 'Familiar', 'Basic')) DEFAULT 'Familiar',
  interest_level VARCHAR(20) CHECK (interest_level IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (legislator_id, policy_area_id)
);

-- Create Network Connections table (relationships between legislators)
CREATE TABLE IF NOT EXISTS legislator_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_a_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  legislator_b_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  connection_type VARCHAR(50) CHECK (connection_type IN ('Ally', 'Opponent', 'Neutral', 'Mentor', 'Mentee', 'Colleague', 'Friend', 'Rival')) NOT NULL,
  strength VARCHAR(20) CHECK (strength IN ('Strong', 'Medium', 'Weak')) DEFAULT 'Medium',
  notes TEXT,
  evidence TEXT[], -- Sources or evidence of the relationship
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (legislator_a_id, legislator_b_id),
  CHECK (legislator_a_id != legislator_b_id)
);

-- Create Meeting Records table
CREATE TABLE IF NOT EXISTS meeting_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  meeting_type VARCHAR(50) CHECK (meeting_type IN ('In-person', 'Phone', 'Video', 'Committee Hearing', 'Event', 'Fundraiser', 'Town Hall')) NOT NULL,
  meeting_date DATE NOT NULL,
  duration_minutes INTEGER,
  location VARCHAR(255),
  attendees TEXT[] DEFAULT '{}',
  agenda_items TEXT[] DEFAULT '{}',
  discussion_points TEXT,
  outcomes TEXT,
  follow_up_actions TEXT[] DEFAULT '{}',
  next_meeting_date DATE,
  notes TEXT,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Communication Log table
CREATE TABLE IF NOT EXISTS communication_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  communication_type VARCHAR(50) CHECK (communication_type IN ('Email', 'Phone', 'Text', 'Letter', 'Social Media', 'Meeting', 'Event')) NOT NULL,
  communication_date TIMESTAMP WITH TIME ZONE NOT NULL,
  subject VARCHAR(255),
  content TEXT,
  direction VARCHAR(20) CHECK (direction IN ('Inbound', 'Outbound')) NOT NULL,
  response_required BOOLEAN DEFAULT false,
  response_received BOOLEAN DEFAULT false,
  response_date TIMESTAMP WITH TIME ZONE,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staff_members_legislator_id ON staff_members(legislator_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_influence_level ON staff_members(influence_level);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(organization_type);
CREATE INDEX IF NOT EXISTS idx_organizations_influence_level ON organizations(influence_level);
CREATE INDEX IF NOT EXISTS idx_legislator_organizations_legislator_id ON legislator_organizations(legislator_id);
CREATE INDEX IF NOT EXISTS idx_legislator_organizations_organization_id ON legislator_organizations(organization_id);
CREATE INDEX IF NOT EXISTS idx_legislator_policy_areas_legislator_id ON legislator_policy_areas(legislator_id);
CREATE INDEX IF NOT EXISTS idx_legislator_policy_areas_policy_area_id ON legislator_policy_areas(policy_area_id);
CREATE INDEX IF NOT EXISTS idx_legislator_connections_legislator_a_id ON legislator_connections(legislator_a_id);
CREATE INDEX IF NOT EXISTS idx_legislator_connections_legislator_b_id ON legislator_connections(legislator_b_id);
CREATE INDEX IF NOT EXISTS idx_meeting_records_legislator_id ON meeting_records(legislator_id);
CREATE INDEX IF NOT EXISTS idx_meeting_records_meeting_date ON meeting_records(meeting_date);
CREATE INDEX IF NOT EXISTS idx_communication_log_legislator_id ON communication_log(legislator_id);
CREATE INDEX IF NOT EXISTS idx_communication_log_communication_date ON communication_log(communication_date);

-- Create triggers for updated_at
CREATE TRIGGER update_staff_members_updated_at BEFORE UPDATE ON staff_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legislator_organizations_updated_at BEFORE UPDATE ON legislator_organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legislator_connections_updated_at BEFORE UPDATE ON legislator_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meeting_records_updated_at BEFORE UPDATE ON meeting_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislator_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislator_policy_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislator_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_log ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on staff_members" ON staff_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow all operations on legislator_organizations" ON legislator_organizations FOR ALL USING (true);
CREATE POLICY "Allow all operations on policy_areas" ON policy_areas FOR ALL USING (true);
CREATE POLICY "Allow all operations on legislator_policy_areas" ON legislator_policy_areas FOR ALL USING (true);
CREATE POLICY "Allow all operations on legislator_connections" ON legislator_connections FOR ALL USING (true);
CREATE POLICY "Allow all operations on meeting_records" ON meeting_records FOR ALL USING (true);
CREATE POLICY "Allow all operations on communication_log" ON communication_log FOR ALL USING (true);

-- Insert sample policy areas
INSERT INTO policy_areas (name, description, category, color) VALUES
('Clean Energy', 'Renewable energy, solar, wind, carbon reduction', 'Environmental', '#10B981'),
('Healthcare Access', 'Medicaid expansion, public option, insurance reform', 'Healthcare', '#EF4444'),
('Education Funding', 'K-12 funding, higher education, teacher pay', 'Education', '#3B82F6'),
('Criminal Justice Reform', 'Sentencing reform, bail reform, prison reform', 'Criminal Justice', '#8B5CF6'),
('Transportation Infrastructure', 'Roads, bridges, public transit, bike lanes', 'Infrastructure', '#F59E0B'),
('Climate Change', 'Carbon emissions, environmental protection', 'Environmental', '#059669'),
('Small Business Support', 'Tax incentives, regulations, economic development', 'Economic', '#6B7280'),
('Mental Health', 'Mental health services, substance abuse treatment', 'Healthcare', '#EC4899'),
('Housing Affordability', 'Affordable housing, rent control, homelessness', 'Social', '#84CC16'),
('Technology Privacy', 'Data protection, digital rights, cybersecurity', 'Other', '#8B5CF6');

-- Insert sample organizations
INSERT INTO organizations (name, organization_type, description, website, influence_level, political_leaning) VALUES
('Colorado Democratic Caucus', 'Caucus', 'Democratic Party caucus in Colorado legislature', 'https://coloradodems.org', 'High', 'Liberal'),
('Colorado Republican Caucus', 'Caucus', 'Republican Party caucus in Colorado legislature', 'https://cologop.org', 'High', 'Conservative'),
('Colorado Clean Energy Coalition', 'Nonprofit', 'Environmental advocacy organization', 'https://ccec.org', 'Medium', 'Liberal'),
('Colorado Business Association', 'Trade Association', 'Business advocacy and lobbying group', 'https://cobiz.org', 'High', 'Conservative'),
('Colorado Health Coalition', 'Nonprofit', 'Healthcare advocacy organization', 'https://cohealth.org', 'Medium', 'Liberal'),
('Colorado Education Association', 'Trade Association', 'Teachers union and education advocacy', 'https://coloradoea.org', 'High', 'Liberal'),
('Colorado Oil & Gas Association', 'Trade Association', 'Oil and gas industry advocacy', 'https://coga.org', 'High', 'Conservative'),
('Colorado Progressive Action', 'PAC', 'Progressive political action committee', 'https://coprog.org', 'Medium', 'Liberal'),
('Colorado Conservative Alliance', 'PAC', 'Conservative political action committee', 'https://coconserv.org', 'Medium', 'Conservative');

-- Insert sample staff members
INSERT INTO staff_members (legislator_id, name, role, email, phone, influence_level, policy_areas, notes, is_primary_contact) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Sarah Johnson', 'Chief of Staff', 'sarah.johnson@coleg.gov', '(303) 866-2953', 'High', ARRAY['Clean Energy', 'Environment'], 'Very organized and responsive. Good gatekeeper.', true),
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Mike Chen', 'Legislative Director', 'mike.chen@coleg.gov', '(303) 866-2954', 'Medium', ARRAY['Education', 'Healthcare'], 'Policy-focused. Good at explaining complex issues.', false),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Lisa Rodriguez', 'Chief of Staff', 'lisa.rodriguez@coleg.gov', '(303) 866-4883', 'High', ARRAY['Criminal Justice', 'Fiscal Policy'], 'Conservative policy expert. Very influential.', true),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'David Kim', 'Legislative Aide', 'david.kim@coleg.gov', '(303) 866-4884', 'Low', ARRAY['Transportation'], 'New staff member. Still learning the ropes.', false);

-- Insert sample legislator-organization relationships
INSERT INTO legislator_organizations (legislator_id, organization_id, relationship_type, influence_score, notes) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM organizations WHERE name = 'Colorado Democratic Caucus'), 'Member', 90, 'Active member, attends all caucus meetings'),
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM organizations WHERE name = 'Colorado Clean Energy Coalition'), 'Supporter', 75, 'Strong supporter of clean energy initiatives'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), (SELECT id FROM organizations WHERE name = 'Colorado Republican Caucus'), 'Member', 85, 'Senior member, influential in caucus decisions'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), (SELECT id FROM organizations WHERE name = 'Colorado Business Association'), 'Supporter', 70, 'Supports business-friendly policies'),
((SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), (SELECT id FROM legislators WHERE name = 'Colorado Democratic Caucus'), 'Member', 80, 'Active member, focuses on healthcare issues'),
((SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), (SELECT id FROM organizations WHERE name = 'Colorado Health Coalition'), 'Supporter', 85, 'Strong advocate for healthcare access');

-- Insert sample legislator-policy area relationships
INSERT INTO legislator_policy_areas (legislator_id, policy_area_id, expertise_level, interest_level, notes) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM policy_areas WHERE name = 'Clean Energy'), 'Expert', 'High', 'Primary sponsor of clean energy bills'),
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM policy_areas WHERE name = 'Climate Change'), 'Expert', 'High', 'Strong environmental advocate'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), (SELECT id FROM policy_areas WHERE name = 'Criminal Justice Reform'), 'Expert', 'High', 'Leading criminal justice reform advocate'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), (SELECT id FROM policy_areas WHERE name = 'Small Business Support'), 'Knowledgeable', 'Medium', 'Supports business-friendly policies'),
((SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), (SELECT id FROM policy_areas WHERE name = 'Healthcare Access'), 'Expert', 'High', 'Healthcare policy expert'),
((SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), (SELECT id FROM policy_areas WHERE name = 'Mental Health'), 'Knowledgeable', 'Medium', 'Supports mental health initiatives');

-- Insert sample legislator connections
INSERT INTO legislator_connections (legislator_a_id, legislator_b_id, connection_type, strength, notes, evidence) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), 'Ally', 'Strong', 'Work together on environmental and healthcare issues', ARRAY['Co-sponsored HB24-1001', 'Joint press conference on clean energy']),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), (SELECT id FROM legislators WHERE name = 'Rep. Mike Weissman'), 'Colleague', 'Medium', 'Work together on criminal justice issues', ARRAY['Co-sponsored HB24-0456', 'Committee meetings together']),
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), (SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Neutral', 'Weak', 'Different parties, limited interaction', ARRAY['Occasional committee hearings', 'Minimal collaboration']);

-- Insert sample meeting records
INSERT INTO meeting_records (legislator_id, meeting_type, meeting_date, duration_minutes, location, attendees, agenda_items, discussion_points, outcomes, follow_up_actions, notes, author) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'In-person', '2024-03-15', 60, 'Capitol Building Room 271', ARRAY['John Doe', 'Sarah Johnson'], ARRAY['HB24-1001 Clean Energy Act', 'Committee strategy'], 'Discussed amendments for HB24-1001. Rep. McCluskie is firm on the 2040 target. Committee staff supportive.', 'Agreed to support bill with minor amendments', ARRAY['Draft amendment language', 'Schedule follow-up with committee staff'], 'Very productive meeting. Rep. McCluskie is committed to clean energy goals.', 'John Doe'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Phone', '2024-03-12', 30, 'Phone call', ARRAY['Mike Johnson'], ARRAY['HB24-0456 Criminal Justice Reform'], 'Sen. Gardner expressed concerns about public safety implications. Wants more data on recidivism rates.', 'Need to provide additional data', ARRAY['Provide recidivism data', 'Schedule follow-up meeting'], 'Sen. Gardner is cautious but open to discussion.', 'Mike Johnson');

-- Insert sample communication log
INSERT INTO communication_log (legislator_id, communication_type, communication_date, subject, content, direction, response_required, author) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Email', '2024-03-20 10:00:00+00', 'HB24-1001 Committee Update', 'Thank you for the meeting. Committee staff is reviewing the amendments. Will follow up next week.', 'Outbound', true, 'John Doe'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Phone', '2024-03-18 14:30:00+00', 'HB24-0456 Discussion', 'Called to discuss concerns about public safety provisions. Left voicemail.', 'Outbound', true, 'Mike Johnson'),
((SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), 'Email', '2024-03-19 09:15:00+00', 'Healthcare Coalition Meeting', 'Invitation to healthcare coalition meeting next week. RSVP requested.', 'Inbound', true, 'Jane Smith');

SELECT 'Enhanced Legislator CRM system created successfully!' as status;
