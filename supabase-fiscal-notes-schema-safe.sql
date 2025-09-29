-- FISCAL NOTES SCHEMA (SAFE VERSION)
-- This extends the admin repository to store fiscal note data and AI analysis
-- Handles existing triggers gracefully

-- Add fiscal note fields to admin_bills table (if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_bills' AND column_name = 'fiscal_note_url') THEN
        ALTER TABLE admin_bills ADD COLUMN fiscal_note_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_bills' AND column_name = 'fiscal_note_status') THEN
        ALTER TABLE admin_bills ADD COLUMN fiscal_note_status TEXT CHECK (fiscal_note_status IN ('Not Found', 'Found', 'Processing', 'Error')) DEFAULT 'Not Found';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_bills' AND column_name = 'fiscal_note_last_checked') THEN
        ALTER TABLE admin_bills ADD COLUMN fiscal_note_last_checked TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_bills' AND column_name = 'fiscal_note_agent_version') THEN
        ALTER TABLE admin_bills ADD COLUMN fiscal_note_agent_version TEXT;
    END IF;
END $$;

-- Create fiscal_notes table for storing processed fiscal note data
CREATE TABLE IF NOT EXISTS fiscal_notes (
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
CREATE TABLE IF NOT EXISTS fiscal_note_versions (
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
CREATE TABLE IF NOT EXISTS user_fiscal_notes (
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

-- Create indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_fiscal_notes_admin_bill_id ON fiscal_notes(admin_bill_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_notes_processing_status ON fiscal_notes(processing_status);
CREATE INDEX IF NOT EXISTS idx_fiscal_notes_created_at ON fiscal_notes(created_at);

CREATE INDEX IF NOT EXISTS idx_fiscal_note_versions_fiscal_note_id ON fiscal_note_versions(fiscal_note_id);
CREATE INDEX IF NOT EXISTS idx_fiscal_note_versions_version_number ON fiscal_note_versions(version_number);

CREATE INDEX IF NOT EXISTS idx_user_fiscal_notes_user_id ON user_fiscal_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fiscal_notes_fiscal_note_id ON user_fiscal_notes(fiscal_note_id);

-- Enable Row Level Security (if not already enabled)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'fiscal_notes' AND relrowsecurity = true) THEN
        ALTER TABLE fiscal_notes ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'fiscal_note_versions' AND relrowsecurity = true) THEN
        ALTER TABLE fiscal_note_versions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'user_fiscal_notes' AND relrowsecurity = true) THEN
        ALTER TABLE user_fiscal_notes ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS Policies (if they don't exist)
DO $$ 
BEGIN
    -- Fiscal notes are readable by all authenticated users
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fiscal_notes' AND policyname = 'Fiscal notes are readable by authenticated users') THEN
        CREATE POLICY "Fiscal notes are readable by authenticated users" ON fiscal_notes
          FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    
    -- Fiscal note versions are readable by all authenticated users
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'fiscal_note_versions' AND policyname = 'Fiscal note versions are readable by authenticated users') THEN
        CREATE POLICY "Fiscal note versions are readable by authenticated users" ON fiscal_note_versions
          FOR SELECT USING (auth.role() = 'authenticated');
    END IF;
    
    -- User fiscal notes are only accessible by the user who owns them
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_fiscal_notes' AND policyname = 'Users can manage their own fiscal notes') THEN
        CREATE POLICY "Users can manage their own fiscal notes" ON user_fiscal_notes
          FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (if they don't exist)
DO $$ 
BEGIN
    -- Fiscal notes trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_fiscal_notes_updated_at') THEN
        CREATE TRIGGER update_fiscal_notes_updated_at BEFORE UPDATE ON fiscal_notes
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- User fiscal notes trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_fiscal_notes_updated_at') THEN
        CREATE TRIGGER update_user_fiscal_notes_updated_at BEFORE UPDATE ON user_fiscal_notes
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
