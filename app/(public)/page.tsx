"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import { MapPin, Truck, Award, Clock } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Calidad Premium",
    desc: "Prendas de primera calidad seleccionadas para cada ocasión especial.",
  },
  {
    icon: Truck,
    title: "Delivery S/5",
    desc: "Entrega en cualquier punto de Huancayo por solo S/5 soles.",
  },
  {
    icon: Clock,
    title: "Alquiler Flexible",
    desc: "Reserva con anticipación y elige la duración que necesites.",
  },
  {
    icon: MapPin,
    title: "Huancayo, Perú",
    desc: "Ubicados en el corazón de Huancayo, listos para atenderte.",
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.4em] text-[#c9a84c] uppercase font-cinzel mb-3">
            ¿Por qué elegirnos?
          </p>
          <h2 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#f5f0e8]">
            Nuestros <span className="gold-text">Beneficios</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="glass-card glass-card-hover rounded-2xl p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center mx-auto mb-4">
                <feat.icon size={24} className="text-[#c9a84c]" />
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#f5f0e8] mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-[#f5f0e8]/50 font-inter leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <p className="text-xs tracking-[0.4em] text-[#c9a84c] uppercase font-cinzel mb-3">
                  Encuéntranos
                </p>
                <h2 className="font-cinzel text-3xl font-bold text-[#f5f0e8] mb-4">
                  Visítanos en <span className="gold-text">Huancayo</span>
                </h2>
                <p className="text-[#f5f0e8]/50 font-inter leading-relaxed mb-6">
                  Estamos ubicados en el centro de Huancayo, Perú. Nuestro equipo
                  está listo para asesorarte y encontrar el terno perfecto para tu
                  evento.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                      <MapPin size={16} className="text-[#c9a84c]" />
                    </div>
                    <span className="text-sm text-[#f5f0e8]/70 font-inter">
                      Huancayo, Junín — Perú
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                      <Clock size={16} className="text-[#c9a84c]" />
                    </div>
                    <span className="text-sm text-[#f5f0e8]/70 font-inter">
                      Lun - Sáb: 9:00 AM - 7:00 PM
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                      <Truck size={16} className="text-[#c9a84c]" />
                    </div>
                    <span className="text-sm text-[#f5f0e8]/70 font-inter">
                      Delivery S/5 a toda Huancayo
                    </span>
                  </div>
                </div>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  href="http://google.com/maps/place/El+Paraiso+De+Los+Ternos/@-12.0622087,-75.2153297,19z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl btn-gold font-cinzel text-sm tracking-wider"
                >
                  <MapPin size={16} />
                  Ver en Google Maps
                </motion.a>
              </div>
              <div className="h-64 lg:h-auto bg-[rgba(201,168,76,0.05)] flex items-center justify-center overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d481.5!2d-75.2142025!3d-12.0620308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910e9647ea8209d7%3A0x4f066b33129e1ccd!2sEl%20Paraiso%20De%20Los%20Ternos!5e0!3m2!1ses!2spe!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "300px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale opacity-80"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
