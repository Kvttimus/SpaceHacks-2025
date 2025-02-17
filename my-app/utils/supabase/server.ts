import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Manually load `.env.development.local`
dotenv.config({ path: ".env.development.local" });

// DEBUG STATEMENTS ------------------------------------------------
console.log("🔍 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("🔍 Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// END OF DEBUG STATEMENTS -------------------------------------------------------

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;  // Use Service Role Key for writes


// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
