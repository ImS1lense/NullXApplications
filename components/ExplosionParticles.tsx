
import React, { useEffect, useState } from 'react';

export const ExplosionParticles: React.FC = () => {
  const [particles, setParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = [];
    const colors = ['#fff', '#ccc', '#555', '#333', '#d00']; // Smoke, ash, and TNT red
    
    for(let i = 0; i < 40; i++) {
       newParticles.push({
         id: i,
         x: (Math.random() - 0.5) * 200, // Spread X
         y: (Math.random() - 0.5) * 200, // Spread Y
         color: colors[Math.floor(Math.random() * colors.length)]
       });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]">
      {particles.map((p) => (
        <div 
          key={p.id}
          className="absolute w-4 h-4 animate-particle-explode"
          style={{
            backgroundColor: p.color,
            '--tx': `${p.x}vw`,
            '--ty': `${p.y}vh`,
          } as React.CSSProperties}
        ></div>
      ))}
      <style>{`
        @keyframes particleExplode {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .animate-particle-explode {
          animation: particleExplode 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
