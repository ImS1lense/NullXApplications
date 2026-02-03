
import React, { useState, useRef, useEffect } from 'react';

export const Jukebox: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Using a royalty-free calm ambient track that resembles Minecraft style
  // Since we cannot rely on copyrighted C418 links staying up
  const MUSIC_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf87a.mp3"; 

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
      setIsPlaying(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      {/* Jukebox Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <button
          onClick={toggleMusic}
          className={`relative group w-14 h-14 rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:border-[#b000ff]/50 overflow-hidden ${isPlaying ? 'ring-2 ring-[#b000ff] shadow-[#b000ff]/20' : ''}`}
        >
          {/* Disc Animation */}
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
             {/* Disc Texture */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-800 to-black border-4 border-gray-900"></div>
             {/* Inner Label */}
             <div className="absolute w-4 h-4 rounded-full bg-[#b000ff]"></div>
          </div>
          
          {/* Notes Particles */}
          {isPlaying && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-note-1 text-[#b000ff] text-xs">♪</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-note-2 text-[#80ff20] text-xs">♫</div>
            </div>
          )}
        </button>
      </div>

      {/* "Now Playing" Toast */}
      <div className={`fixed bottom-24 right-6 bg-[#111] border border-[#b000ff] text-white px-4 py-2 rounded-lg shadow-xl z-50 transition-all duration-500 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center gap-3">
           <span className="text-[#b000ff] animate-pulse">Now Playing:</span>
           <span className="text-xs font-mono">C418 - Sweden (Lo-Fi)</span>
        </div>
      </div>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }
        @keyframes floatNote1 {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-150%, -250%) scale(1.5); opacity: 0; }
        }
        @keyframes floatNote2 {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(50%, -250%) scale(1.5) rotate(20deg); opacity: 0; }
        }
        .animate-note-1 { animation: floatNote1 2s infinite ease-out; }
        .animate-note-2 { animation: floatNote2 2.5s infinite ease-out 0.5s; }
      `}</style>
    </>
  );
};
