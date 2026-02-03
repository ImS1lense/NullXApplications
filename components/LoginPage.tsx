import React from 'react';
import { DiscordIcon } from './DiscordIcon';
import { ShieldCheck, Lock, Globe, Server } from 'lucide-react';

// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================
const DISCORD_CLIENT_ID = '1468331655646417203'; // Твой ID установлен
const REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin : 'https://null-x-applications.vercel.app';

const LoginPage: React.FC = () => {

  const handleLogin = () => {
    // Формирование ссылки для входа
    // Используем window.location.origin для автоматического определения текущего домена
    // или фоллбэк на vercel если мы в среде где origin недоступен
    const currentRedirect = typeof window !== 'undefined' ? window.location.origin : 'https://null-x-applications.vercel.app';
    
    const scope = encodeURIComponent('identify email');
    const redirect = encodeURIComponent(currentRedirect);
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirect}&response_type=token&scope=${scope}`;
    
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white overflow-hidden font-sans selection:bg-purple-500/30 flex flex-col items-center justify-center relative">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #202020 1px, transparent 1px), linear-gradient(to bottom, #202020 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-purple-300 uppercase">System Secure</span>
          </div>

          <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none flex flex-col md:flex-row items-center justify-center select-none drop-shadow-2xl">
            <span className="text-white relative">
              NULL
              {/* Glitch effect line */}
              <span className="absolute -left-2 top-1/2 w-full h-[2px] bg-white/10"></span>
            </span>
            <span className="bg-gradient-to-br from-[#ac2cf5] to-[#5b21b6] bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              X
            </span>
          </h1>
          
          <div className="mt-4 flex flex-col items-center">
            <h2 className="text-xl font-bold tracking-[0.6em] text-zinc-500 uppercase">Staff Control Panel</h2>
          </div>
        </div>

        {/* Login Button Container */}
        <div className="w-full max-w-sm relative group">
          {/* Button Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          
          <button 
            onClick={handleLogin}
            className="relative w-full bg-[#0a0a0a] hover:bg-[#111] border border-white/10 hover:border-purple-500/50 text-white py-5 px-8 rounded-xl flex items-center justify-center gap-4 transition-all duration-300 transform active:scale-[0.98] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]"
          >
            <div className="bg-[#5865F2] p-2 rounded-lg">
              <DiscordIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Авторизация через</span>
              <span className="text-lg font-bold tracking-wide">Discord</span>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
              →
            </div>
          </button>
        </div>

        <p className="mt-6 text-zinc-600 text-xs max-w-xs text-center leading-relaxed">
          Нажимая кнопку, вы соглашаетесь с правилами обработки персональных данных и политикой конфиденциальности NULLX.
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 w-full border-t border-white/5 pt-10">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-3" />
            <span className="text-sm font-bold text-zinc-300">Защищенный вход</span>
            <span className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">SSL Encryption</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <Lock className="w-6 h-6 text-blue-500 mb-3" />
            <span className="text-sm font-bold text-zinc-300">Приватный доступ</span>
            <span className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">Staff Only</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <Server className="w-6 h-6 text-purple-500 mb-3" />
            <span className="text-sm font-bold text-zinc-300">Статус системы</span>
            <span className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">Stable v2.4.0</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center gap-6 text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
          <span className="hover:text-zinc-600 cursor-pointer transition-colors">Support</span>
          <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
          <span className="hover:text-zinc-600 cursor-pointer transition-colors">Terms</span>
          <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
          <span className="hover:text-zinc-600 cursor-pointer transition-colors">Status</span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;