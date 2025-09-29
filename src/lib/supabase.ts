import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Bill {
  id: string
  bill_number: string
  title: string
  sponsor: string
  status: 'Active' | 'Passed' | 'Failed'
  last_action: string
  position: 'Support' | 'Monitor' | 'Oppose' | 'None' | 'Hypothetical'
  ai_analysis?: {
    executive_summary: string
    key_provisions: string[]
    stakeholder_impact: string[]
    similar_bills: string[]
    passage_likelihood: number
  }
  created_at: string
  updated_at: string
}

export interface Legislator {
  id: string
  name: string
  district: string
  party: 'D' | 'R' | 'I'
  chamber: 'House' | 'Senate'
  committees: string[]
  phone: string
  email: string
  office: string
  twitter_handle?: string
  facebook_page?: string
  website?: string
  relationship_score: 'High' | 'Medium' | 'Low' | 'None'
  bills_sponsored: number
  vote_alignment: number
  last_contact: string
  topics_of_interest: string[]
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  legislator_id: string
  content: string
  author: string
  created_at: string
}

export interface Meeting {
  id: string
  legislator_id: string
  date: string
  topic: string
  outcome: string
  created_at: string
}

export interface Relationship {
  id: string
  legislator_id: string
  relationship_type: 'aide' | 'associate' | 'affinity_group'
  name: string
  role?: string
  contact_info?: string
  notes?: string
  created_at: string
}

export interface Aide {
  id: string
  legislator_id: string
  name: string
  role: string
  phone?: string
  email?: string
  notes?: string
  created_at: string
}

export interface Associate {
  id: string
  legislator_id: string
  name: string
  organization?: string
  relationship_type: string
  contact_info?: string
  notes?: string
  created_at: string
}

export interface AffinityGroup {
  id: string
  legislator_id: string
  group_name: string
  group_type: string
  influence_level: 'High' | 'Medium' | 'Low'
  notes?: string
  created_at: string
}

// New tables for complete CRM system
export interface BillSponsor {
  id: string
  bill_id: string
  legislator_id: string
  sponsor_type: 'Primary' | 'Co-sponsor' | 'Co-prime'
  created_at: string
}

export interface IntelligenceSignal {
  id: string
  source_type: 'Twitter' | 'YouTube' | 'News' | 'Press Release'
  source_id: string
  legislator_id?: string
  bill_id?: string
  content: string
  url?: string
  published_at: string
  relevance_score: number
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  extracted_entities: string[]
  processed_at: string
  created_at: string
}

export interface MeetingNote {
  id: string
  legislator_id: string
  meeting_date: string
  meeting_type: 'In-person' | 'Phone' | 'Video' | 'Committee Hearing' | 'Event'
  topic: string
  attendees: string[]
  notes: string
  action_items: string[]
  follow_up_date?: string
  outcome?: string
  author: string
  created_at: string
  updated_at: string
}
