import React from 'react';
import { DiscordIcon } from './DiscordIcon';

// ==========================================
// НАСТРОЙКИ (ОБЯЗАТЕЛЬНО ПРОЧИТАЙ)
// ==========================================
// 1. Зайди на https://discord.com/developers/applications
// 2. Создай новое приложение (New Application)
// 3. Скопируй "Application ID" (это и есть Client ID) и вставь ниже вместо 'ВСТАВЬ_СЮДА_CLIENT_ID'
// 4. В меню "OAuth2" (слева) добавь Redirect URI такой же, как адрес твоего сайта 
//    (например: http://localhost:3000 или https://твой-сайт.ру)

const DISCORD_CLIENT_ID = '1468331655646417203'; // <--- СЮДА ВСТАВЛЯТЬ ID
const REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

const LoginPage: React.FC = () => {

  const handleLogin = () => {
    // Проверка, настроил ли ты ID
    if (DISCORD_CLIENT_ID === '1468331655646417203' || DISCORD_CLIENT_ID === '123456789012345678') {
      alert(
        `⚠️ ТРЕБУЕТСЯ НАСТРОЙКА!\n\n` +
        `Ты не указал Client ID своего приложения Discord в коде.\n\n` +
        `1. Открой файл components/LoginPage.tsx\n` +
        `2. Найди константу DISCORD_CLIENT_ID\n` +
        `3. Вставь туда ID из Discord Developer Portal\n` +
        `4. Убедись, что в Discord Developer Portal в разделе OAuth2 добавлен Redirect URI: ${REDIRECT_URI}`
      );
      return;
    }

    // Формирование настоящей ссылки для входа через Discord
    const scope = encodeURIComponent('identify email');
    const redirect = encodeURIComponent(REDIRECT_URI);
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirect}&response_type=token&scope=${scope}`;
    
    window.location.href = url;
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-purple-500/30 flex flex-col items-center justify-center relative">
      
      {/* Background Decor - Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 w-full">
        
        {/* LOGO SECTION */}
        <div className="text-center flex flex-col items-center mb-10">
          {/* Main Title NULLX */}
          <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-none flex items-center select-none mb-4">
            <span className="text-white">NULL</span>
            <span className="bg-gradient-to-br from-[#ac2cf5] to-[#6b2cf5] bg-clip-text text-transparent">X</span>
          </h1>
          
          {/* Subtitle */}
          <div className="flex flex-col items-center w-full">
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.5em] text-[#8b5cf6] uppercase pl-2">
              АВТОРИЗАЦИЯ
            </h2>
            {/* Divider Line */}
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent mt-5 opacity-60"></div>
          </div>
        </div>

        {/* Description Text */}
        <p className="text-center text-zinc-500 max-w-md leading-relaxed mb-12 font-medium">
          Для доступа к панели управления необходимо подтвердить свою личность через Discord.
        </p>

        {/* ACTION BUTTON (Discord Login) */}
        <div className="relative z-20 group w-full max-w-xs">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ac2cf5] to-[#6b2cf5] rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <button 
            onClick={handleLogin}
            className="relative w-full bg-[#050505] border border-white/10 hover:border-purple-500/50 text-white py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
            <span>ВОЙТИ ЧЕРЕЗ DISCORD</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-[10px] text-zinc-800 tracking-[0.2em] font-bold uppercase select-none">
          NULLX PROJECT &copy; {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;