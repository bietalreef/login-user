import { motion } from 'motion/react';

export function ArchitecturalBackground() {
  return (
    <div className="absolute inset-0">
      {/* Base gradient with desert tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1e8] via-[#ebe5d9] to-[#e8dfd0]" />

      {/* Architectural grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(120, 100, 80, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120, 100, 80, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Diagonal architectural lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diagonalLines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="100" y2="100" stroke="#c4a57b" strokeWidth="1" />
            <line x1="0" y1="50" x2="50" y2="100" stroke="#c4a57b" strokeWidth="1" />
            <line x1="50" y1="0" x2="100" y2="50" stroke="#c4a57b" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonalLines)" />
      </svg>

      {/* Geometric pattern overlay - architectural */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c4a57b' stroke-width='1'%3E%3Crect x='10' y='10' width='30' height='30'/%3E%3Crect x='60' y='10' width='30' height='30'/%3E%3Crect x='10' y='60' width='30' height='30'/%3E%3Crect x='60' y='60' width='30' height='30'/%3E%3Ccircle cx='50' cy='50' r='15'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gold aura light - top right */}
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Green aura light - bottom left */}
      <motion.div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Gold aura light - center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(218, 165, 32, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Subtle geometric shapes for architectural feel */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
            <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="none" stroke="#c4a57b" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>

      {/* Soft vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(235, 229, 217, 0.3) 100%)',
        }}
      />
    </div>
  );
}