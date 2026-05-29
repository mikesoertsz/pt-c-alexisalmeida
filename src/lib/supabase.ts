import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Returns null when Supabase env vars are not configured. */
export function createAnonClient() {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

/** Server-side only — uses service role key. Returns null when not configured. */
export function createServiceClient() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
