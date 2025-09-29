// Database service for OpenStates-aligned schema
// This replaces the mock data with real database operations

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseKey &&
         supabaseUrl !== 'https://placeholder.supabase.co';
};

// Bills service - works with the new OpenStates-aligned schema
export const billsDataService = {
  async getAll(): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        user_bills!inner(
          id,
          position,
          priority,
          watchlist,
          notes,
          client_id,
          clients(name)
        )
      `)
      .order('updated_at_openstates', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByUser(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('bills')
      .select(`
        *,
        user_bills!inner(
          id,
          position,
          priority,
          watchlist,
          notes,
          client_id,
          clients(name)
        )
      `)
      .eq('user_bills.user_id', userId)
      .order('updated_at_openstates', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addToUser(userId: string, billId: string, userData: {
    position?: string;
    priority?: string;
    watchlist?: boolean;
    client_id?: string;
    notes?: string;
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_bills')
      .insert({
        user_id: userId,
        bill_id: billId,
        position: userData.position || 'None',
        priority: userData.priority || 'None',
        watchlist: userData.watchlist || false,
        client_id: userData.client_id || null,
        notes: userData.notes || null
      })
      .select(`
        *,
        bills(*),
        clients(name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserBill(userId: string, userBillId: string, updates: {
    position?: string;
    priority?: string;
    watchlist?: boolean;
    client_id?: string;
    notes?: string;
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_bills')
      .update(updates)
      .eq('id', userBillId)
      .eq('user_id', userId)
      .select(`
        *,
        bills(*),
        clients(name)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromUser(userId: string, userBillId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('user_bills')
      .delete()
      .eq('id', userBillId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async search(query: string, userId?: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    let supabaseQuery = supabase
      .from('bills')
      .select(`
        *,
        user_bills(
          id,
          position,
          priority,
          watchlist,
          notes,
          client_id,
          clients(name)
        )
      `)
      .or(`title.ilike.%${query}%,identifier.ilike.%${query}%`)
      .order('updated_at_openstates', { ascending: false });

    if (userId) {
      supabaseQuery = supabaseQuery.eq('user_bills.user_id', userId);
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data || [];
  }
};

// Legislators service
export const legislatorsDataService = {
  async getAll(): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('legislators')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getByChamber(chamber: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('legislators')
      .select('*')
      .eq('chamber', chamber)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async search(query: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('legislators')
      .select('*')
      .or(`name.ilike.%${query}%,district.ilike.%${query}%`)
      .order('name');

    if (error) throw error;
    return data || [];
  }
};

// Clients service
export const clientsDataService = {
  async getAll(): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(clientData: {
    name: string;
    industry?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// User bill notes service
export const userBillNotesService = {
  async getByBill(userId: string, billId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_bill_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('bill_id', billId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(noteData: {
    user_id: string;
    bill_id: string;
    note_type: string;
    content: string;
    is_private?: boolean;
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_bill_notes')
      .insert(noteData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
