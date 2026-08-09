import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Keep localStorage auth (used by the rest of the app) in sync with the
 * Supabase session. Call once at app startup.
 */
export function initAuthListener() {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      const user = session.user;
      localStorage.setItem('token', session.access_token);
      localStorage.setItem(
        'userName',
        user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          (user.email ? user.email.split('@')[0] : 'User')
      );
      localStorage.setItem('userEmail', user.email || '');
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }
    window.dispatchEvent(new Event('authChange'));
  });
}

/** Get the current logged-in Supabase user (or null). */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

/** Fetch the current user's transactions (newest first). */
export async function getMyTransactions() {
  const user = await getCurrentUser();
  if (!user) return { data: [], error: null };

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

/** Fetch the current user's active subscription (if any). */
export async function getMySubscription() {
  const user = await getCurrentUser();
  if (!user) return { data: null, error: null };

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const isActive = data && data.status === 'active' && (!data.expires_at || new Date(data.expires_at) > new Date());
  return { data: isActive ? data : null, error };
}
