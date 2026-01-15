import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

// Only initialize if we have valid URLs (not placeholder values)
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && !supabaseUrl.includes('your-')) {
  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient