import React, { useState, useEffect } from 'react';
import { Users, Clock, Gamepad2, MessageSquare, Shield, Clock as ClockIcon } from 'lucide-react';
import { DiscordIcon } from './DiscordIcon';

// CONFIGURATION
// To make the login "real", replace this Client ID with your application's Client ID from the Discord Developer Portal.
// https://discord.com/developers/applications
const DISCORD_CLIENT_ID = '123456789012345678'; 
const REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

const LoginPage: React.FC = () => {
  const [serverOnline, setServerOnline] = useState(14);

  // Effect to simulate live server count (optional visual detail)
  useEffect(() => {
    const interval = setInterval(() => {
      setServerOnline(prev => Math.max(10, Math.min(200, prev + Math.floor(Math.random() * 3) - 1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    // This constructs a REAL Discord OAuth2 URL.
    // When you have a real Client ID, this will redirect users to the Discord permission screen.
    const scope = encodeURIComponent('identify email');
    const redirect = encodeURIComponent(REDIRECT_URI);
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirect}&response_type=token&scope=${scope}`;
    
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-purple-500/30">
      
      {/* Top Left Server Status Widget */}
      <div className="absolute top-8 left-8 z-50">
        <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md border border-white/5 rounded-xl p-3 pr-6 shadow-2xl">
          <div className="relative">
             {/* Mock Server Icon */}
             <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-500/20 overflow-hidden">
                <img src="https://i.imgur.com/zV8C30p.png" alt="Icon" className="w-8 h-8 opacity-80" />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">PLAY.NULLX.SU</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">{serverOnline}</span>
              <span className="text-xs text-zinc-500 font-medium">/ 2 025 ON</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center justify-start pt-32 min-h-screen pb-20">
        
        {/* Ambient Glow Center */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        {/* LOGO SECTION */}
        <div className="relative z-10 text-center flex flex-col items-center mb-12">
          {/* Main Title NULLX */}
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none flex items-center select-none">
            <span className="text-white">NULL</span>
            <span className="bg-gradient-to-br from-[#ac2cf5] to-[#6b2cf5] bg-clip-text text-transparent">X</span>
          </h1>
          
          {/* Subtitle STAFF TEAM */}
          <div className="mt-2 w-full flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-[0.4em] text-[#8b5cf6] uppercase">
              Staff Team
            </h2>
            {/* Divider Line */}
            <div className="w-full max-w-[300px] h-[1px] bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent mt-4 opacity-50"></div>
          </div>
        </div>

        {/* Description Text */}
        <p className="relative z-10 text-center text-zinc-400 max-w-2xl px-6 leading-relaxed mb-12 font-medium">
          Мы ищем амбициозных игроков, готовых следить за порядком и помогать 
          сообществу NullX расти. Твой путь в команду начинается здесь.
        </p>

        {/* ACTION BUTTON (Discord Login) */}
        <div className="relative z-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ac2cf5] to-[#6b2cf5] rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <button 
            onClick={handleLogin}
            className="relative bg-gradient-to-r from-[#8b2cf5] to-[#602cf5] hover:from-[#9b3cf5] hover:to-[#703cf5] text-white px-12 py-5 rounded-lg font-bold text-lg tracking-widest uppercase shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-300 transform active:scale-95 flex items-center gap-3"
          >
            <DiscordIcon className="w-6 h-6" />
            <span>Войти через Discord</span>
          </button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mt-24 text-center relative z-10">
          <div className="flex flex-col items-center gap-1 group cursor-default">
            <span className="text-5xl font-black text-white group-hover:text-purple-400 transition-colors">7</span>
            <span className="text-[10px] tracking-[0.2em] font-bold text-zinc-500 uppercase">Модераторов</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-default">
            <span className="text-5xl font-black text-white group-hover:text-purple-400 transition-colors">24/7</span>
            <span className="text-[10px] tracking-[0.2em] font-bold text-zinc-500 uppercase">Активность</span>
          </div>
          <div className="flex flex-col items-center gap-1 group cursor-default">
            <span className="text-5xl font-black text-white group-hover:text-purple-400 transition-colors">1k+</span>
            <span className="text-[10px] tracking-[0.2em] font-bold text-zinc-500 uppercase">Игроков</span>
          </div>
        </div>

        {/* LOWER SECTION Header */}
        <div className="mt-32 relative z-10 text-center">
          <h3 className="text-3xl font-black uppercase tracking-wide text-white mb-2">
            О работе персонала
          </h3>
          <p className="text-sm text-zinc-500">
            Мы — команда профессионалов, которая ежедневно делает сервер лучше
          </p>
        </div>

        {/* Footer Features (Cards preview like in screenshot) */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 w-full max-w-6xl px-4 opacity-50 blur-[1px] hover:blur-0 hover:opacity-100 transition-all duration-700">
          {[
            { icon: MessageSquare, title: "Коммуникация" },
            { icon: Users, title: "Коллектив" },
            { icon: ClockIcon, title: "График" },
            { icon: Shield, title: "Защита" }
          ].map((item, i) => (
            <div key={i} className="w-64 h-32 bg-zinc-900/50 border border-white/5 rounded-xl flex items-center justify-center gap-4 hover:border-purple-500/30 transition-colors">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <item.icon className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;