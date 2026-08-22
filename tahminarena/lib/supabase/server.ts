import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    ""
  );
}

function getSupabaseServiceRoleKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    ""
  );
}

export function getSupabaseServerClient(): SupabaseClient {
  const supabaseUrl =
    getSupabaseUrl();

  const serviceRoleKey =
    getSupabaseServiceRoleKey();

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    throw new Error(
      "Supabase server yapılandırması eksik.",
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          "X-Client-Info":
            "tahminarena-server",
        },
      },
    },
  );
}