"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Producto,
  CategoriaProducto,
  CATEGORIAS_INFO,
} from "@/lib/types";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";
import Image from "next/image";
import CategoryIcon from "@/components/CategoryIcon";

function getColorValue(color: string): string {
  const m: Record<string, string> = {
    negro: "#1a1a1a","negro carbón": "#2a2a2a","negro azulado": "#110e0b",
    blanco: "#f5f5f5",crema: "#f5f0e8","azul marino": "#1a2a6c",
    "azul oscuro": "#0a1450","azul profundo": "#0d1b4a","azul claro": "#4a90d9",
    gris: "#808080","gris oscuro": "#3d3d3d",marrón: "#6b4226",cognac: "#9b5c2a",
    camel: "#c19a6b",beige: "#c9b08a",borgoña: "#722f37",burdeos: "#800020",
    vino: "#5c0020","verde esmeralda": "#1b5e20",dorado: "#c9a84c",plateado: "#9e9e9e",
  };
  return m[color.toLowerCase()] || "#888888";
}


export default function ProductosPage() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<CategoriaProducto | "all">("all");
  const [selectedColor, setSelectedColorFilter] = useState<string | null>(null);
  const [allColors, setAllColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [pickColor, setPickColor] = useState("");
  const [pickTalla, setPickTalla] = useState("");
  const [pickTipo, setPickTipo] = useState<"venta" | "alquiler">("venta");
  const supabase = createClient();
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("productos")
        .select("*")
        .eq("disponible_venta", true)
        .order("destacado", { ascending: false });
      if (data) {
        setProducts(data as Producto[]);
        setFiltered(data as Producto[]);
        setAllColors([...new Set((data as Producto[]).flatMap((p) => p.colores))]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...products];
    if (selectedCat !== "all") result = result.filter((p) => p.categoria === selectedCat);
    if (selectedColor) result = result.filter((p) => p.colores.includes(selectedColor));
    if (search) result = result.filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [products, selectedCat, selectedColor, search]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  const addToCart = (p: Producto) => {
    const precio = pickTipo === "alquiler" ? p.precio_alquiler! : p.precio_venta!;
    addItem({ producto_id: p.id, nombre: p.nombre, categoria: p.categoria, cantidad: 1,
      precio, tipo: pickTipo, color: pickColor || undefined, talla: pickTalla || undefined,
      imagen: p.imagenes?.[0] });
    toast.success("Agregado al carrito");
    setSelectedProduct(null);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] text-[#c9a84c] uppercase font-cinzel mb-2">Catálogo</p>
          <h1 className="font-cinzel text-4xl font-bold text-[#f5f0e8]">
            Todos los <span className="gold-text">Productos</span>
          </h1>
          <p className="mt-3 text-[#f5f0e8]/50 font-inter">
            Piezas disponibles para compra — delivery S/5 en Huancayo
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 pl-9 pr-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter"/>
              </div>

              <div className="glass-card rounded-xl p-4">
                <h3 className="font-cinzel text-xs tracking-widest uppercase text-[#c9a84c] mb-3">Categoría</h3>
                <div className="space-y-1">
                  <button onClick={() => setSelectedCat("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-inter transition-colors ${selectedCat === "all" ? "bg-[rgba(201,168,76,0.1)] text-[#c9a84c]" : "text-[#f5f0e8]/60 hover:text-[#f5f0e8]"}`}>
                    Todos
                  </button>
                  {(Object.entries(CATEGORIAS_INFO) as [CategoriaProducto, any][]).map(([k, v]) => (
                    <button key={k} onClick={() => setSelectedCat(k)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-inter transition-colors flex items-center gap-2 ${selectedCat === k ? "bg-[rgba(201,168,76,0.1)] text-[#c9a84c]" : "text-[#f5f0e8]/60 hover:text-[#f5f0e8]"}`}>
                      <span className="w-4 h-4 shrink-0"><CategoryIcon cat={k} size={16}/></span>{v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <h3 className="font-cinzel text-xs tracking-widest uppercase text-[#c9a84c] mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedColorFilter(null)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs transition-all ${!selectedColor ? "border-[#c9a84c] scale-110" : "border-[rgba(255,255,255,0.1)]"}`}>
                    ✕
                  </button>
                  {allColors.map((c) => (
                    <motion.button key={c} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColorFilter(selectedColor === c ? null : c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === c ? "border-[#c9a84c] scale-110 shadow-gold" : "border-transparent"}`}
                      style={{ backgroundColor: getColorValue(c) }} title={c}/>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#f5f0e8]/50 font-inter">
                {filtered.length} productos
              </p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl glass-card h-64 shimmer-line"/>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filtered.map((p, i) => (
                    <motion.div key={p.id} layout
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -6 }}
                      onClick={() => { setSelectedProduct(p); setPickColor(p.colores[0]||""); setPickTalla(p.tallas[0]||""); setPickTipo(p.disponible_venta?"venta":"alquiler"); }}
                      className="glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer group">
                      <div className="h-44 bg-gradient-to-br from-[rgba(201,168,76,0.08)] to-transparent flex items-center justify-center relative overflow-hidden">
                        {p.imagenes?.[0] ? (
                          <Image src={p.imagenes[0]} alt={p.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                        ) : (
                          <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-[#c9a84c] w-16 h-16"><CategoryIcon cat={p.categoria} size={64}/></motion.div>
                        )}
                        {p.destacado && (
                          <span className="absolute top-3 left-3 text-xs bg-gold-gradient text-[#0e0c0a] px-2 py-1 rounded-full font-bold">Destacado</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-cinzel text-sm font-bold text-[#f5f0e8] truncate">{p.nombre}</h3>
                        <p className="text-xs text-[#f5f0e8]/40 font-inter mt-1 capitalize">{p.categoria}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[#c9a84c] font-bold">S/ {p.precio_venta?.toFixed(2)}</p>
                          <div className="flex gap-1">
                            {p.colores.slice(0,4).map((c) => (
                              <div key={c} className="w-3.5 h-3.5 rounded-full border border-[rgba(255,255,255,0.15)]"
                                style={{ backgroundColor: getColorValue(c) }} title={c}/>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-20 text-[#f5f0e8]/30">
                    <p className="font-cinzel text-xl">No se encontraron productos</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"/>
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4">
              <div className="bg-[#110e0b] border border-[rgba(201,168,76,0.2)] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="h-52 bg-gradient-to-br from-[rgba(201,168,76,0.1)] to-transparent flex items-center justify-center relative">
                  {selectedProduct.imagenes?.[0] ? (
                    <Image src={selectedProduct.imagenes[0]} alt={selectedProduct.nombre} fill className="object-cover"/>
                  ) : (
                    <div className="text-[#c9a84c] w-24 h-24"><CategoryIcon cat={selectedProduct.categoria} size={96}/></div>
                  )}
                  <button onClick={() => setSelectedProduct(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 transition-colors">
                    <X size={16}/>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-[#f5f0e8]">{selectedProduct.nombre}</h3>
                    {selectedProduct.descripcion && (
                      <p className="text-sm text-[#f5f0e8]/50 mt-2 font-inter">{selectedProduct.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedProduct.disponible_venta && (
                      <button onClick={() => setPickTipo("venta")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-cinzel transition-all ${pickTipo === "venta" ? "btn-gold" : "btn-outline-gold"}`}>
                        Comprar S/{selectedProduct.precio_venta}
                      </button>
                    )}
                    {selectedProduct.disponible_alquiler && (
                      <button onClick={() => setPickTipo("alquiler")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-cinzel transition-all ${pickTipo === "alquiler" ? "bg-blue-600 text-white" : "border border-blue-600/40 text-blue-400 hover:bg-blue-600/10"}`}>
                        Alquiler S/{selectedProduct.precio_alquiler}
                      </button>
                    )}
                  </div>
                  {selectedProduct.colores.length > 0 && (
                    <div>
                      <p className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider mb-2">COLOR</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.colores.map((c) => (
                          <button key={c} onClick={() => setPickColor(c)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-inter border transition-all ${pickColor === c ? "border-[#c9a84c] bg-[rgba(201,168,76,0.1)] text-[#c9a84c]" : "border-[rgba(255,255,255,0.1)] text-[#f5f0e8]/60"}`}>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorValue(c) }}/>{c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProduct.tallas.length > 0 && (
                    <div>
                      <p className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider mb-2">TALLA</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tallas.map((t) => (
                          <button key={t} onClick={() => setPickTalla(t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-inter border transition-all ${pickTalla === t ? "border-[#c9a84c] bg-[rgba(201,168,76,0.1)] text-[#c9a84c]" : "border-[rgba(255,255,255,0.1)] text-[#f5f0e8]/60"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(selectedProduct)}
                    className="w-full py-3.5 rounded-xl btn-gold font-cinzel text-sm tracking-wider">
                    Agregar al Carrito
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
