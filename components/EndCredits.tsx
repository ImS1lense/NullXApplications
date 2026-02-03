
import React, { useEffect, useRef } from 'react';

interface EndCreditsProps {
  onClose: () => void;
  username: string;
}

export const EndCredits: React.FC<EndCreditsProps> = ({ onClose, username }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // C418 - Alpha (Minecraft End Credits)
  // Using a more reliable CDN link
  const MUSIC_URL = "https://www.myinstants.com/media/sounds/c418-stranger-think.mp3"; 

  // Auto-redirect after animation ends (40 seconds)
  useEffect(() => {
    // Start Audio
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.volume = 0.5;
    // Attempt play
    const playPromise = audioRef.current.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
          console.log("Auto-play was prevented. Interaction needed.", error);
      });
    }

    const timer = setTimeout(() => {
      onClose();
    }, 40000); // Matches the 40s animation duration

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center font-minecraft">
      {/* Dirt Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: `url('https://cdn.jsdelivr.net/gh/PrismarineJS/minecraft-assets@master/data/1.16.1/blocks/dirt.png')`,
            backgroundSize: '64px',
            imageRendering: 'pixelated'
        }}
      ></div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none"></div>

      {/* Scrolling Text Container */}
      <div className="relative w-full max-w-2xl h-full overflow-hidden perspective-3d">
        <div className="animate-credits-scroll absolute top-[100%] left-0 right-0 text-center pb-20">
            <h1 className="text-[#20aaaa] font-bold text-4xl mb-12 uppercase tracking-widest drop-shadow-md">
                NullX Network
            </h1>

            <div className="space-y-12 text-lg md:text-xl font-medium leading-relaxed">
                <p className="text-white">Я вижу игрока, о котором ты говоришь.</p>
                <p className="text-[#20aaaa]">{username}</p>
                
                <p className="text-white">Да. Будь осторожен. Он достиг высшего уровня.</p>
                <p className="text-[#20aaaa]">Он может читать наши мысли.</p>
                <p className="text-white">Это неважно. Он думает, что мы — часть игры.</p>
                
                <div className="h-10"></div>
                
                <h2 className="text-[#20aaaa] text-2xl font-bold uppercase">Статус Заявки</h2>
                <p className="text-white">ОТПРАВЛЕНО УСПЕШНО</p>
                
                <div className="h-10"></div>

                <h2 className="text-[#20aaaa] text-2xl font-bold uppercase">Создано</h2>
                <p className="text-white">Команда Разработки NullX</p>
                
                <div className="h-10"></div>

                <h2 className="text-[#20aaaa] text-2xl font-bold uppercase">Особая Благодарность</h2>
                <p className="text-white">lowcocode</p>
                <p className="text-white">eternity</p>
                <p className="text-white">xentany</p>
                <p className="text-white">Egorov</p>
                <p className="text-white">И Тебе</p>

                <div className="h-32"></div>
                
                <p className="text-[#20aaaa] italic">Проснись.</p>
            </div>
        </div>
      </div>

      {/* Exit Button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
         <button 
           onClick={onClose}
           className="px-8 py-3 bg-transparent border border-white/20 text-white/50 hover:text-white hover:border-white transition-all font-mono uppercase text-xs tracking-[0.2em]"
         >
           [ ESC ] Пропустить
         </button>
      </div>

      <style>{`
        .perspective-3d {
            perspective: 600px;
        }
        @keyframes creditsScroll {
            0% { top: 100%; transform: rotateX(20deg) scale(0.9); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: -150%; transform: rotateX(0deg) scale(1); opacity: 0; }
        }
        .animate-credits-scroll {
            animation: creditsScroll 40s linear forwards;
        }
      `}</style>
    </div>
  );
};
