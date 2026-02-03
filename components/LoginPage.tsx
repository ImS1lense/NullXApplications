import React, { useState } from 'react';
import { DiscordIcon } from './DiscordIcon';
import { ShieldCheck, Lock, Cpu } from 'lucide-react';

// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================
const DISCORD_CLIENT_ID = ''; 
const REDIRECT_URI = ''; 

const LoginPage: React.FC = () => {
  const [mainLogoError, setMainLogoError] = useState(false);

  const handleLogin = () => {
    if (!DISCORD_CLIENT_ID) {
      console.log("Discord Client ID не установлен");
      return;
    }

    const currentRedirect = REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : '');
    const scope = encodeURIComponent('identify email');
    const redirect = encodeURIComponent(currentRedirect);
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirect}&response_type=token&scope=${scope}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center relative selection:bg-purple-500/30 font-sans">
      
      {/* --- BACKGROUND EFFECTS --- */}
      
      {/* 1. Static Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.07]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
           }}>
      </div>

      {/* 2. Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
           }}>
      </div>

      {/* 3. Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '8s'}} />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      {/* 4. Floating Particles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) opacity(0); }
          50% { opacity: 1; }
          100% { transform: translateY(-100px) opacity(0); }
        }
        .particle {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: float 10s infinite linear;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {[...Array(20)].map((_, i) => (
           <div key={i} className="particle" style={{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100 + 20}%`,
             width: `${Math.random() * 2 + 1}px`,
             height: `${Math.random() * 2 + 1}px`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${Math.random() * 10 + 10}s`
           }} />
         ))}
      </div>


      {/* --- LOGO (Top Left) --- */}
      <div className="absolute top-8 left-8 z-[100]">
        <img 
          src="/images/logo.png" 
          alt="" 
          className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300"
          onError={(e) => {
             e.currentTarget.style.display = 'none';
          }}
        />
      </div>


      {/* --- MAIN CARD --- */}
      <div className="relative z-10 w-full max-w-[500px] p-1">
        
        {/* Decorative borders for the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] blur-sm opacity-50"></div>
        
        <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-[1.8rem] p-8 md:p-12 flex flex-col items-center shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-10 relative w-full flex flex-col items-center">
            
            {/* Logic: Try to show Image Logo. If it fails (onError), switch to Text Logo fallback */}
            {!mainLogoError ? (
               <div className="mb-6 relative group">
                  <div className="absolute -inset-8 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                  <img 
                    src="/images/logo.png" 
                    alt=""
                    className="h-32 md:h-40 w-auto object-contain relative z-10 drop-shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                    onError={() => setMainLogoError(true)}
                  />
               </div>
            ) : (
               /* Fallback Text Logo if image fails */
               <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-none flex items-center justify-center select-none mb-3">
                 <span className="text-white drop-shadow-lg">NULL</span>
                 <span className="text-purple-500 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] ml-3">X</span>
               </h1>
            )}

            <p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-[0.35em] pl-1">
              Staff Authorization
            </p>
          </div>

          {/* Login Button */}
          <div className="w-full relative group perspective-1000 mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-500 animate-gradient-x"></div>
            
            <button 
              onClick={handleLogin}
              className="relative w-full bg-[#0F0F11] hover:bg-[#151518] border border-white/5 hover:border-white/10 text-white py-4 px-6 rounded-xl flex items-center justify-between gap-4 transition-all duration-300 group-active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#5865F2] p-2 rounded-lg shadow-lg shadow-[#5865F2]/20">
                  <DiscordIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Connect with</span>
                  <span className="text-base font-bold text-zinc-100">Discord ID</span>
                </div>
              </div>
              
              <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.02]">
              <ShieldCheck className="w-5 h-5 text-emerald-500/80 mb-2" />
              <span className="text-[10px] font-bold text-zinc-400">SECURE</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.02]">
              <Cpu className="w-5 h-5 text-blue-500/80 mb-2" />
              <span className="text-[10px] font-bold text-zinc-400">FAST</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.02]">
              <Lock className="w-5 h-5 text-purple-500/80 mb-2" />
              <span className="text-[10px] font-bold text-zinc-400">PRIVATE</span>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default LoginPage;