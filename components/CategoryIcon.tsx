import { CategoriaProducto } from "@/lib/types";

interface CategoryIconProps {
  cat: CategoriaProducto;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ cat, size = 32, className = "" }: CategoryIconProps) {
  const icons: Record<CategoriaProducto, JSX.Element> = {
    sombrero: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <path d="M22 8c-4.4 0-8 2.2-8 5v10h16V13c0-2.8-3.6-5-8-5z" fill="currentColor"/>
        <rect x="10" y="23" width="24" height="5" rx="2" fill="currentColor"/>
        <rect x="6" y="28" width="32" height="4" rx="2" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
    camisa: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <path d="M14 6L4 14v6h8v18h20V20h8v-6L30 6" fill="currentColor" opacity="0.9"/>
        <path d="M14 6c0 4.4 3.6 8 8 8s8-3.6 8-8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <line x1="22" y1="14" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="22" cy="26" r="1.2" fill="currentColor" opacity="0.5"/>
        <circle cx="22" cy="30" r="1.2" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    corbata: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <path d="M22 6l-5 10 5 24 5-24z" fill="currentColor"/>
        <path d="M17 10l-2 3h14l-2-3z" fill="currentColor" opacity="0.7"/>
      </svg>
    ),
    chaleco: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <path d="M14 6v32H8l-2-6V12l8-6z" fill="currentColor" opacity="0.85"/>
        <path d="M30 6v32h6l2-6V12l-8-6z" fill="currentColor" opacity="0.85"/>
        <path d="M14 6c2 5 4 8 8 8s6-3 8-8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="22" cy="22" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="22" cy="28" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="22" cy="34" r="1.5" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    saco: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <path d="M16 4L4 14v26h36V14L28 4" fill="currentColor" opacity="0.9"/>
        <path d="M16 4c0 3.3 2.7 6 6 6s6-2.7 6-6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M22 10v10" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
        <path d="M16 18l6 3 6-3" stroke="currentColor" strokeWidth="1.5" opacity="0.6" fill="none"/>
        <path d="M4 18h12M28 18h12" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
        <rect x="19" y="26" width="6" height="8" rx="1" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
    correa: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <rect x="4" y="18" width="36" height="8" rx="3" fill="currentColor" opacity="0.9"/>
        <rect x="13" y="15" width="9" height="14" rx="2" fill="currentColor"/>
        <circle cx="17.5" cy="22" r="2.5" fill="currentColor" opacity="0.4"/>
        <circle cx="17.5" cy="22" r="1" fill="currentColor"/>
        <rect x="22" y="21" width="14" height="2" rx="1" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    pantalon: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <rect x="8" y="6" width="28" height="6" rx="2" fill="currentColor" opacity="0.7"/>
        <path d="M11 12L8 38h10l4-14 4 14h10l-3-26" fill="currentColor" opacity="0.85"/>
        <line x1="22" y1="12" x2="22" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      </svg>
    ),
    zapatos: (
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" className={className}>
        <path d="M6 28c0-5 3-12 10-16l10-4 4 2v12l10 6v4H6z" fill="currentColor" opacity="0.9"/>
        <rect x="6" y="32" width="32" height="4" rx="2" fill="currentColor"/>
        <path d="M14 16v16" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
        <path d="M18 8l4 2" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
      </svg>
    ),
  };
  return icons[cat] ?? null;
}
