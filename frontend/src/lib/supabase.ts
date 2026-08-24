import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Backend features (topics, comments, likes, views) degrade to "not
// available" rather than crashing the app when the project isn't
// provisioned yet -- see Phase 9 of the backend build-out plan.
export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;
