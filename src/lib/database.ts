import { supabase } from './supabase'
import type { Bill, Legislator, Note, Meeting, Aide, Associate, AffinityGroup, BillSponsor, IntelligenceSignal, MeetingNote, Client, Contact, BillNote, UserAction } from './supabase'

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

// Bills Service
export const billsDataService = {
  async getAll(): Promise<Bill[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }
    
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

  async updatePriority(id: string, priority: 'High' | 'Medium' | 'Low' | 'None'): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills')
      .update({ priority })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async toggleWatchlist(id: string, watchlist: boolean): Promise<Bill> {
    const { data, error } = await supabase
      .from('bills')
      .update({ watchlist })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getWatchlist(): Promise<Bill[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('watchlist', true)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
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
export const legislatorsDataService = {
  async getAll(): Promise<Legislator[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured. Please check your environment variables.');
    }
    
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
export const notesDataService = {
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
export const meetingsDataService = {
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
export const aidesDataService = {
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
export const associatesDataService = {
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
export const affinityGroupsDataService = {
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
export const billSponsorsDataService = {
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
export const intelligenceSignalsDataService = {
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
export const meetingNotesDataService = {
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

// Clients Service
export const clientsDataService = {
  async getAll(): Promise<Client[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Contacts Service
export const contactsDataService = {
  async getByClientId(clientId: string): Promise<Contact[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('client_id', clientId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async create(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Bill Notes Service
export const billNotesService = {
  async getByBillId(billId: string): Promise<BillNote[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('bill_notes')
      .select('*')
      .eq('bill_id', billId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(note: Omit<BillNote, 'id' | 'created_at' | 'updated_at'>): Promise<BillNote> {
    const { data, error } = await supabase
      .from('bill_notes')
      .insert(note)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<BillNote>): Promise<BillNote> {
    const { data, error } = await supabase
      .from('bill_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('bill_notes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// User Actions Service (for tracking)
export const userActionsDataService = {
  async logAction(action: Omit<UserAction, 'id' | 'created_at'>): Promise<UserAction> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    
    const { data, error } = await supabase
      .from('user_actions')
      .insert(action)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getByUserId(userId: string): Promise<UserAction[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw error
    return data || []
  }
}
