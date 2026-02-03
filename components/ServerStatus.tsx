
import React, { useEffect, useState } from 'react';

interface ServerStatusData {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  motd: {
    clean: string[];
  };
  icon?: string;
}

export const ServerStatus: React.FC = () => {
  const [status, setStatus] = useState<ServerStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Set to the specific NullX server IP
  const SERVER_IP = 'play.nullx.su'; 

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`);
        const data = await res.json();
        setStatus(data);
      } catch (e) {
        console.error("Failed to fetch server status", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="absolute top-6 left-6 md:top-10 md:left-10 z-20 hidden md:block animate-in fade-in slide-in-from-left-4 duration-700"
    >
      <button 
        onClick={handleCopy}
        className="bg-[#0a0a0a]/80 backdrop-blur-md border border-[#1f1f1f] rounded-xl p-5 flex items-center gap-5 shadow-xl hover:border-[#b000ff]/50 hover:bg-[#b000ff]/5 transition-all group cursor-pointer relative active:scale-95"
      >
        {/* Tooltip */}
        <div className={`absolute -bottom-10 left-0 whitespace-nowrap transition-all duration-300 bg-[#b000ff] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded shadow-lg pointer-events-none ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          {copied ? '✅ IP СКОПИРОВАН!' : 'НАЖМИ, ЧТОБЫ СКОПИРОВАТЬ IP'}
          {/* Arrow */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-[#b000ff] rotate-45"></div>
        </div>

        <div className="relative">
          {status?.icon ? (
            <img src={status.icon} alt="icon" className="w-12 h-12 rounded-md image-pixelated shadow-lg" style={{ imageRendering: 'pixelated' }} />
          ) : (
            <div className="w-12 h-12 bg-[#222] rounded-md flex items-center justify-center shadow-lg">
              <span className="text-xs text-gray-500 font-bold">?</span>
            </div>
          )}
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-[#0a0a0a] ${status?.online ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></span>
        </div>
        
        <div className="flex flex-col items-start gap-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#b000ff] transition-colors">
            {SERVER_IP}
          </span>
          {loading ? (
             <span className="text-xs text-gray-500 animate-pulse font-mono">Pinging...</span>
          ) : status?.online ? (
            <div className="flex items-end gap-2">
              <span className="text-white font-mono font-bold leading-none text-2xl">{status.players.online.toLocaleString()}</span>
              <span className="text-xs text-gray-500 leading-none mb-[3px] font-bold">/ {status.players.max.toLocaleString()} ON</span>
            </div>
          ) : (
            <span className="text-red-400 text-xs font-bold">Offline</span>
          )}
        </div>
      </button>
      
      {/* Visual Connection Lines decoration */}
      <div className="absolute top-full left-10 h-10 w-[1px] bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none"></div>
    </div>
  );
};
