import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://skwxrejzqmxtrgjpvtjj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrd3hyZWp6cW14dHJnanB2dGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMzg2NzksImV4cCI6MjEwMzcxNDY3OX0.62oGvesRqb7jhJWro0pD2v7VJhSG3y0ado_w9d9lA0w";

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 