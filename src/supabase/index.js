import { createClient } from "@supabase/supabase-js";
 
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVER_ROLE, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }    
})