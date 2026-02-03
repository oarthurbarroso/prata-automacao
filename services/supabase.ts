
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURAÇÃO DO SUPABASE
 * 
 * Se você estiver usando um ambiente que suporta variáveis de ambiente (como Vercel ou Local com .env),
 * o sistema usará automaticamente process.env.SUPABASE_URL e process.env.SUPABASE_ANON_KEY.
 * 
 * Se não, você pode substituir as strings abaixo pelas suas credenciais do painel do Supabase:
 * Settings -> API -> Project URL / anon public key
 */

const DEFAULT_URL = 'https://nqnjarmyndonpobjlkej.supabase.co'; // COLE SUA URL AQUI
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xbmphcm15bmRvbnBvYmpsa2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNzQwNjAsImV4cCI6MjA4NTY1MDA2MH0.pmjw5UnEx3h7u8g5Rtw3ctlMiAx_KxrFqtJcxwUXb1U'; // COLE SUA CHAVE ANON AQUI

const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || DEFAULT_KEY;

// Verifica se as credenciais são válidas (não são os exemplos padrão do Supabase)
export const isSupabaseConfigured = 
  !!supabaseUrl && 
  !!supabaseAnonKey && 
  !supabaseUrl.includes('seu-projeto.supabase.co') &&
  supabaseUrl !== 'https://placeholder.supabase.co';

// Inicializa o cliente
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder'
);
