"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Edit2, X, Save, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Producto, CategoriaProducto, CATEGORIAS_INFO } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import toast from "react-hot-toast";

interface EditForm {
  nombre: string;
  descripcion: string;
  precio_venta: string;
  precio_alquiler: string;
  stock: string;
  stock_alquiler: string;
  colores: string;
  tallas: string;
  disponible_venta: boolean;
  disponible_alquiler: boolean;
  destacado: boolean;
}

export default function InventarioPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [filterCat, setFilterCat] = useState<CategoriaProducto | "all">("all");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("productos").select("*").order("categoria").order("nombre");
      if (data) setProducts(data as Producto[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const startEdit = (p: Producto) => {
    setEditId(p.id);
    setEditForm({
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      precio_venta: p.precio_venta?.toString() || "",
      precio_alquiler: p.precio_alquiler?.toString() || "",
      stock: p.stock.toString(),
      stock_alquiler: p.stock_alquiler.toString(),
      colores: p.colores.join(", "),
      tallas: p.tallas.join(", "),
      disponible_venta: p.disponible_venta,
      disponible_alquiler: p.disponible_alquiler,
      destacado: p.destacado,
    });
  };

  const cancelEdit = () => { setEditId(null); setEditForm(null); };

  const saveEdit = async (id: string) => {
    if (!editForm) return;
    setSaving(true);
    const { error } = await supabase.from("productos").update({
      nombre: editForm.nombre,
      descripcion: editForm.descripcion,
      precio_venta: editForm.precio_venta ? parseFloat(editForm.precio_venta) : null,
      precio_alquiler: editForm.precio_alquiler ? parseFloat(editForm.precio_alquiler) : null,
      stock: parseInt(editForm.stock),
      stock_alquiler: parseInt(editForm.stock_alquiler),
      colores: editForm.colores.split(",").map((c) => c.trim()).filter(Boolean),
      tallas: editForm.tallas.split(",").map((t) => t.trim()).filter(Boolean),
      disponible_venta: editForm.disponible_venta,
      disponible_alquiler: editForm.disponible_alquiler,
      destacado: editForm.destacado,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast.error("Error al guardar"); } else {
      const { data } = await supabase.from("productos").select("*").order("categoria").order("nombre");
      if (data) setProducts(data as Producto[]);
      toast.success("Producto actualizado");
      cancelEdit();
    }
    setSaving(false);
  };

  const filtered = filterCat === "all" ? products : products.filter((p) => p.categoria === filterCat);
  const lowStock = products.filter((p) => p.stock < 5 || p.stock_alquiler < 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-[#f5f0e8]">Inventario</h2>
          <p className="text-sm text-[#f5f0e8]/40 font-inter">{products.length} productos en total</p>
        </div>
        {lowStock.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <AlertTriangle size={14} className="text-orange-400"/>
            <p className="text-xs text-orange-400 font-inter">{lowStock.length} producto(s) con stock bajo</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", ...(Object.keys(CATEGORIAS_INFO) as CategoriaProducto[])] as const).map((c) => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-cinzel tracking-wider transition-all flex items-center gap-1 ${filterCat === c ? "btn-gold" : "btn-outline-gold"}`}>
            {c !== "all" && <span className="w-4 h-4 shrink-0"><CategoryIcon cat={c} size={16}/></span>}{c === "all" ? "Todos" : CATEGORIAS_INFO[c].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 glass-card rounded-xl shimmer-line"/>)}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`glass-card rounded-2xl overflow-hidden ${p.stock < 5 ? "border border-orange-500/25" : ""}`}>
              {editId === p.id && editForm ? (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel text-sm font-bold text-[#c9a84c]">Editando: {p.nombre}</h3>
                    <button onClick={cancelEdit}><X size={16} className="text-[#f5f0e8]/40"/></button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-1">NOMBRE</label>
                      <input value={editForm.nombre} onChange={(e) => setEditForm((f) => f && ({ ...f, nombre: e.target.value }))}
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-lg py-2 px-3 text-sm text-[#f5f0e8] focus:outline-none font-inter"/>
                    </div>
                    {[
                      { k:"precio_venta",l:"PRECIO VENTA (S/)" },
                      { k:"precio_alquiler",l:"PRECIO ALQUILER (S/)" },
                      { k:"stock",l:"STOCK VENTA" },
                      { k:"stock_alquiler",l:"STOCK ALQUILER" },
                    ].map((f) => (
                      <div key={f.k}>
                        <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-1">{f.l}</label>
                        <input type="number" value={(editForm as any)[f.k]}
                          onChange={(e) => setEditForm((fm) => fm && ({ ...fm, [f.k]: e.target.value }))}
                          className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-lg py-2 px-3 text-sm text-[#f5f0e8] focus:outline-none font-inter"/>
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-1">COLORES (separados por coma)</label>
                      <input value={editForm.colores}
                        onChange={(e) => setEditForm((f) => f && ({ ...f, colores: e.target.value }))}
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-lg py-2 px-3 text-sm text-[#f5f0e8] focus:outline-none font-inter"/>
                    </div>
                    <div>
                      <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-1">TALLAS (separadas por coma)</label>
                      <input value={editForm.tallas}
                        onChange={(e) => setEditForm((f) => f && ({ ...f, tallas: e.target.value }))}
                        className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-lg py-2 px-3 text-sm text-[#f5f0e8] focus:outline-none font-inter"/>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { k:"disponible_venta", l:"Disponible para venta" },
                      { k:"disponible_alquiler", l:"Disponible para alquiler" },
                      { k:"destacado", l:"Producto destacado" },
                    ].map((f) => (
                      <label key={f.k} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={(editForm as any)[f.k]}
                          onChange={(e) => setEditForm((fm) => fm && ({ ...fm, [f.k]: e.target.checked }))}
                          className="w-4 h-4 accent-[#c9a84c]"/>
                        <span className="text-xs text-[#f5f0e8]/60 font-inter">{f.l}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => saveEdit(p.id)} disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 btn-gold rounded-xl font-cinzel text-xs tracking-wider disabled:opacity-50">
                      <Save size={14}/>{saving ? "Guardando..." : "Guardar"}
                    </motion.button>
                    <button onClick={cancelEdit} className="px-4 py-2 btn-outline-gold rounded-xl font-cinzel text-xs">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex items-center gap-4">
                  <span className="text-[#c9a84c] w-10 h-10 shrink-0 flex items-center justify-center"><CategoryIcon cat={p.categoria} size={36}/></span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-cinzel text-sm font-bold text-[#f5f0e8]">{p.nombre}</p>
                      {p.destacado && <span className="text-xs text-[#c9a84c] bg-[rgba(201,168,76,0.1)] px-1.5 py-0.5 rounded-full">★</span>}
                      {p.stock < 5 && <span className="text-xs text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={9}/>Stock bajo</span>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs font-inter text-[#f5f0e8]/50 flex-wrap">
                      {p.disponible_venta && p.precio_venta && <span className="text-green-400">Venta: S/{p.precio_venta} ({p.stock}u)</span>}
                      {p.disponible_alquiler && p.precio_alquiler && <span className="text-blue-400">Alquiler: S/{p.precio_alquiler} ({p.stock_alquiler}u)</span>}
                      <span>{p.colores.length} colores · {p.tallas.length} tallas</span>
                    </div>
                  </div>
                  <button onClick={() => startEdit(p)}
                    className="p-2 rounded-xl hover:bg-[rgba(201,168,76,0.1)] transition-colors shrink-0">
                    <Edit2 size={16} className="text-[#c9a84c]"/>
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
