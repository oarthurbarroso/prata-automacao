
import { supabase, isSupabaseConfigured } from './supabase';
import { Client, Appointment, Transaction, User, Deal } from '../types';

const handleFetchError = (error: any) => {
  console.error("Supabase API Error:", error);
  if (!isSupabaseConfigured) {
    throw new Error("Configuração do Supabase ausente. Verifique as variáveis SUPABASE_URL e SUPABASE_ANON_KEY.");
  }
  if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
    throw new Error("Não foi possível conectar ao banco de dados. Verifique sua conexão com a internet ou se a URL do Supabase está correta.");
  }
  throw error;
};

export const api = {
  // --- AUTH ---
  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return null;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn("Perfil não encontrado, usando dados básicos do Auth.");
      }

      return {
        id: user.id,
        name: profile?.name || user.email?.split('@')[0] || 'Usuário',
        email: user.email!,
        role: profile?.role || 'ATTENDANT',
        active: true,
        avatar: profile?.avatar || `https://ui-avatars.com/api/?name=${user.email}`
      };
    } catch (e) {
      return null; // Falha silenciosa no Auth inicial
    }
  },

  login: async (email: string, password: string) => {
    if (!isSupabaseConfigured) handleFetchError(new Error("Configuração ausente"));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data.user;
    } catch (e) {
      handleFetchError(e);
    }
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  // --- CLIENTS ---
  getClients: async (): Promise<Client[]> => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      handleFetchError(e);
      return [];
    }
  },

  saveClient: async (client: Client) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .upsert(client)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (e) {
      handleFetchError(e);
    }
  },

  deleteClient: async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (e) {
      handleFetchError(e);
    }
  },

  // --- STORAGE ---
  uploadPhoto: async (file: File, path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('clinical-photos')
        .upload(path, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('clinical-photos')
        .getPublicUrl(data.path);
        
      return publicUrl;
    } catch (e) {
      handleFetchError(e);
    }
  },

  // --- APPOINTMENTS ---
  getAppointments: async (): Promise<Appointment[]> => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch (e) {
      handleFetchError(e);
      return [];
    }
  },

  saveAppointment: async (app: Appointment) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .upsert(app)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      handleFetchError(e);
    }
  },

  // --- FINANCE ---
  getTransactions: async (): Promise<Transaction[]> => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      handleFetchError(e);
      return [];
    }
  },

  saveTransaction: async (tx: Transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(tx)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      handleFetchError(e);
    }
  },

  // --- DEALS ---
  getDeals: async (): Promise<Deal[]> => {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*');
      if (error) throw error;
      return data || [];
    } catch (e) {
      handleFetchError(e);
      return [];
    }
  },

  saveDeal: async (deal: Deal) => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .upsert(deal)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      handleFetchError(e);
    }
  }
};
