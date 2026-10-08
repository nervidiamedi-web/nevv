import { createClient } from '@supabase/supabase-js';

// Read public environment variables safely from Vite or Next.js conventions
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL;
const envAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// User's Supabase project credentials
export const DEFAULT_SUPABASE_URL = 'https://drshhnwymodvvglsqezp.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Qsj89nV7zqqheqxMMSR4gQ_ZDaRYPBo';

const supabaseUrl = (envUrl && !envUrl.includes('your-project.supabase.co') && !envUrl.includes('placeholder'))
  ? envUrl
  : DEFAULT_SUPABASE_URL;

const supabaseAnonKey = (envAnonKey && !envAnonKey.includes('your-anon-key') && !envAnonKey.includes('placeholder'))
  ? envAnonKey
  : DEFAULT_SUPABASE_ANON_KEY;

// Validate whether credentials are provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== ''
);

// Use ONLY the Supabase anonymous public key in frontend code.
// Never expose or use the Supabase service_role key in frontend code.
export const supabase = createClient(
  supabaseUrl.trim(),
  supabaseAnonKey.trim(),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export default supabase;
