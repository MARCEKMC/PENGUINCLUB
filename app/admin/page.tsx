"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import PenguinLogo from "@/components/PenguinLogo";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Credenciales incorrectas");
        setLoading(false);
      } else {
        toast.success(`Bienvenido, ${data.nombre}`);
        window.location.replace("/admin/dashboard");
      }
    } catch {
      toast.error("Error de conexión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0806] via-[#0e0c0a] to-[#110e0b]"/>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[rgba(201,168,76,0.04)] blur-[120px]"/>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 border border-[rgba(201,168,76,0.2)] shadow-gold">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 2, delay: 0.5 }}
              className="inline-block"
            >
              <PenguinLogo size={60} />
            </motion.div>
            <h1 className="font-cinzel text-2xl font-bold text-[#f5f0e8] mt-4">Panel de Administración</h1>
            <p className="text-sm text-[#f5f0e8]/40 font-inter mt-1">El Paraíso de los Ternos</p>
          </div>

          <div className="flex items-center gap-2 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)] rounded-xl p-3 mb-6">
            <Shield size={16} className="text-[#c9a84c]"/>
            <p className="text-xs text-[#f5f0e8]/60 font-inter">Acceso restringido solo para administradores</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c]/60"/>
              <input
                type="text"
                placeholder="Usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3.5 pl-11 pr-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/60 font-inter transition-colors"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c9a84c]/60"/>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Contraseña"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3.5 pl-11 pr-11 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/60 font-inter transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#f5f0e8]/30 hover:text-[#c9a84c] transition-colors"
              >
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-gold py-4 rounded-xl font-cinzel text-sm tracking-widest uppercase disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#0e0c0a]/30 border-t-[#0e0c0a] rounded-full animate-spin"/>
              ) : (
                <>
                  <Lock size={16}/>
                  Ingresar
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
