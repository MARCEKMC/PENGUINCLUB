"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Calendar, Package, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Stat {
  total_ingresos: number;
  total_pedidos: number;
  total_citas: number;
  pedidos_mes: number;
  ingresos_mes: number;
  categoria_top: string;
  productos_count: number;
  tasa_entrega: number;
}

export default function EstadisticasPage() {
  const [stat, setStat] = useState<Stat | null>(null);
  const [loading, setLoading] = useState(true);
  const [pedidosPorEstado, setPedidosPorEstado] = useState<Record<string, number>>({});
  const [citasPorEstado, setCitasPorEstado] = useState<Record<string, number>>({});
  const [ingresosSemanales, setIngresosSemanales] = useState<{dia:string;monto:number}[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchAll = async () => {
      const firstDayMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [{ data: pedidos }, { data: citas }, { data: productos }] = await Promise.all([
        supabase.from("pedidos").select("*"),
        supabase.from("citas").select("*"),
        supabase.from("productos").select("id", { count: "exact" }),
      ]);

      const totalIngresos = (pedidos || []).filter((p: any) => p.estado !== "cancelado")
        .reduce((a: number, p: any) => a + Number(p.total), 0);
      const pedidosMes = (pedidos || []).filter((p: any) => p.created_at >= firstDayMes).length;
      const ingresosMes = (pedidos || []).filter((p: any) => p.created_at >= firstDayMes && p.estado !== "cancelado")
        .reduce((a: number, p: any) => a + Number(p.total), 0);
      const entregados = (pedidos || []).filter((p: any) => p.estado === "entregado").length;

      const estadosPed: Record<string, number> = {};
      (pedidos || []).forEach((p: any) => { estadosPed[p.estado] = (estadosPed[p.estado] || 0) + 1; });

      const estadosCita: Record<string, number> = {};
      (citas || []).forEach((c: any) => { estadosCita[c.estado] = (estadosCita[c.estado] || 0) + 1; });

      const catCount: Record<string, number> = {};
      (pedidos || []).forEach((p: any) => {
        (p.items as any[] || []).forEach((i: any) => {
          catCount[i.categoria] = (catCount[i.categoria] || 0) + i.cantidad;
        });
      });
      const topCat = Object.entries(catCount).sort(([,a],[,b]) => b-a)[0]?.[0] || "N/A";

      const dias = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
      const semana = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split("T")[0];
        const monto = (pedidos || []).filter((p: any) =>
          p.created_at.startsWith(dStr) && p.estado !== "cancelado"
        ).reduce((a: number, p: any) => a + Number(p.total), 0);
        semana.push({ dia: dias[d.getDay()], monto });
      }

      setStat({
        total_ingresos: totalIngresos,
        total_pedidos: (pedidos || []).length,
        total_citas: (citas || []).length,
        pedidos_mes: pedidosMes,
        ingresos_mes: ingresosMes,
        categoria_top: topCat,
        productos_count: (productos as any)?.length || 0,
        tasa_entrega: (pedidos || []).length > 0 ? Math.round((entregados / (pedidos || []).length) * 100) : 0,
      });
      setPedidosPorEstado(estadosPed);
      setCitasPorEstado(estadosCita);
      setIngresosSemanales(semana);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const maxMonto = Math.max(...ingresosSemanales.map((d) => d.monto), 1);

  const cards = [
    { label: "Ingresos totales", value: stat ? `S/ ${stat.total_ingresos.toFixed(2)}` : "...", icon: DollarSign, color: "text-[#c9a84c]", bg: "bg-[rgba(201,168,76,0.1)]" },
    { label: "Total pedidos", value: stat?.total_pedidos ?? "...", icon: ShoppingBag, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Total citas", value: stat?.total_citas ?? "...", icon: Calendar, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Ingresos del mes", value: stat ? `S/ ${stat.ingresos_mes.toFixed(0)}` : "...", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Pedidos del mes", value: stat?.pedidos_mes ?? "...", icon: ShoppingBag, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Tasa de entrega", value: stat ? `${stat.tasa_entrega}%` : "...", icon: Package, color: "text-teal-400", bg: "bg-teal-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-cinzel text-xl font-bold text-[#f5f0e8]">Estadísticas</h2>
        <p className="text-sm text-[#f5f0e8]/40 font-inter mt-1">Resumen general del negocio</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
              <c.icon size={20} className={c.color}/>
            </div>
            <p className={`text-2xl font-bold font-cinzel ${c.color}`}>{loading ? "..." : c.value}</p>
            <p className="text-xs text-[#f5f0e8]/50 font-inter mt-1">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-cinzel text-base font-bold text-[#f5f0e8] mb-6">Ingresos últimos 7 días</h3>
          {loading ? (
            <div className="h-40 shimmer-line rounded-xl"/>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {ingresosSemanales.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-[#c9a84c] font-bold font-cinzel">
                    {d.monto > 0 ? `S/${d.monto.toFixed(0)}` : ""}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.monto / maxMonto) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="w-full rounded-t-lg min-h-[4px]"
                    style={{ background: d.monto > 0 ? "linear-gradient(180deg,#e8c96d,#c9a84c)" : "rgba(255,255,255,0.05)" }}
                  />
                  <span className="text-xs text-[#f5f0e8]/40 font-inter">{d.dia}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-rows-2 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8] mb-4">Pedidos por estado</h3>
            {loading ? <div className="h-16 shimmer-line rounded-xl"/> : (
              <div className="space-y-2">
                {Object.entries(pedidosPorEstado).map(([est, cnt]) => (
                  <div key={est} className="flex items-center gap-3">
                    <span className="text-xs text-[#f5f0e8]/60 font-inter w-20 capitalize">{est.replace("_"," ")}</span>
                    <div className="flex-1 bg-[rgba(255,255,255,0.05)] rounded-full h-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }}
                        animate={{ width: `${(cnt / (stat?.total_pedidos || 1)) * 100}%` }}
                        className="h-full bg-gold-gradient rounded-full"/>
                    </div>
                    <span className="text-xs text-[#c9a84c] font-bold w-5 text-right">{cnt}</span>
                  </div>
                ))}
                {Object.keys(pedidosPorEstado).length === 0 && (
                  <p className="text-xs text-[#f5f0e8]/30 font-inter">Sin datos</p>
                )}
              </div>
            )}
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8] mb-4">Citas por estado</h3>
            {loading ? <div className="h-16 shimmer-line rounded-xl"/> : (
              <div className="space-y-2">
                {Object.entries(citasPorEstado).map(([est, cnt]) => (
                  <div key={est} className="flex items-center gap-3">
                    <span className="text-xs text-[#f5f0e8]/60 font-inter w-20 capitalize">{est}</span>
                    <div className="flex-1 bg-[rgba(255,255,255,0.05)] rounded-full h-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }}
                        animate={{ width: `${(cnt / (stat?.total_citas || 1)) * 100}%` }}
                        className="h-full bg-blue-500 rounded-full"/>
                    </div>
                    <span className="text-xs text-blue-400 font-bold w-5 text-right">{cnt}</span>
                  </div>
                ))}
                {Object.keys(citasPorEstado).length === 0 && (
                  <p className="text-xs text-[#f5f0e8]/30 font-inter">Sin datos</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {stat && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8] mb-4">Resumen destacado</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-[rgba(201,168,76,0.05)] rounded-xl">
              <p className="text-2xl font-bold font-cinzel gold-text">{stat.categoria_top}</p>
              <p className="text-xs text-[#f5f0e8]/50 font-inter mt-1">Categoría más vendida</p>
            </div>
            <div className="p-4 bg-[rgba(201,168,76,0.05)] rounded-xl">
              <p className="text-2xl font-bold font-cinzel text-green-400">{stat.productos_count}</p>
              <p className="text-xs text-[#f5f0e8]/50 font-inter mt-1">Productos en catálogo</p>
            </div>
            <div className="p-4 bg-[rgba(201,168,76,0.05)] rounded-xl">
              <p className="text-2xl font-bold font-cinzel text-blue-400">S/5</p>
              <p className="text-xs text-[#f5f0e8]/50 font-inter mt-1">Tarifa de envío fija</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
