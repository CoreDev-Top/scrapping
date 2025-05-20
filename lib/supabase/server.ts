import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

export const getSupabaseServerClient = () => {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
}
