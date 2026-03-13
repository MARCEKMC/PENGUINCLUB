"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, ShoppingBag, Package,
  BarChart3, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import PenguinLogo from "@/components/PenguinLogo";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/dashboard/citas", icon: Calendar, label: "Citas" },
  { href: "/admin/dashboard/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/dashboard/inventario", icon: Package, label: "Inventario" },
  { href: "/admin/dashboard/estadisticas", icon: BarChart3, label: "Estadísticas" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Sesión cerrada");
    router.push("/admin");
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? "h-full" : "h-full"} flex flex-col`}>
      <div className="p-6 border-b border-[rgba(201,168,76,0.1)]">
        <div className="flex items-center gap-3">
          <PenguinLogo size={40}/>
          <div>
            <p className="font-cinzel text-sm font-bold gold-text">Admin Panel</p>
            <p className="text-xs text-[#f5f0e8]/40 font-inter">El Paraíso de los Ternos</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}>
              <motion.div whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-[rgba(201,168,76,0.12)] text-[#c9a84c] border border-[rgba(201,168,76,0.2)]"
                    : "text-[#f5f0e8]/60 hover:text-[#f5f0e8] hover:bg-[rgba(255,255,255,0.04)]"
                }`}>
                <item.icon size={18}/>
                <span className="font-cinzel text-sm tracking-wide">{item.label}</span>
                {active && <ChevronRight size={14} className="ml-auto"/>}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[rgba(201,168,76,0.1)]">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut size={18}/>
          <span className="font-cinzel text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0e0c0a] flex">
      <div className="hidden lg:block w-64 border-r border-[rgba(201,168,76,0.1)] bg-[#0a0806] fixed h-full z-20">
        <Sidebar/>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"/>
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed left-0 top-0 w-72 h-full bg-[#0a0806] border-r border-[rgba(201,168,76,0.1)] z-40 lg:hidden">
              <button onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[rgba(255,255,255,0.05)]">
                <X size={20} className="text-[#f5f0e8]/60"/>
              </button>
              <Sidebar mobile/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-10 bg-[#0e0c0a]/95 backdrop-blur border-b border-[rgba(201,168,76,0.1)] px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            <Menu size={20} className="text-[#c9a84c]"/>
          </button>
          <div>
            <h1 className="font-cinzel text-lg font-bold text-[#f5f0e8]">
              {navItems.find((i) => i.href === pathname)?.label || "Dashboard"}
            </h1>
            <p className="text-xs text-[#f5f0e8]/40 font-inter">Panel de administración</p>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
