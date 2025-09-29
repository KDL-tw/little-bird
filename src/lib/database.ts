import { supabase } from './supabase'
import type { Bill, Legislator, Note, Meeting, Aide, Associate, AffinityGroup, BillSponsor, IntelligenceSignal, MeetingNote } from './supabase'

// Bills Service
export const billsService = {
  async getAll(): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Bill | null> {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(bill: Omit<Bill, 'id' | 'created_at' | 'updated_at'>): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills')
      .insert(bill)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Bill>): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Legislators Service
export const legislatorsService = {
  async getAll(): Promise<Legislator[]> {
    const { data, error } = await supabase
      .from('legislators')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Legislator | null> {
    const { data, error } = await supabase
      .from('legislators')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(legislator: Omit<Legislator, 'id' | 'created_at' | 'updated_at'>): Promise<Legislator> {
    const { data, error } = await supabase
      .from('legislators')
      .insert(legislator)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Legislator>): Promise<Legislator> {
    const { data, error } = await supabase
      .from('legislators')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getWithRelations(id: string) {
    const { data: legislator, error: legislatorError } = await supabase
      .from('legislators')
      .select('*')
      .eq('id', id)
      .single()

    if (legislatorError) throw legislatorError

    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .eq('legislator_id', id)
      .order('created_at', { ascending: false })

    if (notesError) throw notesError

    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
      .eq('legislator_id', id)
      .order('date', { ascending: false })

    if (meetingsError) throw meetingsError

    const { data: aides, error: aidesError } = await supabase
      .from('aides')
      .select('*')
      .eq('legislator_id', id)
      .order('name', { ascending: true })

    if (aidesError) throw aidesError

    const { data: associates, error: associatesError } = await supabase
      .from('associates')
      .select('*')
      .eq('legislator_id', id)
      .order('name', { ascending: true })

    if (associatesError) throw associatesError

    const { data: affinityGroups, error: affinityGroupsError } = await supabase
      .from('affinity_groups')
      .select('*')
      .eq('legislator_id', id)
      .order('group_name', { ascending: true })

    if (affinityGroupsError) throw affinityGroupsError

    return {
      ...legislator,
      notes: notes || [],
      meetings: meetings || [],
      aides: aides || [],
      associates: associates || [],
      affinityGroups: affinityGroups || []
    }
  }
}

// Notes Service
export const notesService = {
  async create(note: Omit<Note, 'id' | 'created_at'>): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByLegislator(legislatorId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Meetings Service
export const meetingsService = {
  async create(meeting: Omit<Meeting, 'id' | 'created_at'>): Promise<Meeting> {
    const { data, error } = await supabase
      .from('meetings')
      .insert(meeting)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByLegislator(legislatorId: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Aides Service
export const aidesService = {
  async create(aide: Omit<Aide, 'id' | 'created_at'>): Promise<Aide> {
    const { data, error } = await supabase
      .from('aides')
      .insert(aide)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByLegislator(legislatorId: string): Promise<Aide[]> {
    const { data, error } = await supabase
      .from('aides')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<Aide>): Promise<Aide> {
    const { data, error } = await supabase
      .from('aides')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('aides')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Associates Service
export const associatesService = {
  async create(associate: Omit<Associate, 'id' | 'created_at'>): Promise<Associate> {
    const { data, error } = await supabase
      .from('associates')
      .insert(associate)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByLegislator(legislatorId: string): Promise<Associate[]> {
    const { data, error } = await supabase
      .from('associates')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<Associate>): Promise<Associate> {
    const { data, error } = await supabase
      .from('associates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('associates')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Affinity Groups Service
export const affinityGroupsService = {
  async create(group: Omit<AffinityGroup, 'id' | 'created_at'>): Promise<AffinityGroup> {
    const { data, error } = await supabase
      .from('affinity_groups')
      .insert(group)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByLegislator(legislatorId: string): Promise<AffinityGroup[]> {
    const { data, error } = await supabase
      .from('affinity_groups')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('group_name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async update(id: string, updates: Partial<AffinityGroup>): Promise<AffinityGroup> {
    const { data, error } = await supabase
      .from('affinity_groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('affinity_groups')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Bill Sponsors Service
export const billSponsorsService = {
  async getAll(): Promise<BillSponsor[]> {
    const { data, error } = await supabase
      .from('bill_sponsors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getByBillId(billId: string): Promise<BillSponsor[]> {
    const { data, error } = await supabase
      .from('bill_sponsors')
      .select('*')
      .eq('bill_id', billId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getByLegislatorId(legislatorId: string): Promise<BillSponsor[]> {
    const { data, error } = await supabase
      .from('bill_sponsors')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(sponsor: Omit<BillSponsor, 'id' | 'created_at'>): Promise<BillSponsor> {
    const { data, error } = await supabase
      .from('bill_sponsors')
      .insert(sponsor)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('bill_sponsors')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Intelligence Signals Service
export const intelligenceSignalsService = {
  async getAll(): Promise<IntelligenceSignal[]> {
    const { data, error } = await supabase
      .from('intelligence_signals')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getByLegislatorId(legislatorId: string): Promise<IntelligenceSignal[]> {
    const { data, error } = await supabase
      .from('intelligence_signals')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getByBillId(billId: string): Promise<IntelligenceSignal[]> {
    const { data, error } = await supabase
      .from('intelligence_signals')
      .select('*')
      .eq('bill_id', billId)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getBySourceType(sourceType: string): Promise<IntelligenceSignal[]> {
    const { data, error } = await supabase
      .from('intelligence_signals')
      .select('*')
      .eq('source_type', sourceType)
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(signal: Omit<IntelligenceSignal, 'id' | 'created_at'>): Promise<IntelligenceSignal> {
    const { data, error } = await supabase
      .from('intelligence_signals')
      .insert(signal)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<IntelligenceSignal>): Promise<IntelligenceSignal> {
    const { data, error } = await supabase
      .from('intelligence_signals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('intelligence_signals')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Meeting Notes Service
export const meetingNotesService = {
  async getAll(): Promise<MeetingNote[]> {
    const { data, error } = await supabase
      .from('meeting_notes')
      .select('*')
      .order('meeting_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getByLegislatorId(legislatorId: string): Promise<MeetingNote[]> {
    const { data, error } = await supabase
      .from('meeting_notes')
      .select('*')
      .eq('legislator_id', legislatorId)
      .order('meeting_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<MeetingNote | null> {
    const { data, error } = await supabase
      .from('meeting_notes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(note: Omit<MeetingNote, 'id' | 'created_at' | 'updated_at'>): Promise<MeetingNote> {
    const { data, error } = await supabase
      .from('meeting_notes')
      .insert(note)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<MeetingNote>): Promise<MeetingNote> {
    const { data, error } = await supabase
      .from('meeting_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('meeting_notes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
