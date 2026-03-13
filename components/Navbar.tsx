"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import PenguinLogo from "./PenguinLogo";
import { useCartStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/alquiler", label: "Alquilar" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCartStore();
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    supabaseRef.current = createClient();
    const supabase = supabaseRef.current;

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser((data as any)?.user ?? null);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_: unknown, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = async () => {
    if (!supabaseRef.current) return;
    await supabaseRef.current.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleSignOut = async () => {
    if (!supabaseRef.current) return;
    await supabaseRef.current.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    router.refresh();
  };

  const count = itemCount();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0e0c0a]/95 backdrop-blur-xl border-b border-[rgba(201,168,76,0.2)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <PenguinLogo size={44} />
            </motion.div>
            <div className="leading-tight">
              <p className="font-cinzel font-bold text-lg gold-text tracking-wide">
                El Paraíso
              </p>
              <p className="text-[10px] tracking-[0.3em] text-[rgba(201,168,76,0.7)] uppercase font-inter">
                de los Ternos
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-cinzel text-sm tracking-widest uppercase transition-all duration-300 relative group ${
                  pathname === link.href
                    ? "text-[#c9a84c]"
                    : "text-[#f5f0e8]/70 hover:text-[#c9a84c]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-gold-gradient transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative p-2.5 rounded-full glass-card glass-card-hover"
            >
              <ShoppingCart size={20} className="text-[#c9a84c]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-gold-gradient text-[#0e0c0a] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full glass-card glass-card-hover"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <User size={18} className="text-[#c9a84c]" />
                  )}
                  <span className="hidden sm:block text-sm font-inter text-[#f5f0e8]/80 max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(" ")[0] || "Usuario"}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-[#c9a84c] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                    >
                      <div className="p-3 border-b border-[rgba(201,168,76,0.1)]">
                        <p className="text-xs text-[#f5f0e8]/60 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={14} />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSignIn}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full btn-gold text-sm font-cinzel tracking-wider"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Ingresar
              </motion.button>
            )}

            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden p-2 rounded-full glass-card"
            >
              {mobileOpen ? (
                <X size={20} className="text-[#c9a84c]" />
              ) : (
                <Menu size={20} className="text-[#c9a84c]" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#0e0c0a]/98 backdrop-blur-xl border-t border-[rgba(201,168,76,0.1)]"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 font-cinzel text-sm tracking-widest uppercase border-b border-[rgba(201,168,76,0.1)] ${
                      pathname === link.href
                        ? "text-[#c9a84c]"
                        : "text-[#f5f0e8]/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => { handleSignIn(); setMobileOpen(false); }}
                    className="w-full py-3 rounded-xl btn-gold font-cinzel text-sm tracking-wider"
                  >
                    Ingresar con Google
                  </button>
                </motion.div>
              )}
              {user && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="w-full py-3 rounded-xl btn-outline-gold font-cinzel text-sm tracking-wider flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
