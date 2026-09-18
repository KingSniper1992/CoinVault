import { createClient } from "@supabase/supabase-js";

// Usamos el fallback a string vacío para que no tire error en build si falta,
// pero Supabase en runtime indicará que faltan credenciales si están vacías.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
