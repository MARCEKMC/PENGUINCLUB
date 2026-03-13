import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "El Paraíso de los Ternos | Alquiler y Venta en Huancayo",
  description:
    "La mejor tienda de alquiler y venta de ternos en Huancayo, Perú. Sombreros, camisas, corbatas, chalecos, sacos, correas, pantalones y zapatos.",
  keywords: ["ternos", "alquiler", "venta", "Huancayo", "trajes", "formal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#13110f",
              color: "#f5f0e8",
              border: "1px solid rgba(201,168,76,0.3)",
            },
            success: {
              iconTheme: {
                primary: "#c9a84c",
                secondary: "#0e0c0a",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#0e0c0a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
