import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let supabaseClient:
  | SupabaseClient
  | null = null;

function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  );
}

function getSupabaseAnonKey(): string {
  return (
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}

export function getSupabaseClient(): SupabaseClient {
  const supabaseUrl =
    getSupabaseUrl();

  const supabaseAnonKey =
    getSupabaseAnonKey();

  if (
    !supabaseUrl ||
    !supabaseAnonKey
  ) {
    throw new Error(
      "Supabase client yapılandırması eksik.",
    );
  }

  if (!supabaseClient) {
    supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      },
    );
  }

  return supabaseClient;
}