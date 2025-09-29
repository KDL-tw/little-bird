-- Little Bird Database Schema - Clean Version
-- Copy this entire file and paste into Supabase SQL Editor

-- Drop existing triggers first (if they exist)
DROP TRIGGER IF EXISTS update_bills_updated_at ON bills;
DROP TRIGGER IF EXISTS update_legislators_updated_at ON legislators;

-- Drop existing function (if it exists)
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create Bills table
CREATE TABLE IF NOT EXISTS bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_number VARCHAR(50) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  sponsor VARCHAR(255) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('Active', 'Passed', 'Failed')) NOT NULL,
  last_action TEXT,
  position VARCHAR(20) CHECK (position IN ('Support', 'Monitor', 'Oppose', 'None', 'Hypothetical')) DEFAULT 'None',
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Legislators table
CREATE TABLE IF NOT EXISTS legislators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  district VARCHAR(20) NOT NULL,
  party VARCHAR(5) CHECK (party IN ('D', 'R', 'I')) NOT NULL,
  chamber VARCHAR(10) CHECK (chamber IN ('House', 'Senate')) NOT NULL,
  committees TEXT[] DEFAULT '{}',
  phone VARCHAR(20),
  email VARCHAR(255),
  office VARCHAR(100),
  relationship_score VARCHAR(10) CHECK (relationship_score IN ('High', 'Medium', 'Low', 'None')) DEFAULT 'None',
  bills_sponsored INTEGER DEFAULT 0,
  vote_alignment INTEGER DEFAULT 0 CHECK (vote_alignment >= 0 AND vote_alignment <= 100),
  last_contact DATE,
  topics_of_interest TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  topic VARCHAR(255) NOT NULL,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Aides table
CREATE TABLE IF NOT EXISTS aides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Associates table
CREATE TABLE IF NOT EXISTS associates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
  relationship_type VARCHAR(100),
  contact_info TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Affinity Groups table
CREATE TABLE IF NOT EXISTS affinity_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  group_name VARCHAR(255) NOT NULL,
  group_type VARCHAR(100),
  influence_level VARCHAR(10) CHECK (influence_level IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bills_bill_number ON bills(bill_number);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_position ON bills(position);
CREATE INDEX IF NOT EXISTS idx_legislators_district ON legislators(district);
CREATE INDEX IF NOT EXISTS idx_legislators_party ON legislators(party);
CREATE INDEX IF NOT EXISTS idx_legislators_chamber ON legislators(chamber);
CREATE INDEX IF NOT EXISTS idx_legislators_relationship_score ON legislators(relationship_score);
CREATE INDEX IF NOT EXISTS idx_notes_legislator_id ON notes(legislator_id);
CREATE INDEX IF NOT EXISTS idx_meetings_legislator_id ON meetings(legislator_id);
CREATE INDEX IF NOT EXISTS idx_aides_legislator_id ON aides(legislator_id);
CREATE INDEX IF NOT EXISTS idx_associates_legislator_id ON associates(legislator_id);
CREATE INDEX IF NOT EXISTS idx_affinity_groups_legislator_id ON affinity_groups(legislator_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legislators_updated_at BEFORE UPDATE ON legislators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clear existing data and insert fresh sample data
DELETE FROM bills;
DELETE FROM notes;
DELETE FROM meetings;
DELETE FROM aides;
DELETE FROM associates;
DELETE FROM affinity_groups;
DELETE FROM legislators;

-- Insert sample legislators
INSERT INTO legislators (name, district, party, chamber, committees, phone, email, office, relationship_score, bills_sponsored, vote_alignment, last_contact, topics_of_interest) VALUES
('Rep. Julie McCluskie', 'HD-13', 'D', 'House', ARRAY['Appropriations', 'Education'], '(303) 866-2952', 'julie.mccluskie@coleg.gov', 'Room 271', 'High', 8, 85, '2024-01-15', ARRAY['Education', 'Healthcare', 'Environment']),
('Sen. Bob Gardner', 'SD-12', 'R', 'Senate', ARRAY['Judiciary', 'Finance'], '(303) 866-4881', 'bob.gardner@coleg.gov', 'Room 200', 'Medium', 12, 45, '2024-01-12', ARRAY['Criminal Justice', 'Fiscal Policy']),
('Sen. Faith Winter', 'SD-24', 'D', 'Senate', ARRAY['Transportation', 'Energy & Environment'], '(303) 866-4840', 'faith.winter@coleg.gov', 'Room 200', 'High', 18, 95, '2024-01-15', ARRAY['Climate', 'Transportation', 'Social Justice']),
('Rep. Monica Duran', 'HD-23', 'D', 'House', ARRAY['Health & Insurance', 'Public Health'], '(303) 866-2952', 'monica.duran@coleg.gov', 'Room 271', 'Medium', 9, 75, '2024-01-11', ARRAY['Healthcare', 'Public Health', 'Women''s Issues']),
('Rep. Rod Bockenfeld', 'HD-56', 'R', 'House', ARRAY['Agriculture', 'Rural Affairs'], '(303) 866-2940', 'rod.bockenfeld@coleg.gov', 'Room 271', 'Low', 2, 35, '2024-01-02', ARRAY['Agriculture', 'Rural Development', 'Water']),
('Sen. Julie Gonzales', 'SD-34', 'D', 'Senate', ARRAY['Judiciary', 'Health & Human Services'], '(303) 866-4840', 'julie.gonzales@coleg.gov', 'Room 200', 'High', 19, 93, '2024-01-16', ARRAY['Immigration', 'Criminal Justice', 'Healthcare']),
('Sen. Rob Woodward', 'SD-15', 'R', 'Senate', ARRAY['Business Affairs', 'Finance'], '(303) 866-4881', 'rob.woodward@coleg.gov', 'Room 200', 'None', 4, 20, NULL, ARRAY['Business', 'Tax Policy', 'Regulation']),
('Rep. Terri Carver', 'HD-20', 'R', 'House', ARRAY['Education', 'Transportation'], '(303) 866-2911', 'terri.carver@coleg.gov', 'Room 271', 'Low', 3, 30, '2024-01-04', ARRAY['Education', 'Transportation', 'Military']),
('Sen. Kerry Donovan', 'SD-5', 'D', 'Senate', ARRAY['Agriculture', 'Natural Resources'], '(303) 866-4840', 'kerry.donovan@coleg.gov', 'Room 200', 'Medium', 7, 65, '2024-01-08', ARRAY['Agriculture', 'Environment', 'Rural Issues']),
('Rep. Dylan Roberts', 'HD-26', 'D', 'House', ARRAY['Health & Insurance', 'Finance'], '(303) 866-2926', 'dylan.roberts@coleg.gov', 'Room 271', 'High', 11, 88, '2024-01-14', ARRAY['Healthcare', 'Economic Development', 'Environment']);

-- Insert sample bills
INSERT INTO bills (bill_number, title, sponsor, status, last_action, position, ai_analysis) VALUES
('HB24-1001', 'Colorado Clean Energy Act', 'Rep. Julie McCluskie', 'Active', 'Passed House Committee on Energy', 'Support', '{"executive_summary": "This bill establishes ambitious renewable energy targets for Colorado, requiring 100% clean electricity by 2040. It includes provisions for workforce development and economic incentives for clean energy companies.", "key_provisions": ["100% clean electricity by 2040", "Workforce development programs", "Economic incentives for clean energy", "Grid modernization requirements"], "stakeholder_impact": ["Positive for renewable energy companies", "Mixed impact on traditional utilities", "Job creation in clean energy sector"], "similar_bills": ["California SB-100", "New York Climate Act", "Washington Clean Energy Transformation Act"], "passage_likelihood": 75}'),
('SB24-0123', 'Healthcare Access Expansion', 'Sen. Faith Winter', 'Active', 'Introduced in Senate', 'Monitor', '{"executive_summary": "Expands Medicaid eligibility and creates a public option for healthcare coverage in Colorado. Aims to reduce the uninsured rate and improve healthcare access.", "key_provisions": ["Medicaid expansion", "Public option creation", "Premium assistance programs", "Provider network requirements"], "stakeholder_impact": ["Positive for uninsured individuals", "Mixed impact on insurance companies", "Increased demand for healthcare providers"], "similar_bills": ["Washington Cascade Care", "Nevada Public Option", "Colorado Option"], "passage_likelihood": 60}'),
('HB24-0456', 'Education Funding Reform', 'Rep. Dylan Roberts', 'Passed', 'Signed into Law', 'Support', '{"executive_summary": "Comprehensive education funding reform that increases per-pupil funding and addresses equity gaps in Colorado schools.", "key_provisions": ["Increased per-pupil funding", "Equity funding for disadvantaged schools", "Teacher salary increases", "Early childhood education expansion"], "stakeholder_impact": ["Positive for teachers and students", "Increased costs for state budget", "Improved educational outcomes"], "similar_bills": ["California Proposition 98", "Texas HB 3", "Massachusetts Student Opportunity Act"], "passage_likelihood": 100}'),
('SB24-0789', 'Criminal Justice Reform', 'Sen. Julie Gonzales', 'Active', 'Passed Senate Judiciary Committee', 'Support', '{"executive_summary": "Comprehensive criminal justice reform focusing on reducing recidivism, improving reentry programs, and addressing racial disparities in the justice system.", "key_provisions": ["Reentry program expansion", "Bail reform", "Sentencing guidelines review", "Community supervision improvements"], "stakeholder_impact": ["Positive for formerly incarcerated individuals", "Mixed impact on law enforcement", "Reduced prison populations"], "similar_bills": ["California Proposition 47", "New York Bail Reform", "Illinois Criminal Justice Reform"], "passage_likelihood": 70}'),
('HB24-0891', 'Water Rights Modernization', 'Rep. Rod Bockenfeld', 'Failed', 'Defeated in House Committee', 'Oppose', '{"executive_summary": "Proposed changes to Colorado water rights system that would have prioritized agricultural users over municipal and industrial users.", "key_provisions": ["Agricultural water priority", "Municipal water restrictions", "Industrial use limitations", "Water banking system changes"], "stakeholder_impact": ["Positive for agricultural users", "Negative for municipalities", "Mixed impact on industrial users"], "similar_bills": ["Arizona Groundwater Management Act", "California Sustainable Groundwater Management Act"], "passage_likelihood": 0}');

-- Insert sample notes
INSERT INTO notes (legislator_id, content, author) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Very supportive of education funding initiatives', 'John Doe'),
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Met at education committee hearing - very engaged', 'Jane Smith'),
((SELECT id FROM legislators WHERE name = 'Sen. Faith Winter'), 'Strong advocate for climate action, very responsive to constituent concerns', 'Mike Johnson'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Conservative on fiscal issues but open to criminal justice reform', 'Sarah Wilson');

-- Insert sample meetings
INSERT INTO meetings (legislator_id, date, topic, outcome) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), '2024-01-15', 'Education Budget Discussion', 'Positive - committed to support'),
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), '2024-01-08', 'Healthcare Reform', 'Neutral - needs more info'),
((SELECT id FROM legislators WHERE name = 'Sen. Faith Winter'), '2024-01-12', 'Climate Action Plan', 'Very positive - wants to co-sponsor'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), '2024-01-10', 'Criminal Justice Reform', 'Open to discussion - scheduled follow-up');

-- Insert sample aides
INSERT INTO aides (legislator_id, name, role, phone, email, notes) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Sarah Martinez', 'Chief of Staff', '(303) 866-2953', 'sarah.martinez@coleg.gov', 'Very helpful, good relationship'),
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'David Chen', 'Legislative Aide', '(303) 866-2954', 'david.chen@coleg.gov', 'Handles education policy'),
((SELECT id FROM legislators WHERE name = 'Sen. Faith Winter'), 'Maria Rodriguez', 'Chief of Staff', '(303) 866-4841', 'maria.rodriguez@coleg.gov', 'Strong environmental background'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'James Wilson', 'Legislative Director', '(303) 866-4882', 'james.wilson@coleg.gov', 'Conservative policy focus');

-- Insert sample associates
INSERT INTO associates (legislator_id, name, organization, relationship_type, contact_info, notes) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Dr. Lisa Thompson', 'Colorado Education Association', 'Education Advisor', 'lisa.thompson@cea.org', 'Former teacher, education policy expert'),
((SELECT id FROM legislators WHERE name = 'Sen. Faith Winter'), 'Alex Green', 'Sierra Club Colorado', 'Environmental Consultant', 'alex.green@sierraclub.org', 'Climate policy specialist'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Robert Miller', 'Colorado Bar Association', 'Legal Advisor', 'robert.miller@cobar.org', 'Criminal justice expert'),
((SELECT id FROM legislators WHERE name = 'Rep. Dylan Roberts'), 'Jennifer Lee', 'Colorado Hospital Association', 'Healthcare Policy Advisor', 'jennifer.lee@cha.org', 'Healthcare access specialist');

-- Insert sample affinity groups
INSERT INTO affinity_groups (legislator_id, group_name, group_type, influence_level, notes) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Colorado Teachers Association', 'Professional Association', 'High', 'Strong supporter of education funding'),
((SELECT id FROM legislators WHERE name = 'Sen. Faith Winter'), 'Climate Action Coalition', 'Advocacy Group', 'High', 'Key environmental ally'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Colorado Business Roundtable', 'Business Group', 'Medium', 'Fiscal conservative perspective'),
((SELECT id FROM legislators WHERE name = 'Rep. Dylan Roberts'), 'Rural Healthcare Alliance', 'Coalition', 'High', 'Healthcare access advocate');

-- Enable Row Level Security (RLS)
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislators ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE aides ENABLE ROW LEVEL SECURITY;
ALTER TABLE associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affinity_groups ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Allow all operations on bills" ON bills;
DROP POLICY IF EXISTS "Allow all operations on legislators" ON legislators;
DROP POLICY IF EXISTS "Allow all operations on notes" ON notes;
DROP POLICY IF EXISTS "Allow all operations on meetings" ON meetings;
DROP POLICY IF EXISTS "Allow all operations on aides" ON aides;
DROP POLICY IF EXISTS "Allow all operations on associates" ON associates;
DROP POLICY IF EXISTS "Allow all operations on affinity_groups" ON affinity_groups;

-- Create policies (allow all for now - you can restrict later)
CREATE POLICY "Allow all operations on bills" ON bills FOR ALL USING (true);
CREATE POLICY "Allow all operations on legislators" ON legislators FOR ALL USING (true);
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all operations on meetings" ON meetings FOR ALL USING (true);
CREATE POLICY "Allow all operations on aides" ON aides FOR ALL USING (true);
CREATE POLICY "Allow all operations on associates" ON associates FOR ALL USING (true);
CREATE POLICY "Allow all operations on affinity_groups" ON affinity_groups FOR ALL USING (true);
