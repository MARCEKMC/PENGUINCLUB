"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { CategoriaProducto } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, total } =
    useCartStore();

  const sub = subtotal();
  const tot = total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#110e0b] border-l border-[rgba(201,168,76,0.15)] z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[rgba(201,168,76,0.1)]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-[#c9a84c]" size={22} />
                <h2 className="font-cinzel text-lg font-semibold text-[#f5f0e8]">
                  Mi Carrito
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-[rgba(201,168,76,0.1)] transition-colors"
              >
                <X size={20} className="text-[#f5f0e8]/60" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 text-center"
                  >
                    <ShoppingBag size={48} className="text-[rgba(201,168,76,0.2)] mb-4" />
                    <p className="font-cinzel text-[#f5f0e8]/40">Tu carrito está vacío</p>
                    <p className="text-sm text-[#f5f0e8]/30 mt-1 font-inter">
                      Agrega productos para continuar
                    </p>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="glass-card rounded-xl p-4 flex gap-3"
                    >
                      <div className="w-14 h-14 rounded-lg bg-[rgba(201,168,76,0.1)] flex items-center justify-center shrink-0">
                        {item.imagen ? (
                          <Image
                            src={item.imagen}
                            alt={item.nombre}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-[#c9a84c] w-8 h-8">
                            <CategoryIcon cat={item.categoria as CategoriaProducto} size={32}/>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-cinzel text-sm text-[#f5f0e8] truncate">
                          {item.nombre}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-inter ${
                              item.tipo === "alquiler"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {item.tipo === "alquiler" ? "Alquiler" : "Compra"}
                          </span>
                          {item.color && (
                            <span className="text-xs text-[#f5f0e8]/40">{item.color}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[#c9a84c] font-bold text-sm">
                            S/ {(item.precio * item.cantidad).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                              className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(201,168,76,0.2)] flex items-center justify-center transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-6 text-center text-sm">{item.cantidad}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                              className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(201,168,76,0.2)] flex items-center justify-center transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-6 h-6 rounded-full hover:bg-red-500/20 flex items-center justify-center transition-colors ml-1"
                            >
                              <Trash2 size={10} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-[rgba(201,168,76,0.1)]">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-[#f5f0e8]/70 font-inter">
                    <span>Subtotal</span>
                    <span>S/ {sub.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#f5f0e8]/70 font-inter">
                    <span>Envío</span>
                    <span className="text-[#c9a84c]">S/ 5.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#f5f0e8] pt-2 border-t border-[rgba(201,168,76,0.1)]">
                    <span className="font-cinzel">Total</span>
                    <span className="text-[#c9a84c] text-lg">S/ {tot.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={closeCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-gold py-4 rounded-xl font-cinzel text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    Proceder al pago
                    <ArrowRight size={16} />
                  </motion.button>
                </Link>
                <Link href="/carrito" onClick={closeCart}>
                  <button className="w-full mt-3 py-3 rounded-xl btn-outline-gold font-cinzel text-xs tracking-widest uppercase">
                    Ver carrito completo
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
