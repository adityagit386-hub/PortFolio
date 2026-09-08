import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabasePublicKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined

const configured = Boolean(supabaseUrl && supabasePublicKey)

export const supabase: SupabaseClient | null = configured
  ? createClient(supabaseUrl!, supabasePublicKey!)
  : null
