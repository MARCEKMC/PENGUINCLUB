"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Phone, Clock, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Cita, EstadoCita } from "@/lib/types";
import toast from "react-hot-toast";

const estados: EstadoCita[] = ["pendiente", "confirmada", "completada", "cancelada"];
const estadoColor: Record<EstadoCita, string> = {
  pendiente: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  confirmada: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  completada: "text-green-400 bg-green-500/10 border-green-500/30",
  cancelada: "text-red-400 bg-red-500/10 border-red-500/30",
};

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EstadoCita | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const supabase = createClient();

  const fetch = async () => {
    const q = supabase.from("citas").select("*").order("created_at", { ascending: false });
    const { data } = await q;
    if (data) setCitas(data as Cita[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const updateEstado = async (id: string, estado: EstadoCita) => {
    const { error } = await supabase.from("citas").update({ estado, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error("Error al actualizar"); return; }
    setCitas((p) => p.map((c) => c.id === id ? { ...c, estado } : c));
    toast.success("Estado actualizado");
  };

  const filtered = filter === "all" ? citas : citas.filter((c) => c.estado === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-[#f5f0e8]">Citas de Alquiler</h2>
          <p className="text-sm text-[#f5f0e8]/40 font-inter">{citas.length} total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", ...estados] as const).map((e) => (
            <button key={e} onClick={() => setFilter(e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider transition-all ${filter === e ? "btn-gold" : "btn-outline-gold"}`}>
              {e === "all" ? "Todas" : e}
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
          <Calendar size={48} className="mx-auto text-[rgba(201,168,76,0.2)] mb-4"/>
          <p className="font-cinzel text-[#f5f0e8]/30">No hay citas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cita) => (
            <motion.div key={cita.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card rounded-2xl overflow-hidden">
              <div
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === cita.id ? null : cita.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8]">{cita.nombre_cliente}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-inter ${estadoColor[cita.estado]}`}>
                      {cita.estado}
                    </span>
                    {cita.tipo_evento && (
                      <span className="text-xs text-[#f5f0e8]/40 font-inter">· {cita.tipo_evento}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#f5f0e8]/50 font-inter flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={11}/>{cita.fecha}</span>
                    <span className="flex items-center gap-1"><Clock size={11}/>{cita.hora?.slice(0,5)}</span>
                    <span className="flex items-center gap-1"><Phone size={11}/>{cita.telefono}</span>
                    <span>{cita.duracion_dias} día(s)</span>
                    <span>{(cita.items as any[])?.length || 0} prendas</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={cita.estado}
                    onChange={(e) => { e.stopPropagation(); updateEstado(cita.id, e.target.value as EstadoCita); }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-lg px-3 py-1.5 text-xs text-[#f5f0e8] focus:outline-none font-inter"
                  >
                    {estados.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={16} className={`text-[#f5f0e8]/40 transition-transform ${expanded === cita.id ? "rotate-180" : ""}`}/>
                </div>
              </div>

              {expanded === cita.id && (
                <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="pt-4 space-y-3">
                    <p className="text-xs text-[#c9a84c] font-cinzel tracking-wider">PRENDAS SELECCIONADAS</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {(cita.items as any[])?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] rounded-lg p-2.5">
                          <div>
                            <p className="text-xs font-inter text-[#f5f0e8]/80">{item.nombre}</p>
                            <p className="text-xs text-[#f5f0e8]/40 font-inter">{item.color} · Talla {item.talla}</p>
                          </div>
                          <p className="text-xs text-[#c9a84c] font-bold">S/{item.precio}</p>
                        </div>
                      ))}
                    </div>
                    {cita.notas && (
                      <p className="text-xs text-[#f5f0e8]/50 font-inter italic">"{cita.notas}"</p>
                    )}
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
