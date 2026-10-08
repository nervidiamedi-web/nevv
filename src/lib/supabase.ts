import { createClient } from '@supabase/supabase-js';

// Read public environment variables safely from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate whether real credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project.supabase.co') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Use ONLY the Supabase anonymous public key in frontend code.
// Never expose or use the Supabase service_role key in frontend code.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl.trim() : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey.trim() : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export default supabase;
