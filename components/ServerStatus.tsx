
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

  // Using hypixel as a placeholder since NullX IP is unknown/example. 
  // Change 'hypixel.net' to your actual server IP.
  const SERVER_IP = 'hypixel.net'; 

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

  return (
    <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20 hidden md:block animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-[#1f1f1f] rounded-lg p-3 flex items-center gap-3 shadow-xl hover:border-[#b000ff]/30 transition-colors group cursor-default">
        <div className="relative">
          {status?.icon ? (
            <img src={status.icon} alt="icon" className="w-10 h-10 rounded-md" />
          ) : (
            <div className="w-10 h-10 bg-[#222] rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-500">?</span>
            </div>
          )}
          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${status?.online ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Server Status</span>
          {loading ? (
             <span className="text-xs text-gray-500 animate-pulse">Pinging...</span>
          ) : status?.online ? (
            <div className="flex items-end gap-1">
              <span className="text-white font-mono font-bold leading-none">{status.players.online.toLocaleString()}</span>
              <span className="text-[10px] text-gray-500 leading-none mb-[1px]">/ {status.players.max.toLocaleString()} Players</span>
            </div>
          ) : (
            <span className="text-red-400 text-xs font-bold">Offline</span>
          )}
        </div>
      </div>
      
      {/* Visual Connection Lines decoration */}
      <div className="absolute top-full left-6 h-10 w-[1px] bg-gradient-to-b from-[#1f1f1f] to-transparent pointer-events-none"></div>
    </div>
  );
};
