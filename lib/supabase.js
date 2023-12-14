import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dhslqikwphqihnhawcos.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoc2xxaWt3cGhxaWhuaGF3Y29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MTMzOTcsImV4cCI6MjAxNzQ4OTM5N30.CTYEfcEtioeiw6ZwTIPfDzsbvkgssXY2LH6LMNXkw7E";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
