"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Calendar, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Producto, CategoriaProducto, CATEGORIAS_INFO } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import CategoryIcon from "@/components/CategoryIcon";
import toast from "react-hot-toast";
import Image from "next/image";

const CATEGORY_BG: Record<CategoriaProducto, string> = {
  sombrero: "from-amber-900/30 to-amber-800/10",
  camisa: "from-sky-900/30 to-sky-800/10",
  corbata: "from-red-900/30 to-red-800/10",
  chaleco: "from-emerald-900/30 to-emerald-800/10",
  saco: "from-indigo-900/30 to-indigo-800/10",
  correa: "from-orange-900/30 to-orange-800/10",
  pantalon: "from-slate-800/40 to-slate-700/10",
  zapatos: "from-yellow-900/30 to-yellow-800/10",
};

export default function CategorySection() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoriaProducto | null>(null);
  const [products, setProducts] = useState<Producto[]>([]);
  const [filteredColor, setFilteredColor] = useState<string | null>(null);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<"venta" | "alquiler">("venta");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedTalla, setSelectedTalla] = useState<string>("");
  const supabase = createClient();
  const { addItem } = useCartStore();

  const categories = Object.entries(CATEGORIAS_INFO) as [CategoriaProducto, typeof CATEGORIAS_INFO[CategoriaProducto]][];

  const fetchProducts = async (cat: CategoriaProducto) => {
    setLoading(true);
    setFilteredColor(null);
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("categoria", cat)
      .order("destacado", { ascending: false });
    if (data) {
      setProducts(data as Producto[]);
      const colors = [...new Set((data as Producto[]).flatMap((p) => p.colores))];
      setAvailableColors(colors);
    }
    setLoading(false);
  };

  const handleCategoryClick = (cat: CategoriaProducto) => {
    setActiveCategory(cat);
    fetchProducts(cat);
  };

  const filteredProducts = filteredColor
    ? products.filter((p) => p.colores.includes(filteredColor))
    : products;

  const handleComprar = (product: Producto) => {
    addItem({
      producto_id: product.id,
      nombre: product.nombre,
      categoria: product.categoria,
      cantidad: 1,
      precio: product.precio_venta!,
      tipo: "venta",
      color: selectedColor || undefined,
      talla: selectedTalla || undefined,
      imagen: product.imagenes?.[0],
    });
    toast.success(`${product.nombre} agregado al carrito`);
    setSelectedProduct(null);
  };

  const handleAlquilar = (product: Producto) => {
    toast.success(`Agendar cita para: ${product.nombre}`);
    setSelectedProduct(null);
    router.push("/alquiler");
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <p className="text-xs tracking-[0.4em] text-[#c9a84c] uppercase font-cinzel mb-3">
          Nuestra Colección
        </p>
        <h2 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#f5f0e8]">
          Encuentra tu <span className="gold-text">Estilo</span>
        </h2>
        <p className="mt-4 text-[#f5f0e8]/50 font-inter max-w-lg mx-auto">
          Selecciona una categoría para explorar nuestros productos disponibles para compra o alquiler
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(([cat, info], index) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.6 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCategoryClick(cat)}
            className={`relative overflow-hidden rounded-2xl p-6 text-left cursor-pointer group transition-all duration-300 ${
              activeCategory === cat
                ? "ring-2 ring-[#c9a84c] shadow-gold"
                : "ring-1 ring-[rgba(201,168,76,0.15)]"
            } bg-gradient-to-br ${CATEGORY_BG[cat]}`}
            style={{ background: `linear-gradient(135deg, rgba(14,12,10,0.95), rgba(201,168,76,0.07))` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_BG[cat]} opacity-40 group-hover:opacity-70 transition-opacity`}/>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="text-[#c9a84c] mb-4 w-11 h-11"
              >
                <CategoryIcon cat={cat} size={44}/>
              </motion.div>
              <h3 className="font-cinzel text-lg font-bold text-[#f5f0e8]">{info.label}</h3>
              <p className="text-xs text-[#f5f0e8]/50 mt-1 font-inter">{info.descripcion}</p>
              <div className="mt-4 flex items-center gap-1 text-[#c9a84c] text-xs font-inter">
                <span>Ver productos</span>
                <motion.span className="group-hover:translate-x-1 transition-transform">→</motion.span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mt-8 overflow-hidden"
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-[#c9a84c] w-8 h-8">
                    <CategoryIcon cat={activeCategory} size={32}/>
                  </span>
                  <div>
                    <h3 className="font-cinzel text-xl font-bold text-[#f5f0e8]">
                      {CATEGORIAS_INFO[activeCategory].label}
                    </h3>
                    <p className="text-xs text-[#f5f0e8]/40 font-inter">
                      {filteredProducts.length} productos encontrados
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-[#c9a84c]"/>
                    <span className="text-xs text-[#f5f0e8]/60 font-cinzel tracking-wider">Color:</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setFilteredColor(null)}
                        className={`w-6 h-6 rounded-full border-2 text-xs flex items-center justify-center transition-all ${
                          !filteredColor ? "border-[#c9a84c] scale-110" : "border-[rgba(201,168,76,0.3)]"
                        }`}
                        title="Todos"
                      >
                        ✕
                      </button>
                      {availableColors.map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setFilteredColor(filteredColor === color ? null : color)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            filteredColor === color
                              ? "border-[#c9a84c] scale-110 shadow-gold"
                              : "border-transparent hover:border-[rgba(201,168,76,0.4)]"
                          }`}
                          style={{ backgroundColor: getColorValue(color) }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <X size={18} className="text-[#f5f0e8]/50"/>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl glass-card h-48 shimmer-line"/>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        className="glass-card glass-card-hover rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedColor(product.colores[0] || "");
                          setSelectedTalla(product.tallas[0] || "");
                          setSelectedTipo(product.disponible_venta ? "venta" : "alquiler");
                        }}
                      >
                        <div className="h-32 bg-gradient-to-br from-[rgba(201,168,76,0.08)] to-transparent flex items-center justify-center relative overflow-hidden">
                          {product.imagenes?.[0] ? (
                            <Image src={product.imagenes[0]} alt={product.nombre} fill className="object-cover"/>
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.15 }}
                              className="text-[#c9a84c] opacity-70 w-14 h-14"
                            >
                              <CategoryIcon cat={product.categoria} size={56}/>
                            </motion.div>
                          )}
                          {product.destacado && (
                            <span className="absolute top-2 right-2 text-xs bg-gold-gradient text-[#0e0c0a] px-2 py-0.5 rounded-full font-bold">
                              ★
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="font-cinzel text-xs font-bold text-[#f5f0e8] truncate">{product.nombre}</h4>
                          <div className="flex items-center gap-1 mt-2 flex-wrap">
                            {product.disponible_venta && product.precio_venta && (
                              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-inter">
                                S/{product.precio_venta}
                              </span>
                            )}
                            {product.disponible_alquiler && product.precio_alquiler && (
                              <span className="text-xs text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded font-inter">
                                Alq. S/{product.precio_alquiler}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 mt-2">
                            {product.colores.slice(0, 4).map((c) => (
                              <div
                                key={c}
                                className="w-3 h-3 rounded-full border border-[rgba(255,255,255,0.2)]"
                                style={{ backgroundColor: getColorValue(c) }}
                                title={c}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <div className="bg-[#110f0d] border border-[rgba(201,168,76,0.25)] rounded-2xl overflow-hidden shadow-gold-lg">
                <div className="h-52 bg-gradient-to-br from-[rgba(201,168,76,0.08)] to-transparent flex items-center justify-center relative">
                  {selectedProduct.imagenes?.[0] ? (
                    <Image src={selectedProduct.imagenes[0]} alt={selectedProduct.nombre} fill className="object-cover"/>
                  ) : (
                    <div className="text-[#c9a84c] opacity-60 w-28 h-28">
                      <CategoryIcon cat={selectedProduct.categoria} size={112}/>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/80 transition-colors"
                  >
                    <X size={16} className="text-[#f5f0e8]"/>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="font-cinzel text-xl font-bold text-[#f5f0e8]">{selectedProduct.nombre}</h3>
                  {selectedProduct.descripcion && (
                    <p className="text-sm text-[#f5f0e8]/50 mt-2 font-inter">{selectedProduct.descripcion}</p>
                  )}

                  <div className="mt-4 flex gap-2">
                    {selectedProduct.disponible_venta && (
                      <button
                        onClick={() => setSelectedTipo("venta")}
                        className={`flex-1 py-2 rounded-lg text-sm font-cinzel transition-all ${
                          selectedTipo === "venta" ? "btn-gold" : "btn-outline-gold"
                        }`}
                      >
                        Comprar · S/{selectedProduct.precio_venta}
                      </button>
                    )}
                    {selectedProduct.disponible_alquiler && (
                      <button
                        onClick={() => setSelectedTipo("alquiler")}
                        className={`flex-1 py-2 rounded-lg text-sm font-cinzel transition-all ${
                          selectedTipo === "alquiler"
                            ? "bg-sky-600 text-white border border-sky-500"
                            : "border border-sky-600/40 text-sky-400 hover:bg-sky-600/10"
                        }`}
                      >
                        Alquiler · S/{selectedProduct.precio_alquiler}
                      </button>
                    )}
                  </div>

                  {selectedProduct.colores.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider mb-2">COLOR</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProduct.colores.map((c) => (
                          <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-inter border transition-all ${
                              selectedColor === c
                                ? "border-[#c9a84c] bg-[rgba(201,168,76,0.1)] text-[#c9a84c]"
                                : "border-[rgba(255,255,255,0.1)] text-[#f5f0e8]/60"
                            }`}
                          >
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorValue(c) }}/>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.tallas.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider mb-2">TALLA</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedProduct.tallas.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSelectedTalla(t)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-inter border transition-all ${
                              selectedTalla === t
                                ? "border-[#c9a84c] bg-[rgba(201,168,76,0.1)] text-[#c9a84c]"
                                : "border-[rgba(255,255,255,0.1)] text-[#f5f0e8]/60"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    {selectedTipo === "venta" ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleComprar(selectedProduct)}
                        className="w-full py-3 rounded-xl btn-gold font-cinzel text-sm tracking-wider flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16}/>
                        Agregar al Carrito
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAlquilar(selectedProduct)}
                        className="w-full py-3 rounded-xl font-cinzel text-sm tracking-wider flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white transition-colors"
                      >
                        <Calendar size={16}/>
                        Agendar Cita de Alquiler
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function getColorValue(color: string): string {
  const colorMap: Record<string, string> = {
    negro: "#1a1a1a",
    "negro carbón": "#2a2a2a",
    "negro azulado": "#1a1a2e",
    blanco: "#f5f5f5",
    crema: "#f5f0e8",
    "azul marino": "#1a2a6c",
    "azul oscuro": "#0a1450",
    "azul profundo": "#0d1b4a",
    "azul claro": "#4a90d9",
    gris: "#808080",
    "gris oscuro": "#3d3d3d",
    marrón: "#6b4226",
    cognac: "#9b5c2a",
    camel: "#c19a6b",
    beige: "#c9b08a",
    borgoña: "#722f37",
    burdeos: "#800020",
    vino: "#5c0020",
    "verde esmeralda": "#1b5e20",
    dorado: "#c9a84c",
    plateado: "#9e9e9e",
    rojo: "#c0392b",
    azul: "#1565c0",
    naranja: "#e65100",
    morado: "#6a1b9a",
  };
  return colorMap[color.toLowerCase()] || "#888888";
}
