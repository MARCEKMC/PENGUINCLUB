"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px rounded-full bg-[#c9a84c]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[rgba(201,168,76,0.04)] blur-[100px]" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[rgba(201,168,76,0.06)] blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-[#c9a84c] fill-[#c9a84c]" />
                ))}
              </div>
              <span className="text-sm text-[#f5f0e8]/60 font-inter tracking-wider">
                La mejor ternería de Huancayo
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-cinzel text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-[#f5f0e8]">Viste con</span>
              <br />
              <span className="gold-text">Elegancia</span>
              <br />
              <span className="text-[#f5f0e8]">Total</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 text-[#f5f0e8]/60 text-lg font-inter leading-relaxed max-w-md"
            >
              Alquiler y venta de ternos completos en Huancayo. Sombreros, camisas,
              corbatas, chalecos, sacos y más. Delivery a S/5 en toda la ciudad.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <Link href="/productos">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl btn-gold font-cinzel text-base tracking-widest uppercase flex items-center gap-3"
                >
                  Ver Colección
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/alquiler">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl btn-outline-gold font-cinzel text-base tracking-widest uppercase"
                >
                  Hacer una Cita
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center gap-8 mt-12"
            >
              {[
                { value: "500+", label: "Clientes" },
                { value: "8", label: "Categorías" },
                { value: "S/5", label: "Delivery" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-cinzel text-2xl font-bold gold-text">{stat.value}</p>
                  <p className="text-xs text-[#f5f0e8]/40 font-inter mt-1 tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gold-gradient opacity-10 blur-3xl scale-110" />
              <div className="relative glass-card rounded-3xl p-10 text-center">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-[#c9a84c] w-40 h-40 mx-auto"
                >
                  <CategoryIcon cat="sombrero" size={160}/>
                </motion.div>
                <p className="font-cinzel text-xl gold-text mt-4">Terno Completo</p>
                <p className="text-[#f5f0e8]/50 text-sm mt-2 font-inter">
                  8 piezas • Alquiler desde S/150
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  {["negro", "azul marino", "gris", "beige"].map((color) => (
                    <div
                      key={color}
                      className="w-6 h-6 rounded-full border border-[rgba(201,168,76,0.3)]"
                      style={{
                        backgroundColor:
                          color === "negro"
                            ? "#1a1a1a"
                            : color === "azul marino"
                              ? "#1a2a6c"
                              : color === "gris"
                                ? "#808080"
                                : "#c9b08a",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[#f5f0e8]/30 font-inter tracking-widest uppercase">
          Explorar
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[rgba(201,168,76,0.6)] to-transparent" />
      </motion.div>
    </section>
  );
}
