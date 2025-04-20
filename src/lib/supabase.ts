import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// 연결 테스트
supabase.from('api_keys').select('count').then(({ data, error }) => {
  if (error) {
    console.error('Supabase 연결 테스트 실패:', error.message);
  } else {
    console.log('Supabase 연결 성공:', data);
  }
}); 