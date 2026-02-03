
import React, { useState, useEffect } from 'react';

const SPLASHES = [
  "Hire me!",
  "Also try Terraria!",
  "Creeper? Aww man!",
  "Now with AI!",
  "Don't dig straight down!",
  "Professional Code!",
  "100% bug free!",
  "Made by NullX!",
  "React + Vite!",
  "Press Alt+F4 for diamonds!",
  "Check the console!",
  "Herobrine removed!",
  "Better than Bedrock!"
];

export const SplashText: React.FC = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(SPLASHES[Math.floor(Math.random() * SPLASHES.length)]);
  }, []);

  return (
    <div className="absolute -top-6 -right-12 md:-right-32 rotate-[-20deg] animate-splash z-20 pointer-events-none select-none">
      <span className="text-[#ffff55] font-minecraft text-sm md:text-xl font-bold drop-shadow-[2px_2px_0_#3f3f3f] whitespace-nowrap">
        {text}
      </span>
      <style>{`
        @font-face {
          font-family: 'Minecraftia';
          src: url('https://cdn.jsdelivr.net/gh/South-Paw/typeface-minecraftia/src/Minecraftia-Regular.woff2') format('woff2');
        }
        .font-minecraft {
          font-family: 'Minecraftia', sans-serif;
        }
        @keyframes splashScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .animate-splash {
          animation: splashScale 0.6s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};
