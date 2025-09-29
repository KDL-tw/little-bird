-- Little Bird Safe Database Schema - Step by Step
-- Run this in Supabase SQL Editor

-- Step 1: Clean up existing data (safe approach)
DO $$ 
BEGIN
    -- Drop foreign key constraints first
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'meeting_notes') THEN
        ALTER TABLE meeting_notes DROP CONSTRAINT IF EXISTS meeting_notes_legislator_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'intelligence_signals') THEN
        ALTER TABLE intelligence_signals DROP CONSTRAINT IF EXISTS intelligence_signals_legislator_id_fkey;
        ALTER TABLE intelligence_signals DROP CONSTRAINT IF EXISTS intelligence_signals_bill_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bill_sponsors') THEN
        ALTER TABLE bill_sponsors DROP CONSTRAINT IF EXISTS bill_sponsors_bill_id_fkey;
        ALTER TABLE bill_sponsors DROP CONSTRAINT IF EXISTS bill_sponsors_legislator_id_fkey;
    END IF;
    
    -- Drop dependent tables
    DROP TABLE IF EXISTS meeting_notes CASCADE;
    DROP TABLE IF EXISTS intelligence_signals CASCADE;
    DROP TABLE IF EXISTS bill_sponsors CASCADE;
    DROP TABLE IF EXISTS affinity_groups CASCADE;
    DROP TABLE IF EXISTS associates CASCADE;
    DROP TABLE IF EXISTS aides CASCADE;
    DROP TABLE IF EXISTS meetings CASCADE;
    DROP TABLE IF EXISTS notes CASCADE;
    DROP TABLE IF EXISTS bills CASCADE;
    DROP TABLE IF EXISTS legislators CASCADE;
END $$;

-- Step 2: Create core tables first (no dependencies)
CREATE TABLE legislators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  district VARCHAR(20) NOT NULL,
  party VARCHAR(5) CHECK (party IN ('D', 'R', 'I')) NOT NULL,
  chamber VARCHAR(10) CHECK (chamber IN ('House', 'Senate')) NOT NULL,
  committees TEXT[] DEFAULT '{}',
  phone VARCHAR(20),
  email VARCHAR(255),
  office VARCHAR(100),
  twitter_handle VARCHAR(50),
  facebook_page VARCHAR(255),
  website VARCHAR(255),
  relationship_score VARCHAR(10) CHECK (relationship_score IN ('High', 'Medium', 'Low', 'None')) DEFAULT 'None',
  bills_sponsored INTEGER DEFAULT 0,
  vote_alignment INTEGER DEFAULT 0 CHECK (vote_alignment >= 0 AND vote_alignment <= 100),
  last_contact DATE,
  topics_of_interest TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bills (
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

-- Step 3: Create dependent tables
CREATE TABLE bill_sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  sponsor_type VARCHAR(20) CHECK (sponsor_type IN ('Primary', 'Co-sponsor', 'Co-prime')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (bill_id, legislator_id)
);

CREATE TABLE intelligence_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type VARCHAR(50) CHECK (source_type IN ('Twitter', 'YouTube', 'News', 'Press Release')) NOT NULL,
  source_id VARCHAR(255) NOT NULL,
  legislator_id UUID REFERENCES legislators(id) ON DELETE SET NULL,
  bill_id UUID REFERENCES bills(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  relevance_score INTEGER DEFAULT 0 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  sentiment VARCHAR(20) CHECK (sentiment IN ('Positive', 'Negative', 'Neutral')),
  extracted_entities TEXT[] DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meeting_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  meeting_date DATE NOT NULL,
  meeting_type VARCHAR(50) CHECK (meeting_type IN ('In-person', 'Phone', 'Video', 'Committee Hearing', 'Event')) NOT NULL,
  topic VARCHAR(255) NOT NULL,
  attendees TEXT[] DEFAULT '{}',
  notes TEXT NOT NULL,
  action_items TEXT[] DEFAULT '{}',
  follow_up_date DATE,
  outcome TEXT,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  topic VARCHAR(255) NOT NULL,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE aides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE associates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
  relationship_type VARCHAR(100),
  contact_info TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE affinity_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legislator_id UUID REFERENCES legislators(id) ON DELETE CASCADE,
  group_name VARCHAR(255) NOT NULL,
  group_type VARCHAR(100),
  influence_level VARCHAR(10) CHECK (influence_level IN ('High', 'Medium', 'Low')) DEFAULT 'Medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes
CREATE INDEX idx_bills_bill_number ON bills(bill_number);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_position ON bills(position);
CREATE INDEX idx_legislators_district ON legislators(district);
CREATE INDEX idx_legislators_party ON legislators(party);
CREATE INDEX idx_legislators_chamber ON legislators(chamber);
CREATE INDEX idx_legislators_relationship_score ON legislators(relationship_score);
CREATE INDEX idx_notes_legislator_id ON notes(legislator_id);
CREATE INDEX idx_meetings_legislator_id ON meetings(legislator_id);
CREATE INDEX idx_aides_legislator_id ON aides(legislator_id);
CREATE INDEX idx_associates_legislator_id ON associates(legislator_id);
CREATE INDEX idx_affinity_groups_legislator_id ON affinity_groups(legislator_id);
CREATE INDEX idx_bill_sponsors_bill_id ON bill_sponsors(bill_id);
CREATE INDEX idx_bill_sponsors_legislator_id ON bill_sponsors(legislator_id);
CREATE INDEX idx_intelligence_signals_legislator_id ON intelligence_signals(legislator_id);
CREATE INDEX idx_intelligence_signals_bill_id ON intelligence_signals(bill_id);
CREATE INDEX idx_intelligence_signals_source_type ON intelligence_signals(source_type);
CREATE INDEX idx_meeting_notes_legislator_id ON meeting_notes(legislator_id);
CREATE INDEX idx_meeting_notes_meeting_date ON meeting_notes(meeting_date);

-- Step 5: Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 6: Create triggers
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legislators_updated_at BEFORE UPDATE ON legislators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meeting_notes_updated_at BEFORE UPDATE ON meeting_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Enable Row Level Security
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislators ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligence_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE aides ENABLE ROW LEVEL SECURITY;
ALTER TABLE associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affinity_groups ENABLE ROW LEVEL SECURITY;

-- Step 8: Create policies
CREATE POLICY "Allow all operations on bills" ON bills FOR ALL USING (true);
CREATE POLICY "Allow all operations on legislators" ON legislators FOR ALL USING (true);
CREATE POLICY "Allow all operations on bill_sponsors" ON bill_sponsors FOR ALL USING (true);
CREATE POLICY "Allow all operations on intelligence_signals" ON intelligence_signals FOR ALL USING (true);
CREATE POLICY "Allow all operations on meeting_notes" ON meeting_notes FOR ALL USING (true);
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all operations on meetings" ON meetings FOR ALL USING (true);
CREATE POLICY "Allow all operations on aides" ON aides FOR ALL USING (true);
CREATE POLICY "Allow all operations on associates" ON associates FOR ALL USING (true);
CREATE POLICY "Allow all operations on affinity_groups" ON affinity_groups FOR ALL USING (true);

-- Step 9: Insert sample data
INSERT INTO legislators (name, district, party, chamber, committees, phone, email, office, twitter_handle, facebook_page, website, relationship_score, bills_sponsored, vote_alignment, last_contact, topics_of_interest) VALUES
('Rep. Julie McCluskie', 'HD-13', 'D', 'House', ARRAY['Appropriations', 'Education'], '(303) 866-2952', 'julie.mccluskie@coleg.gov', 'Room 271', '@JulieMcCluskie', 'facebook.com/JulieMcCluskie', 'julie.mccluskie.com', 'High', 8, 85, '2024-01-15', ARRAY['Education', 'Healthcare', 'Environment']),
('Sen. Bob Gardner', 'SD-12', 'R', 'Senate', ARRAY['Judiciary', 'Finance'], '(303) 866-4881', 'bob.gardner@coleg.gov', 'Room 200', '@BobGardnerCO', 'facebook.com/BobGardnerCO', 'bobgardner.com', 'Medium', 12, 45, '2024-01-12', ARRAY['Criminal Justice', 'Fiscal Policy']),
('Rep. Faith Winter', 'HD-35', 'D', 'House', ARRAY['Health & Insurance', 'Transportation'], '(303) 866-2582', 'faith.winter@coleg.gov', 'Room 200', '@FaithWinterCO', 'facebook.com/FaithWinterCO', 'faithwinter.com', 'Low', 5, 75, '2024-01-10', ARRAY['Healthcare', 'Transportation']),
('Sen. Chris Hansen', 'SD-31', 'D', 'Senate', ARRAY['Finance', 'Transportation'], '(303) 866-4882', 'chris.hansen@coleg.gov', 'Room 200', '@ChrisHansenCO', 'facebook.com/ChrisHansenCO', 'chrishansen.com', 'High', 15, 90, '2024-01-20', ARRAY['Transportation', 'Environment', 'Education']),
('Rep. Mike Weissman', 'HD-36', 'D', 'House', ARRAY['Judiciary', 'Health & Insurance'], '(303) 866-2942', 'mike.weissman@coleg.gov', 'Room 271', '@MikeWeissmanCO', 'facebook.com/MikeWeissmanCO', 'mikeweissman.com', 'Medium', 7, 65, '2024-01-08', ARRAY['Healthcare', 'Criminal Justice']);

INSERT INTO bills (bill_number, title, sponsor, status, last_action, position, ai_analysis) VALUES
('HB24-1001', 'Colorado Clean Energy Act', 'Rep. Julie McCluskie', 'Active', 'Passed House Committee on Energy', 'Support', '{"executive_summary": "This bill establishes ambitious renewable energy targets for Colorado, requiring utilities to achieve 80% clean energy by 2030 and 100% by 2040.", "key_provisions": ["Sets 80% renewable energy target by 2030", "Establishes 100% clean energy goal by 2040", "Creates clean energy transition fund", "Provides workforce development programs"], "stakeholder_impact": ["Utilities: Significant infrastructure investment required", "Ratepayers: Potential short-term cost increases", "Workers: Job creation in clean energy sector", "Environment: Major reduction in carbon emissions"], "similar_bills": ["California SB 100 (2018)", "New Mexico HB 50 (2019)", "Nevada AB 206 (2019)"], "passage_likelihood": 75}'),
('SB24-0123', 'Healthcare Access Expansion', 'Sen. Faith Winter', 'Active', 'Introduced in Senate', 'Monitor', '{"executive_summary": "Expands Medicaid eligibility and creates a public option for health insurance coverage in Colorado.", "key_provisions": ["Expands Medicaid to 138% of federal poverty level", "Creates Colorado public option", "Establishes prescription drug affordability board", "Increases mental health coverage requirements"], "stakeholder_impact": ["Patients: Expanded access to affordable healthcare", "Providers: Increased patient volume but lower reimbursement rates", "Insurers: Competition from public option", "State: Significant budget implications"], "similar_bills": ["Washington HB 1523 (2019)", "Nevada SB 420 (2019)", "Colorado HB 1234 (2023)"], "passage_likelihood": 60}'),
('HB24-0456', 'Criminal Justice Reform Act', 'Rep. Bob Gardner', 'Active', 'Passed House Judiciary Committee', 'Oppose', '{"executive_summary": "Comprehensive criminal justice reform including bail reform, sentencing guidelines, and reentry programs.", "key_provisions": ["Eliminates cash bail for non-violent offenses", "Establishes alternative sentencing programs", "Creates reentry support services", "Requires racial impact statements for new criminal laws"], "stakeholder_impact": ["Defendants: Reduced pretrial detention", "Courts: Increased caseload management challenges", "Law enforcement: Concerns about public safety", "Communities: Potential reduction in incarceration rates"], "similar_bills": ["New Jersey S 2584 (2017)", "Illinois HB 3653 (2021)", "California AB 109 (2011)"], "passage_likelihood": 45}');

-- Step 10: Insert relationship data
INSERT INTO bill_sponsors (bill_id, legislator_id, sponsor_type) VALUES
((SELECT id FROM bills WHERE bill_number = 'HB24-1001'), (SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Primary'),
((SELECT id FROM bills WHERE bill_number = 'SB24-0123'), (SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), 'Primary'),
((SELECT id FROM bills WHERE bill_number = 'HB24-0456'), (SELECT id FROM legislators WHERE name = 'Rep. Bob Gardner'), 'Primary');

INSERT INTO notes (legislator_id, content, author) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Very responsive to environmental issues. Strong supporter of clean energy initiatives.', 'John Doe'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Conservative on fiscal issues but open to criminal justice reform with proper safeguards.', 'Mike Johnson'),
((SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), 'Progressive on healthcare issues. Strong advocate for expanding access.', 'Sarah Wilson');

INSERT INTO aides (legislator_id, name, role, phone, email, notes) VALUES
((SELECT id FROM legislators WHERE name = 'Rep. Julie McCluskie'), 'Sarah Johnson', 'Chief of Staff', '(303) 866-2953', 'sarah.johnson@coleg.gov', 'Very organized and responsive.'),
((SELECT id FROM legislators WHERE name = 'Sen. Bob Gardner'), 'Mike Chen', 'Legislative Director', '(303) 866-4882', 'mike.chen@coleg.gov', 'Policy-focused. Good at explaining complex issues.'),
((SELECT id FROM legislators WHERE name = 'Rep. Faith Winter'), 'Lisa Rodriguez', 'Communications Director', '(303) 866-2583', 'lisa.rodriguez@coleg.gov', 'Strong media relations.');

-- Success message
SELECT 'Little Bird database schema created successfully!' as status;
