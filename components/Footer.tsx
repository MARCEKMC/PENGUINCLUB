"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import PenguinLogo from "./PenguinLogo";

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(201,168,76,0.15)] bg-[#0a0806]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <PenguinLogo size={52} />
              <div>
                <h3 className="font-cinzel font-bold text-xl gold-text">El Paraíso de los Ternos</h3>
                <p className="text-xs tracking-[0.3em] text-[rgba(201,168,76,0.6)] uppercase mt-0.5">
                  Elegancia para cada ocasión
                </p>
              </div>
            </div>
            <p className="text-[#f5f0e8]/50 text-sm leading-relaxed max-w-sm font-inter">
              La tienda más elegante de Huancayo. Alquiler y venta de ternos completos
              para que luzcas impecable en cada momento especial de tu vida.
            </p>
            <div className="flex gap-3 mt-6">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-card glass-card-hover"
              >
                <Instagram size={18} className="text-[#c9a84c]" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-card glass-card-hover"
              >
                <Facebook size={18} className="text-[#c9a84c]" />
              </motion.a>
            </div>
          </div>

          <div>
            <h4 className="font-cinzel text-sm tracking-widest uppercase text-[#c9a84c] mb-5">
              Navegación
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "/productos", label: "Productos" },
                { href: "/alquiler", label: "Alquilar" },
                { href: "/carrito", label: "Carrito" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#f5f0e8]/50 text-sm hover:text-[#c9a84c] transition-colors font-inter flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-[rgba(201,168,76,0.3)] group-hover:w-6 group-hover:bg-[#c9a84c] transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-cinzel text-sm tracking-widest uppercase text-[#c9a84c] mb-5">
              Contacto
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#c9a84c] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#f5f0e8]/70 text-sm font-inter">Huancayo, Perú</p>
                  <a
                    href="http://google.com/maps/place/El+Paraiso+De+Los+Ternos/@-12.0622087,-75.2153297,19z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors mt-0.5 block"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#c9a84c] shrink-0" />
                <span className="text-[#f5f0e8]/70 text-sm font-inter">
                  Consultar por WhatsApp
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#c9a84c] shrink-0" />
                <span className="text-[#f5f0e8]/70 text-sm font-inter">
                  Envío a toda Huancayo
                </span>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl glass-card">
              <p className="text-xs text-[#c9a84c] font-cinzel">Delivery</p>
              <p className="text-sm text-[#f5f0e8]/80 font-inter mt-1">
                Solo <span className="text-[#c9a84c] font-bold">S/ 5.00</span> a cualquier punto de Huancayo
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(201,168,76,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#f5f0e8]/30 text-xs font-inter text-center sm:text-left">
            © {new Date().getFullYear()} El Paraíso de los Ternos. Todos los derechos reservados.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-[#f5f0e8]/30 text-xs font-inter">Desarrollado por</span>
            <span className="font-cinzel text-sm font-bold gold-text tracking-wider">
              ELAINE corp
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
