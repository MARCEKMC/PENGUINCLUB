export type CategoriaProducto =
  | "sombrero"
  | "camisa"
  | "corbata"
  | "chaleco"
  | "saco"
  | "correa"
  | "pantalon"
  | "zapatos";

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "en_camino"
  | "entregado"
  | "cancelado";

export type EstadoCita =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada";

export interface Producto {
  id: string;
  nombre: string;
  categoria: CategoriaProducto;
  descripcion: string | null;
  precio_venta: number | null;
  precio_alquiler: number | null;
  stock: number;
  stock_alquiler: number;
  colores: string[];
  tallas: string[];
  imagenes: string[];
  disponible_venta: boolean;
  disponible_alquiler: boolean;
  destacado: boolean;
  created_at: string;
  updated_at: string;
}

export interface Perfil {
  id: string;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  direccion: string | null;
  ciudad: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemPedido {
  producto_id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  precio: number;
  tipo: "venta" | "alquiler";
  color?: string;
  talla?: string;
  imagen?: string;
}

export interface Pedido {
  id: string;
  usuario_id: string | null;
  nombre_cliente: string;
  email_cliente: string | null;
  telefono: string | null;
  direccion_entrega: string;
  ciudad: string;
  referencia: string | null;
  items: ItemPedido[];
  subtotal: number;
  costo_envio: number;
  total: number;
  estado: EstadoPedido;
  metodo_pago: string;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cita {
  id: string;
  usuario_id: string | null;
  nombre_cliente: string;
  email_cliente: string | null;
  telefono: string;
  fecha: string;
  hora: string;
  items: ItemPedido[];
  duracion_dias: number;
  tipo_evento: string | null;
  notas: string | null;
  estado: EstadoCita;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends ItemPedido {
  id: string;
}

export const CATEGORIAS_INFO: Record<
  CategoriaProducto,
  { label: string; emoji: string; descripcion: string }
> = {
  sombrero: {
    label: "Sombreros",
    emoji: "🎩",
    descripcion: "Elegancia desde la cabeza",
  },
  camisa: {
    label: "Camisas",
    emoji: "👔",
    descripcion: "Frescura y distinción",
  },
  corbata: {
    label: "Corbatas",
    emoji: "👔",
    descripcion: "El toque final perfecto",
  },
  chaleco: {
    label: "Chalecos",
    emoji: "🥻",
    descripcion: "Sofisticación clásica",
  },
  saco: {
    label: "Sacos",
    emoji: "🥼",
    descripcion: "Porte y elegancia",
  },
  correa: {
    label: "Correas",
    emoji: "👖",
    descripcion: "Detalles que importan",
  },
  pantalon: {
    label: "Pantalones",
    emoji: "👖",
    descripcion: "Corte impecable",
  },
  zapatos: {
    label: "Zapatos",
    emoji: "👞",
    descripcion: "El fundamento del estilo",
  },
};
