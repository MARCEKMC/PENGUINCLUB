"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Calendar, Package, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Stats {
  pedidos_hoy: number;
  citas_pendientes: number;
  productos_bajo_stock: number;
  ingresos_mes: number;
  pedidos_recientes: any[];
  citas_recientes: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    pedidos_hoy: 0, citas_pendientes: 0, productos_bajo_stock: 0,
    ingresos_mes: 0, pedidos_recientes: [], citas_recientes: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split("T")[0];
      const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [{ data: pedidosHoy }, { data: citasPend }, { data: stockBajo }, { data: ingresos }, { data: recPedidos }, { data: recCitas }] = await Promise.all([
        supabase.from("pedidos").select("id", { count: "exact" }).gte("created_at", today),
        supabase.from("citas").select("id", { count: "exact" }).eq("estado", "pendiente"),
        supabase.from("productos").select("id", { count: "exact" }).lt("stock", 5),
        supabase.from("pedidos").select("total").gte("created_at", firstDay).neq("estado", "cancelado"),
        supabase.from("pedidos").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("citas").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const totalIngresos = (ingresos || []).reduce((acc: number, p: any) => acc + Number(p.total), 0);

      setStats({
        pedidos_hoy: (pedidosHoy as any)?.length || 0,
        citas_pendientes: (citasPend as any)?.length || 0,
        productos_bajo_stock: (stockBajo as any)?.length || 0,
        ingresos_mes: totalIngresos,
        pedidos_recientes: recPedidos || [],
        citas_recientes: recCitas || [],
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Pedidos hoy", value: stats.pedidos_hoy, icon: ShoppingBag, color: "text-green-400", bg: "bg-green-500/10", href: "/admin/dashboard/pedidos" },
    { label: "Citas pendientes", value: stats.citas_pendientes, icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10", href: "/admin/dashboard/citas" },
    { label: "Stock bajo", value: stats.productos_bajo_stock, icon: Package, color: "text-orange-400", bg: "bg-orange-500/10", href: "/admin/dashboard/inventario" },
    { label: "Ingresos del mes", value: `S/ ${stats.ingresos_mes.toFixed(0)}`, icon: TrendingUp, color: "text-[#c9a84c]", bg: "bg-[rgba(201,168,76,0.1)]", href: "/admin/dashboard/estadisticas" },
  ];

  const estadoColor: Record<string, string> = {
    pendiente: "text-yellow-400 bg-yellow-500/10",
    confirmado: "text-blue-400 bg-blue-500/10",
    confirmada: "text-blue-400 bg-blue-500/10",
    en_camino: "text-purple-400 bg-purple-500/10",
    entregado: "text-green-400 bg-green-500/10",
    completada: "text-green-400 bg-green-500/10",
    cancelado: "text-red-400 bg-red-500/10",
    cancelada: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}>
            <Link href={c.href}>
              <div className="glass-card glass-card-hover rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                    <c.icon size={20} className={c.color}/>
                  </div>
                </div>
                <p className={`text-2xl font-bold font-cinzel ${c.color}`}>
                  {loading ? "..." : c.value}
                </p>
                <p className="text-xs text-[#f5f0e8]/50 font-inter mt-1">{c.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cinzel text-base font-bold text-[#f5f0e8]">Pedidos Recientes</h2>
            <Link href="/admin/dashboard/pedidos" className="text-xs text-[#c9a84c] hover:underline font-inter">Ver todos</Link>
          </div>
          {stats.pedidos_recientes.length === 0 && !loading ? (
            <p className="text-sm text-[#f5f0e8]/30 font-inter text-center py-8">No hay pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {stats.pedidos_recientes.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <div>
                    <p className="text-sm font-cinzel text-[#f5f0e8]/80">{p.nombre_cliente}</p>
                    <p className="text-xs text-[#f5f0e8]/40 font-inter">{new Date(p.created_at).toLocaleDateString("es-PE")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#c9a84c] font-bold">S/ {Number(p.total).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-inter ${estadoColor[p.estado] || "text-[#f5f0e8]/40"}`}>
                      {p.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cinzel text-base font-bold text-[#f5f0e8]">Citas Recientes</h2>
            <Link href="/admin/dashboard/citas" className="text-xs text-[#c9a84c] hover:underline font-inter">Ver todas</Link>
          </div>
          {stats.citas_recientes.length === 0 && !loading ? (
            <p className="text-sm text-[#f5f0e8]/30 font-inter text-center py-8">No hay citas aún</p>
          ) : (
            <div className="space-y-3">
              {stats.citas_recientes.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
                  <div>
                    <p className="text-sm font-cinzel text-[#f5f0e8]/80">{c.nombre_cliente}</p>
                    <div className="flex items-center gap-1 text-xs text-[#f5f0e8]/40 font-inter">
                      <Clock size={10}/>{c.fecha} · {c.hora?.slice(0,5)}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-inter ${estadoColor[c.estado] || "text-[#f5f0e8]/40"}`}>
                    {c.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
