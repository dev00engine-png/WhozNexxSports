import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient