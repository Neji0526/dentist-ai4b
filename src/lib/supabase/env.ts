/**
 * The site is designed to render fully without a Supabase project attached.
 * When the env vars are missing we fall back to the bundled demo content in
 * `src/lib/demo-data.ts`, so `npm run dev` works on a fresh clone.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
