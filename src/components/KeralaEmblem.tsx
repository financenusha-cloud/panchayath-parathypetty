import React from 'react';

export function KeralaEmblem({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Circular Ring with Gold Trim */}
        <circle cx="50" cy="50" r="47" fill="#0C5E3D" stroke="#D97706" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43" fill="#0A4D32" stroke="#FEF3C7" strokeWidth="0.8" strokeDasharray="2 1.5" />
        
        {/* Conch / Shankha Motif (ശംഖ്) */}
        <ellipse cx="50" cy="48" rx="16" ry="21" fill="#FFFFFF" opacity="0.95" />
        <path d="M44 38C46 34 54 34 56 38C58 43 54 55 50 63C46 55 42 43 44 38Z" fill="#D97706" />
        <circle cx="50" cy="42" r="3.5" fill="#0C5E3D" />

        {/* Traditional Nilavilakku Crown / Ashoka Base */}
        <path d="M38 68H62L58 72H42L38 68Z" fill="#F59E0B" />
        <rect x="45" y="64" width="10" height="4" rx="1" fill="#FBBF24" />
        
        {/* Decorative Laurel / Paddy ears (നെൽക്കതിരുകൾ) */}
        <path d="M22 62C20 48 26 34 35 27M78 62C80 48 74 34 65 27" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="27" cy="44" r="1.8" fill="#FDE68A" />
        <circle cx="23" cy="53" r="1.8" fill="#FDE68A" />
        <circle cx="73" cy="44" r="1.8" fill="#FDE68A" />
        <circle cx="77" cy="53" r="1.8" fill="#FDE68A" />

        {/* Top Government Stars */}
        <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#FBBF24" />
      </svg>
    </div>
  );
}
