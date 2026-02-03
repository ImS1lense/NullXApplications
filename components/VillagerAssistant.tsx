
import React, { useState, useEffect, useRef } from 'react';

const VILLAGER_SOUNDS = [
  'https://www.myinstants.com/media/sounds/minecraft-villager-hah.mp3', // Hmmm
  'https://www.myinstants.com/media/sounds/minecraft-villager-sound-effect.mp3' // Hmmm 2
];

const EMERALD_SRC = "https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/emerald.png";

export const VillagerAssistant: React.FC = () => {
  const [state, setState] = useState<'idle' | 'trading' | 'sleeping'>('idle');
  const [showBubble, setShowBubble] = useState(false);
  const [emeralds, setEmeralds] = useState<{id: number, x: number, y: number}[]>([]);
  const idleTimerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sound Logic
  const playIdleSound = () => {
    const sound = VILLAGER_SOUNDS[Math.floor(Math.random() * VILLAGER_SOUNDS.length)];
    const audio = new Audio(sound);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // Activity Tracking
  useEffect(() => {
    const resetIdle = () => {
      setShowBubble(false);
      setState('trading'); // Looking at player
      
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      idleTimerRef.current = window.setTimeout(() => {
        setState('idle');
        setShowBubble(true);
        playIdleSound();
      }, 15000); // 15 seconds idle
    };

    const handleTyping = () => {
        resetIdle();
        spawnEmerald();
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('villager-happy', handleTyping); // Custom event from inputs

    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('villager-happy', handleTyping);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const spawnEmerald = () => {
      const id = Date.now();
      // Randomize trajectory slightly
      const xOffset = (Math.random() - 0.5) * 50;
      
      setEmeralds(prev => [...prev.slice(-5), { id, x: xOffset, y: 0 }]);
      
      setTimeout(() => {
          setEmeralds(prev => prev.filter(e => e.id !== id));
      }, 1000);
  };

  return (
    <div ref={containerRef} className="fixed bottom-0 left-4 z-40 hidden md:flex flex-col items-center pointer-events-none">
       {/* Speech Bubble */}
       <div className={`mb-2 bg-white text-black p-2 rounded-lg relative transition-all duration-300 ${showBubble ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <p className="font-minecraft text-xs font-bold whitespace-nowrap">Hmmmm...</p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
       </div>

       {/* Villager Sprite */}
       <div className="relative w-24 h-24 group transition-transform duration-300">
          <img 
            src="https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.16.1/entities/villager/profession/librarian.png" // Using texture as placeholder, ideally use a head render
            // Since raw textures are flat, let's use a head icon for better look
            srcSet="https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/09/Villager_Head_2.png"
            alt="Villager"
            className={`w-full h-full object-contain filter drop-shadow-lg transition-transform duration-500 ${state === 'idle' ? 'scale-95 brightness-90' : 'scale-105 brightness-110'}`}
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* Emerald Particles */}
          {emeralds.map(emerald => (
              <img 
                key={emerald.id}
                src={EMERALD_SRC}
                className="absolute w-6 h-6 animate-toss"
                style={{ 
                    left: `calc(50% + ${emerald.x}px)`,
                    bottom: '60%',
                    imageRendering: 'pixelated',
                    '--tx': `${emerald.x * 2}px`, 
                } as React.CSSProperties}
              />
          ))}
       </div>

       <style>{`
         @keyframes toss {
            0% { transform: translate(0, 0) rotate(0deg) scale(0.5); opacity: 0; }
            20% { opacity: 1; scale: 1; }
            100% { transform: translate(var(--tx), -100px) rotate(360deg) scale(0.8); opacity: 0; }
         }
         .animate-toss {
            animation: toss 0.8s ease-out forwards;
         }
         .font-minecraft {
            font-family: 'Unbounded', sans-serif; 
         }
       `}</style>
    </div>
  );
};
