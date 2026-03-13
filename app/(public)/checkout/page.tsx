"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, Lock, CheckCircle, ChevronDown, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DISTRICTS_HUANCAYO = [
  "El Tambo","Huancayo","Chilca","Pilcomayo","Huancán","Sapallanga",
  "Viques","Chupuro","Chongos Bajo","Chambará","Colca","Cullhuas",
  "El Agustino","Huasicancha","Ingenio","Pariahuanca","Quichuay","Quilcas","San Agustín",
  "San Jerónimo de Tunán","Saño","Santo Domingo de Acobamba","Sicaya","Orcotuna",
  "Pucará","Pangoa","Santa Rosa de Ocopa",
];

interface CheckoutForm {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  referencia: string;
  distrito: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { items, subtotal, total, clearCart } = useCartStore();
  const router = useRouter();
  const supabase = createClient();
  const sub = subtotal();
  const tot = total();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState<CheckoutForm>({
    nombre: "", telefono: "", email: "", direccion: "",
    referencia: "", distrito: "Huancayo",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
  });

  const update = (k: keyof CheckoutForm, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");

  const handleOrder = async () => {
    if (!form.nombre || !form.direccion || !form.telefono) {
      toast.error("Completa los datos de envío");
      return;
    }
    if (!form.cardNumber || !form.cardName || !form.expiry || !form.cvv) {
      toast.error("Completa los datos de pago");
      return;
    }
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("pedidos").insert({
      usuario_id: user?.id || null,
      nombre_cliente: form.nombre,
      email_cliente: form.email,
      telefono: form.telefono,
      direccion_entrega: form.direccion,
      ciudad: `${form.distrito}, Huancayo`,
      referencia: form.referencia,
      items: items.map((i) => ({
        producto_id: i.producto_id, nombre: i.nombre, categoria: i.categoria,
        cantidad: i.cantidad, precio: i.precio, tipo: i.tipo,
        color: i.color, talla: i.talla,
      })),
      subtotal: sub,
      costo_envio: 5,
      total: tot,
      estado: "pendiente",
      metodo_pago: "tarjeta",
    }).select("id").single();
    if (error) {
      toast.error("Error al procesar el pedido");
      setSubmitting(false);
      return;
    }
    setOrderId(data.id);
    clearCart();
    setStep(3);
    setSubmitting(false);
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-xl text-[#f5f0e8]/50 mb-4">No hay productos en el carrito</p>
          <Link href="/productos">
            <button className="btn-gold px-6 py-3 rounded-xl font-cinzel text-sm">Ver productos</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs tracking-[0.4em] text-[#c9a84c] uppercase font-cinzel mb-2">Finalizar</p>
          <h1 className="font-cinzel text-4xl font-bold text-[#f5f0e8]">
            Procesar <span className="gold-text">Pago</span>
          </h1>
        </motion.div>

        {step !== 3 && (
          <div className="flex items-center gap-3 mb-8">
            {[1,2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <button onClick={() => s < step && setStep(s as 1|2)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-cinzel transition-all ${s <= step ? "bg-gold-gradient text-[#0e0c0a]" : "bg-[rgba(255,255,255,0.05)] text-[#f5f0e8]/30"}`}>
                  {s}
                </button>
                <span className={`text-sm font-cinzel tracking-wider ${s === step ? "text-[#c9a84c]" : "text-[#f5f0e8]/30"}`}>
                  {s === 1 ? "Envío" : "Pago"}
                </span>
                {s < 2 && <div className="w-12 h-px bg-[rgba(201,168,76,0.2)]"/>}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 3 ? (
            <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-center glass-card rounded-3xl p-14 max-w-lg mx-auto">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-full bg-[rgba(201,168,76,0.1)] border-2 border-[#c9a84c] flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-[#c9a84c]"/>
              </motion.div>
              <h2 className="font-cinzel text-2xl font-bold text-[#f5f0e8] mb-3">¡Pedido Confirmado!</h2>
              <p className="text-[#f5f0e8]/50 font-inter mb-4">
                Tu pedido ha sido procesado exitosamente.
                Recibirás una confirmación y nos pondremos en contacto contigo.
              </p>
              {orderId && (
                <p className="text-xs text-[#f5f0e8]/30 font-inter mb-8">
                  ID: {orderId.substring(0, 8).toUpperCase()}
                </p>
              )}
              <div className="flex items-center justify-center gap-2 p-4 glass-card rounded-xl mb-8">
                <Truck size={18} className="text-[#c9a84c]"/>
                <p className="text-sm text-[#f5f0e8]/70 font-inter">
                  Delivery a <span className="text-[#c9a84c]">S/5</span> · {form.distrito}, Huancayo
                </p>
              </div>
              <Link href="/">
                <button className="btn-gold px-8 py-3 rounded-xl font-cinzel text-sm tracking-wider">
                  Volver al inicio
                </button>
              </Link>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card rounded-2xl p-7 space-y-5">
                <h2 className="font-cinzel text-lg font-bold text-[#f5f0e8] flex items-center gap-2">
                  <MapPin className="text-[#c9a84c]" size={20}/> Datos de Envío
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { k:"nombre",p:"Nombre completo" },
                    { k:"telefono",p:"Teléfono" },
                  ].map((f) => (
                    <input key={f.k} type="text" placeholder={f.p} value={(form as any)[f.k]}
                      onChange={(e) => update(f.k as keyof CheckoutForm, e.target.value)}
                      className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter"/>
                  ))}
                </div>
                <input type="email" placeholder="Email" value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter"/>
                <div className="relative">
                  <select value={form.distrito} onChange={(e) => update("distrito", e.target.value)}
                    className="w-full appearance-none bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c]/50 font-inter">
                    {DISTRICTS_HUANCAYO.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a84c] pointer-events-none"/>
                </div>
                <input type="text" placeholder="Dirección exacta (calle, número, barrio)"
                  value={form.direccion} onChange={(e) => update("direccion", e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter"/>
                <input type="text" placeholder="Referencia (cerca a, frente a...)"
                  value={form.referencia} onChange={(e) => update("referencia", e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter"/>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)]">
                  <Truck size={16} className="text-[#c9a84c]"/>
                  <p className="text-xs text-[#f5f0e8]/60 font-inter">
                    Delivery a S/5 a cualquier punto de Huancayo
                  </p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="w-full btn-gold py-4 rounded-xl font-cinzel text-sm tracking-widest uppercase">
                  Continuar al pago →
                </motion.button>
              </div>
              <OrderSummary items={items} sub={sub} tot={tot}/>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card rounded-2xl p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-cinzel text-lg font-bold text-[#f5f0e8] flex items-center gap-2">
                    <CreditCard className="text-[#c9a84c]" size={20}/> Pago con Tarjeta
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-[#f5f0e8]/40 font-inter">
                    <Lock size={12}/> Simulado seguro
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-[rgba(201,168,76,0.08)] to-[rgba(13,12,29,0.8)] border border-[rgba(201,168,76,0.15)]">
                  <p className="text-xs text-[#f5f0e8]/40 font-inter mb-2">PASARELA DE PAGO FICTICIA</p>
                  <p className="text-xs text-[#f5f0e8]/60 font-inter">
                    Usa cualquier número para simular el pago. Ej: 4111 1111 1111 1111
                  </p>
                </div>
                <div>
                  <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-2">NÚMERO DE TARJETA</label>
                  <input type="text" placeholder="0000 0000 0000 0000"
                    value={form.cardNumber}
                    onChange={(e) => update("cardNumber", formatCard(e.target.value))}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-mono tracking-widest"/>
                </div>
                <div>
                  <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-2">NOMBRE EN LA TARJETA</label>
                  <input type="text" placeholder="NOMBRE APELLIDO" value={form.cardName}
                    onChange={(e) => update("cardName", e.target.value.toUpperCase())}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter uppercase tracking-wider"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-2">VENCIMIENTO</label>
                    <input type="text" placeholder="MM/AA" value={form.expiry}
                      onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter"/>
                  </div>
                  <div>
                    <label className="text-xs text-[#f5f0e8]/50 font-cinzel tracking-wider block mb-2">CVV</label>
                    <input type="text" placeholder="000" maxLength={4} value={form.cvv}
                      onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0,4))}
                      className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)] rounded-xl py-3 px-4 text-sm text-[#f5f0e8] placeholder-[#f5f0e8]/30 focus:outline-none focus:border-[#c9a84c]/50 font-inter"/>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleOrder} disabled={submitting}
                  className="w-full btn-gold py-4 rounded-xl font-cinzel text-sm tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-50">
                  <Lock size={16}/>
                  {submitting ? "Procesando..." : `Pagar S/ ${tot.toFixed(2)}`}
                </motion.button>
              </div>
              <OrderSummary items={items} sub={sub} tot={tot}/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OrderSummary({ items, sub, tot }: { items: any[]; sub: number; tot: number }) {
  return (
    <div className="glass-card rounded-2xl p-6 h-fit sticky top-28">
      <h3 className="font-cinzel text-base font-bold text-[#f5f0e8] mb-4">Resumen</h3>
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between text-xs font-inter text-[#f5f0e8]/60">
            <span className="truncate max-w-[160px]">{i.nombre} x{i.cantidad}</span>
            <span>S/{(i.precio*i.cantidad).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[rgba(201,168,76,0.1)] pt-3 space-y-2">
        <div className="flex justify-between text-sm font-inter text-[#f5f0e8]/60">
          <span>Subtotal</span><span>S/{sub.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-inter text-[#f5f0e8]/60">
          <span>Envío</span><span className="text-[#c9a84c]">S/5.00</span>
        </div>
        <div className="flex justify-between font-bold pt-1">
          <span className="font-cinzel text-[#f5f0e8]">Total</span>
          <span className="text-[#c9a84c] text-lg">S/{tot.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
