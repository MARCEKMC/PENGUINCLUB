import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SignJWT } from "jose";

const FALLBACK_USERNAME = "admin";
const FALLBACK_PASSWORD = "TernosParaiso2025!";

async function issueToken(payload: { sub: string; username: string; nombre: string }) {
  const secret = new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "fallback-secret-min-32-chars-long!!"
  );
  return new SignJWT({ ...payload, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let nombre = "Administrador";

  if (!url || !serviceKey) {
    if (username !== FALLBACK_USERNAME || password !== FALLBACK_PASSWORD) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
    }
  } else {
    const supabase = createClient(url, serviceKey);
    const { data, error } = await supabase.rpc("verify_admin", {
      p_username: username,
      p_password: password,
    });
    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
    }
    nombre = data[0].nombre ?? nombre;
  }

  const token = await issueToken({ sub: username, username, nombre });

  const response = NextResponse.json({ ok: true, nombre });
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return response;
}
