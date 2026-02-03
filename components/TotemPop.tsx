
import React, { useEffect, useState } from 'react';

interface TotemPopProps {
  show: boolean;
  onComplete?: () => void;
}

const TOTEM_SOUND = "https://www.myinstants.com/media/sounds/totem-of-undying-minecraft-sound.mp3";
const TOTEM_IMAGE = "https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/totem_of_undying.png";

export const TotemPop: React.FC<TotemPopProps> = ({ show, onComplete }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (show) {
      setActive(true);
      const audio = new Audio(TOTEM_SOUND);
      audio.volume = 0.5;
      audio.play().catch(() => {});

      const timer = setTimeout(() => {
        setActive(false);
        if (onComplete) onComplete();
      }, 2500); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Yellow/Green Overlay Flash */}
      <div className="absolute inset-0 bg-[#ffd900] opacity-0 animate-totem-flash mix-blend-screen"></div>
      
      {/* Particles */}
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-[80vw] h-[80vh] bg-[radial-gradient(circle,#74ff42_0%,transparent_70%)] opacity-0 animate-totem-flash"></div>
      </div>

      {/* The Totem Item */}
      <div className="relative animate-totem-pop">
        <img 
          src={TOTEM_IMAGE} 
          alt="Totem" 
          className="w-64 h-64 md:w-96 md:h-96 object-contain drop-shadow-[0_0_50px_rgba(255,233,0,0.6)]"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      <style>{`
        @keyframes totemPop {
          0% { transform: translateY(100%) scale(0.5) rotate(-10deg); opacity: 0; }
          15% { transform: translateY(0) scale(1.2) rotate(0deg); opacity: 1; }
          30% { transform: translateY(0) scale(1) rotate(5deg); }
          80% { transform: translateY(0) scale(1) rotate(-5deg); opacity: 1; }
          100% { transform: translateY(100%) scale(0.5) rotate(10deg); opacity: 0; }
        }
        @keyframes totemFlash {
          0% { opacity: 0; }
          15% { opacity: 0.4; }
          100% { opacity: 0; }
        }
        .animate-totem-pop {
          animation: totemPop 2.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-totem-flash {
          animation: totemFlash 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
