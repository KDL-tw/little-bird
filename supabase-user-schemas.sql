-- USER-SPECIFIC SCHEMAS
-- These schemas reference the admin repository and add user-specific data
-- Each user gets their own personalized view of the data

-- Drop existing user tables
DROP TABLE IF EXISTS user_bill_notes CASCADE;
DROP TABLE IF EXISTS user_bill_actions CASCADE;
DROP TABLE IF EXISTS user_bills CASCADE;
DROP TABLE IF EXISTS user_legislators CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Clients table (user-specific)
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

-- User Bills (user-specific bill tracking)
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

-- User Legislators (user-specific legislator tracking)
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

-- User Bill Notes (detailed notes per bill)
CREATE TABLE user_bill_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_bill_id UUID NOT NULL REFERENCES user_bills(id) ON DELETE CASCADE,
  note_type TEXT CHECK (note_type IN ('General', 'Strategy', 'Meeting', 'Update', 'Analysis')) DEFAULT 'General',
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- User Bill Actions (tracking user actions)
CREATE TABLE user_bill_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_bill_id UUID NOT NULL REFERENCES user_bills(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'viewed', 'edited', 'commented', 'shared', etc.
  action_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
);

-- Create indexes for performance
CREATE INDEX idx_user_bills_user_id ON user_bills(user_id);
CREATE INDEX idx_user_bills_admin_bill_id ON user_bills(admin_bill_id);
CREATE INDEX idx_user_bills_position ON user_bills(position);
CREATE INDEX idx_user_bills_priority ON user_bills(priority);
CREATE INDEX idx_user_bills_watchlist ON user_bills(watchlist);

CREATE INDEX idx_user_legislators_user_id ON user_legislators(user_id);
CREATE INDEX idx_user_legislators_admin_legislator_id ON user_legislators(admin_legislator_id);
CREATE INDEX idx_user_legislators_relationship_score ON user_legislators(relationship_score);

CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Enable Row Level Security
ALTER TABLE user_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_legislators ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bill_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bill_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can manage their own bills" ON user_bills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own legislators" ON user_legislators
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bill notes" ON user_bill_notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bill actions" ON user_bill_actions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_bills_updated_at BEFORE UPDATE ON user_bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_legislators_updated_at BEFORE UPDATE ON user_legislators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_bill_notes_updated_at BEFORE UPDATE ON user_bill_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
