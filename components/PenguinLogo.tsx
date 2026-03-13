"use client";

interface PenguinLogoProps {
  size?: number;
  className?: string;
}

export default function PenguinLogo({ size = 48, className = "" }: PenguinLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="50" cy="54" rx="38" ry="42" stroke="currentColor" strokeWidth="3.5"/>
      <ellipse cx="50" cy="66" rx="22" ry="26" stroke="currentColor" strokeWidth="3"/>
      <circle cx="36" cy="42" r="7" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="64" cy="42" r="7" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="37.5" cy="43" r="3" fill="currentColor"/>
      <circle cx="65.5" cy="43" r="3" fill="currentColor"/>
      <circle cx="36.5" cy="41" r="1.1" fill="white"/>
      <circle cx="64.5" cy="41" r="1.1" fill="white"/>
      <path d="M44 54 L50 48 L56 54 L50 60 Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
