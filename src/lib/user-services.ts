// USER SERVICES
// These services pull from the admin repository and add user-specific data
// No mock data - everything comes from the live admin repository

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseKey &&
         supabaseUrl !== 'https://placeholder.supabase.co';
};

// User Bills Service - pulls from admin repository + user data
export const userBillsService = {
  async getByUser(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_bills')
      .select(`
        *,
        admin_bills!inner(
          *,
          admin_bill_sponsors(
            *,
            admin_legislators(*)
          )
        ),
        clients(name)
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addToUser(userId: string, adminBillId: string, userData: {
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
        admin_bill_id: adminBillId,
        position: userData.position || 'None',
        priority: userData.priority || 'None',
        watchlist: userData.watchlist || false,
        client_id: userData.client_id || null,
        notes: userData.notes || null
      })
      .select(`
        *,
        admin_bills!inner(
          *,
          admin_bill_sponsors(
            *,
            admin_legislators(*)
          )
        ),
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
        admin_bills!inner(
          *,
          admin_bill_sponsors(
            *,
            admin_legislators(*)
          )
        ),
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

  async search(userId: string, query: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_bills')
      .select(`
        *,
        admin_bills!inner(
          *,
          admin_bill_sponsors(
            *,
            admin_legislators(*)
          )
        ),
        clients(name)
      `)
      .eq('user_id', userId)
      .or(`admin_bills.title.ilike.%${query}%,admin_bills.identifier.ilike.%${query}%`)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// User Legislators Service - pulls from admin repository + user data
export const userLegislatorsService = {
  async getByUser(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_legislators')
      .select(`
        *,
        admin_legislators!inner(*)
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addToUser(userId: string, adminLegislatorId: string, userData: {
    relationship_score?: string;
    last_contact_date?: string;
    notes?: string;
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_legislators')
      .insert({
        user_id: userId,
        admin_legislator_id: adminLegislatorId,
        relationship_score: userData.relationship_score || 'None',
        last_contact_date: userData.last_contact_date || null,
        notes: userData.notes || null
      })
      .select(`
        *,
        admin_legislators!inner(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserLegislator(userId: string, userLegislatorId: string, updates: {
    relationship_score?: string;
    last_contact_date?: string;
    notes?: string;
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('user_legislators')
      .update(updates)
      .eq('id', userLegislatorId)
      .eq('user_id', userId)
      .select(`
        *,
        admin_legislators!inner(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async search(userId: string, query: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('user_legislators')
      .select(`
        *,
        admin_legislators!inner(*)
      `)
      .eq('user_id', userId)
      .or(`admin_legislators.name.ilike.%${query}%,admin_legislators.district.ilike.%${query}%`)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Admin Repository Service - for searching available bills/legislators
export const adminRepositoryService = {
  async searchBills(query: string, limit: number = 20): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('admin_bills')
      .select(`
        *,
        admin_bill_sponsors(
          *,
          admin_legislators(*)
        )
      `)
      .or(`title.ilike.%${query}%,identifier.ilike.%${query}%`)
      .order('updated_at_openstates', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async searchLegislators(query: string, limit: number = 20): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('admin_legislators')
      .select('*')
      .or(`name.ilike.%${query}%,district.ilike.%${query}%`)
      .order('name')
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getRecentBills(limit: number = 20): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('admin_bills')
      .select(`
        *,
        admin_bill_sponsors(
          *,
          admin_legislators(*)
        )
      `)
      .order('updated_at_openstates', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};

// Clients Service
export const clientsService = {
  async getByUser(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(userId: string, clientData: {
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
      .insert({
        ...clientData,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
