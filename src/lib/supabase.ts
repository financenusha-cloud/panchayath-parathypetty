import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Subscribe to real-time grievance updates from Supabase PostgreSQL
 */
export function subscribeToGrievancesRealtime(onGrievanceChange: (payload: any) => void) {
  if (!supabase) return null;

  const channel = supabase
    .channel('grievances-realtime-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'grievances' },
      (payload) => {
        onGrievanceChange(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
