import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, ItemPedido } from "./types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) =>
            i.producto_id === item.producto_id &&
            i.tipo === item.tipo &&
            i.color === item.color &&
            i.talla === item.talla
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === existing.id
                ? { ...i, cantidad: i.cantidad + item.cantidad }
                : i
            ),
          }));
        } else {
          const id = `${item.producto_id}-${item.tipo}-${item.color || ""}-${item.talla || ""}-${Date.now()}`;
          set((state) => ({ items: [...state.items, { ...item, id }] }));
        }
        set({ isOpen: true });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, cantidad: quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      subtotal: () =>
        get().items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),

      total: () => get().subtotal() + 5,

      itemCount: () =>
        get().items.reduce((acc, item) => acc + item.cantidad, 0),
    }),
    {
      name: "penguinclub-cart",
    }
  )
);
