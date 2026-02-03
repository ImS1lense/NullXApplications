import React from 'react';
import { DiscordIcon } from './DiscordIcon';
import { ShieldCheck, Lock, Server } from 'lucide-react';

// ==========================================
// КОНФИГУРАЦИЯ (ЗАПОЛНИ САМ)
// ==========================================
const DISCORD_CLIENT_ID = ''; // Вставь сюда свой ID когда будешь готов
const REDIRECT_URI = ''; // Вставь сюда Redirect URI если нужно жестко задать, иначе возьмется текущий домен

const LoginPage: React.FC = () => {

  const handleLogin = () => {
    // Если данные не заполнены, просто выводим в консоль или ничего не делаем
    if (!DISCORD_CLIENT_ID) {
      console.log("Discord Client ID не установлен");
      return;
    }

    const currentRedirect = REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : '');
    const scope = encodeURIComponent('identify email');
    const redirect = encodeURIComponent(currentRedirect);
    
    // Формирование URL
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirect}&response_type=token&scope=${scope}`;
    
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white overflow-hidden flex flex-col items-center justify-center relative selection:bg-purple-500/30">
      
      {/* Логотип слева сверху */}
      <div className="absolute top-8 left-8 z-50">
        {/* Проверь путь к изображению и расширение файла (png/svg/jpg) */}
        <img 
          src="/images/logo.png" 
          alt="NULLX Logo" 
          className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
        />
      </div>

      {/* Фоновая сетка */}
      <div className="absolute inset-0 z-0 opacity-[0.15]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #252525 1px, transparent 1px), linear-gradient(to bottom, #252525 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
           }}>
      </div>

      {/* Фоновое свечение (Ambient Glow) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-900/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-900/5 rounded-full blur-[120px]" />
      </div>

      {/* Основной контент */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
        
        {/* Заголовок */}
        <div className="text-center mb-16 relative">
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none flex flex-col md:flex-row items-center justify-center select-none">
            <span className="text-white relative drop-shadow-2xl">
              NULL
            </span>
            <span className="bg-gradient-to-br from-[#ac2cf5] to-[#7c3aed] bg-clip-text text-transparent filter drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]">
              X
            </span>
          </h1>
          
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <h2 className="text-sm md:text-base font-bold tracking-[0.8em] text-zinc-500 uppercase pl-2">
              Staff Authorization
            </h2>
          </div>
        </div>

        {/* Кнопка входа */}
        <div className="w-full max-w-[360px] relative group perspective-1000">
          {/* Эффект свечения под кнопкой */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
          
          <button 
            onClick={handleLogin}
            className="relative w-full bg-[#080808] hover:bg-[#0c0c0c] border border-white/5 hover:border-purple-500/30 text-white py-6 px-8 rounded-xl flex items-center justify-between gap-6 transition-all duration-300 transform active:translate-y-[1px] shadow-2xl"
          >
            <div className="flex items-center gap-5">
              <div className="bg-[#5865F2]/10 p-2.5 rounded-lg border border-[#5865F2]/20 group-hover:border-[#5865F2]/50 transition-colors">
                <DiscordIcon className="w-6 h-6 text-[#5865F2]" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-0.5">Login via</span>
                <span className="text-xl font-bold tracking-wide text-zinc-100 group-hover:text-white transition-colors">Discord</span>
              </div>
            </div>
            
            <div className="text-zinc-600 group-hover:text-purple-400 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </button>
        </div>

        {/* Информационные плашки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-2xl opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white/[0.02] transition-colors">
            <ShieldCheck className="w-5 h-5 text-zinc-600" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Secure Access</span>
          </div>
          <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white/[0.02] transition-colors">
            <Lock className="w-5 h-5 text-zinc-600" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-white/[0.02] transition-colors">
            <Server className="w-5 h-5 text-zinc-600" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Private Node</span>
          </div>
        </div>

        {/* Копирайт (еле заметный) */}
        <div className="mt-16 text-[10px] text-zinc-800 tracking-widest font-mono">
           NULLX NETWORK
        </div>

      </div>
    </div>
  );
};

export default LoginPage;