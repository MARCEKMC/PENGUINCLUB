import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const noop = () => {};

const serverMock: any = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: noop } } }),
    signInWithOAuth: async () => ({}),
    signOut: async () => ({}),
    exchangeCodeForSession: async () => ({ data: { session: null }, error: null }),
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    eq: () => ({ data: [], error: null }),
    order: () => ({ data: [], error: null }),
    limit: () => ({ data: [], error: null }),
    single: () => ({ data: null, error: null }),
    lt: () => ({ data: [], error: null }),
    gte: () => ({ data: [], error: null }),
    neq: () => ({ data: [], error: null }),
    in: () => ({ data: [], error: null }),
  }),
  rpc: async () => ({ data: null, error: null }),
};

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return serverMock;
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
};
