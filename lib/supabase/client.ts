import { createBrowserClient } from "@supabase/ssr";

const noop = () => {};
const noopAsync = async () => ({});

const serverMock: any = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: noop } },
    }),
    signInWithOAuth: noopAsync,
    signOut: noopAsync,
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
  if (typeof window === "undefined") return serverMock;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return serverMock;
  return createBrowserClient(url, key);
};
