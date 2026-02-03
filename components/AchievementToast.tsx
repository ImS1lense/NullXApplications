
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
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right duration-500 pointer-events-none">
      <div className="bg-[#202020] border-2 border-white/50 w-80 p-3 flex items-center gap-4 rounded-sm shadow-[4px_4px_0_0_#000]">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 border-2 border-white/30 flex items-center justify-center shrink-0">
          <img 
            src="https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/items/experience_bottle.png" 
            alt="xp" 
            className="w-8 h-8 image-pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-0.5" style={{ textShadow: '1px 1px 0 #000' }}>
            Achievement Get!
          </span>
          <span className="text-white font-medium text-xs font-sans leading-tight">
            {title}
          </span>
          <span className="text-gray-400 text-[10px] mt-1">
            {description}
          </span>
        </div>
      </div>
    </div>
  );
};
