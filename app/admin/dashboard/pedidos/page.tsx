"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Pedido, EstadoPedido } from "@/lib/types";
import toast from "react-hot-toast";

const estados: EstadoPedido[] = ["pendiente", "confirmado", "en_camino", "entregado", "cancelado"];
const estadoColor: Record<EstadoPedido, string> = {
  pendiente: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  confirmado: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  en_camino: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  entregado: "text-green-400 bg-green-500/10 border-green-500/30",
  cancelado: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EstadoPedido | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
      if (data) setPedidos(data as Pedido[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const updateEstado = async (id: string, estado: EstadoPedido) => {
    const { error } = await supabase.from("pedidos").update({ estado, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error("Error al actualizar"); return; }
    setPedidos((p) => p.map((o) => o.id === id ? { ...o, estado } : o));
    toast.success("Estado actualizado");
  };

  const filtered = filter === "all" ? pedidos : pedidos.filter((p) => p.estado === filter);
  const totalIngresos = pedidos.filter((p) => p.estado !== "cancelado").reduce((a, p) => a + Number(p.total), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-[#f5f0e8]">Pedidos</h2>
          <p className="text-sm text-[#f5f0e8]/40 font-inter">
            {pedidos.length} total · S/ {totalIngresos.toFixed(2)} en ingresos
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...estados] as const).map((e) => (
            <button key={e} onClick={() => setFilter(e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider transition-all ${filter === e ? "btn-gold" : "btn-outline-gold"}`}>
              {e === "all" ? "Todos" : e.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 glass-card rounded-xl shimmer-line"/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <ShoppingBag size={48} className="mx-auto text-[rgba(201,168,76,0.2)] mb-4"/>
          <p className="font-cinzel text-[#f5f0e8]/30">No hay pedidos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pedido) => (
            <motion.div key={pedido.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card rounded-2xl overflow-hidden">
              <div
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === pedido.id ? null : pedido.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8]">{pedido.nombre_cliente}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-inter ${estadoColor[pedido.estado]}`}>
                      {pedido.estado.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#f5f0e8]/50 font-inter flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={11}/>{pedido.ciudad}</span>
                    <span>{new Date(pedido.created_at).toLocaleDateString("es-PE")}</span>
                    <span>{(pedido.items as any[])?.length || 0} ítem(s)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#c9a84c] font-bold font-cinzel">S/ {Number(pedido.total).toFixed(2)}</span>
                  <select
                    value={pedido.estado}
                    onChange={(e) => { e.stopPropagation(); updateEstado(pedido.id, e.target.value as EstadoPedido); }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-lg px-3 py-1.5 text-xs text-[#f5f0e8] focus:outline-none font-inter"
                  >
                    {estados.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
                  </select>
                  <ChevronDown size={16} className={`text-[#f5f0e8]/40 transition-transform ${expanded === pedido.id ? "rotate-180" : ""}`}/>
                </div>
              </div>

              {expanded === pedido.id && (
                <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="pt-4 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#c9a84c] font-cinzel tracking-wider mb-2">ENTREGA</p>
                        <p className="text-xs text-[#f5f0e8]/70 font-inter">{pedido.direccion_entrega}</p>
                        {pedido.referencia && <p className="text-xs text-[#f5f0e8]/40 font-inter mt-1">{pedido.referencia}</p>}
                        {pedido.telefono && <p className="text-xs text-[#f5f0e8]/60 font-inter mt-1">Tel: {pedido.telefono}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-[#c9a84c] font-cinzel tracking-wider mb-2">RESUMEN</p>
                        <div className="space-y-1 text-xs font-inter text-[#f5f0e8]/60">
                          <div className="flex justify-between"><span>Subtotal</span><span>S/{Number(pedido.subtotal).toFixed(2)}</span></div>
                          <div className="flex justify-between"><span>Envío</span><span>S/{Number(pedido.costo_envio).toFixed(2)}</span></div>
                          <div className="flex justify-between font-bold text-[#c9a84c]"><span>Total</span><span>S/{Number(pedido.total).toFixed(2)}</span></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#c9a84c] font-cinzel tracking-wider">PRODUCTOS</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {(pedido.items as any[])?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] rounded-lg p-2.5">
                          <div>
                            <p className="text-xs font-inter text-[#f5f0e8]/80">{item.nombre} x{item.cantidad}</p>
                            <div className="flex gap-1 text-xs text-[#f5f0e8]/40 font-inter">
                              <span className={item.tipo === "alquiler" ? "text-blue-400" : "text-green-400"}>{item.tipo}</span>
                              {item.color && <span>· {item.color}</span>}
                              {item.talla && <span>· {item.talla}</span>}
                            </div>
                          </div>
                          <p className="text-xs text-[#c9a84c] font-bold">S/{(item.precio * item.cantidad).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
