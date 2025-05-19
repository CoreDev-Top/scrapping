import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire app
const supabaseUrl = "https://lvzethrztedhbxoppkmb.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2emV0aHJ6dGVkaGJ4b3Bwa21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDYyNTksImV4cCI6MjA2MzIyMjI1OX0.LdGEbXyLABwlYzzkmxC0_lfeuTrAJ0StoD94Qpij2AM"

// Create a singleton to avoid multiple instances
let supabase: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return supabase
}
