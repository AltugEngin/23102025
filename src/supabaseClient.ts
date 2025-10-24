import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_URL;
const ANON_KEY = import.meta.env.VITE_ANON as string;

export const supabase = createClient(URL, ANON_KEY);