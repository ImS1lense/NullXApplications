
import React, { useEffect, useState } from 'react';

interface AchievementToastProps {
  show: boolean;
  title: string;
  description: string;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ show, title, description }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 right-0 z-[9999] p-4 flex justify-end pointer-events-none">
      <div 
        className="relative bg-[#202020] w-80 overflow-hidden flex items-center gap-3 p-2 animate-achievement-slide"
        style={{
          border: '2px solid white',
          boxShadow: 'inset 0 0 0 2px #555',
          imageRendering: 'pixelated'
        }}
      >
        {/* Background Noise/Gradient */}
        <div className="absolute inset-0 bg-[#252525] opacity-50 z-0"></div>

        {/* Icon */}
        <div className="relative z-10 w-10 h-10 bg-[#333] border-2 border-[#555] flex items-center justify-center shrink-0">
          <img 
            src="https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/enchanted_book.png" 
            alt="icon" 
            className="w-8 h-8 image-pixelated animate-pulse"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Text */}
        <div className="relative z-10 flex flex-col">
          <span className="text-[#ffff55] font-bold text-xs uppercase tracking-wider mb-0.5 drop-shadow-[1px_1px_0_#000]">
            Achievement Get!
          </span>
          <span className="text-white font-medium text-xs font-sans leading-tight drop-shadow-[1px_1px_0_#3f3f3f]">
            {title}
          </span>
          {description && (
             <span className="text-[#aaaaaa] text-[9px] mt-0.5 font-mono">
               {description}
             </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInDown {
          0% { transform: translateY(-150%); }
          20% { transform: translateY(0); }
          80% { transform: translateY(0); }
          100% { transform: translateY(-150%); }
        }
        .animate-achievement-slide {
          animation: slideInDown 5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};
