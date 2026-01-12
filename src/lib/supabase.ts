import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bsxuzfctiddqpyzzekqg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzeHV6ZmN0aWRkcXB5enpla3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMjgxOTgsImV4cCI6MjA4MzgwNDE5OH0.6PD5LqccwPWJbOGvRJOrKfwtpmfNGRWjQrWpjahLrGg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
