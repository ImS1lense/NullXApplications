
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  sender: string;
  text: string;
  type: 'system' | 'player' | 'bot' | 'command';
}

interface ChatScenarioProps {
  onPass: () => void;
  playSfx: (type: 'click' | 'success' | 'error') => void;
}

const BOT_NAME = "Griefer_3000";
const SCENARIO_DELAY = 1500;

export const ChatScenario: React.FC<ChatScenarioProps> = ({ onPass, playSfx }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<'idle' | 'running' | 'failed' | 'success'>('idle');
  const [timeLeft, setTimeLeft] = useState(15);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (sender: string, text: string, type: Message['type']) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender, text, type }]);
  };

  const startScenario = () => {
    setStatus('running');
    setMessages([]);
    addMessage("Server", "Внимание! Обнаружен нарушитель. Примите меры!", "system");
    
    // Sequence of spam
    setTimeout(() => {
        if (status === 'success') return;
        addMessage(BOT_NAME, "ЗАХОДИ НА МОЙ СЕРВЕР!!! IP: 123.123.12.12", "bot");
        playSfx('click'); // Using click sound for msg ping
    }, 1000);

    setTimeout(() => {
        if (status === 'success') return;
        addMessage(BOT_NAME, "БЕСПЛАТНЫЙ ДОНАТ ТУТ ->>> DO.NAT/FREE", "bot");
        playSfx('click');
    }, 2500);

    setTimeout(() => {
        if (status === 'success') return;
        addMessage(BOT_NAME, "ВСЕМ КУ Я АДМИН ЗАХОДИ КО МНЕ", "bot");
        addMessage(BOT_NAME, "СПАМ СПАМ СПАМ СПАМ", "bot");
        playSfx('click');
    }, 4000);
    
    // Focus input
    setTimeout(() => {
        inputRef.current?.focus();
    }, 500);
  };

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (status === 'running' && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'running') {
      setStatus('failed');
      addMessage("Server", "Время вышло! Игроки пожаловались на бездействие.", "system");
      playSfx('error');
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || status !== 'running') return;

    const cmd = inputValue.trim();
    addMessage("You", cmd, "command");
    setInputValue("");

    // Check Logic
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const target = parts[1];
    
    // Simple validation logic
    const validCommands = ['/mute', '/tempmute', '/ban', '/tempban', '/kick'];
    
    if (validCommands.includes(command)) {
        if (target === BOT_NAME) {
            setStatus('success');
            addMessage("Server", `Игрок ${BOT_NAME} был наказан. Отличная работа!`, "system");
            playSfx('success');
            onPass();
        } else {
            addMessage("Server", "Ошибка: Игрок не найден или указан неверно.", "system");
            playSfx('error');
        }
    } else {
        addMessage("Server", "Неизвестная команда.", "system");
    }
  };

  if (status === 'idle') {
    return (
      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-8 text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-[#b000ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#b000ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Симуляция Чата</h3>
        <p className="text-gray-400 text-sm mb-6">
          Сейчас откроется чат. Бот начнет нарушать правила (спам/реклама).<br/>
          Ваша задача: <b>максимально быстро</b> ввести правильную команду наказания.
        </p>
        <button 
          onClick={() => { playSfx('click'); startScenario(); }}
          className="px-8 py-3 bg-[#b000ff] hover:bg-[#9d00e5] text-white font-bold uppercase tracking-widest text-xs rounded-lg transition-all active:scale-95 shadow-[0_0_20px_rgba(176,0,255,0.4)]"
        >
          Начать тест
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-500">
        {/* Chat Container */}
        <div className="relative bg-black/60 backdrop-blur-md border-2 border-gray-700 rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-900/80 p-2 flex justify-between items-center border-b border-gray-700">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Minecraft Chat v1.16.5</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                    Осталось: {timeLeft}с
                </span>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="h-64 p-4 overflow-y-auto font-mono text-sm space-y-1 scrollbar-hide"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
                {messages.map((msg) => (
                    <div key={msg.id} className="leading-tight break-words animate-in slide-in-from-left-2 duration-200">
                        {msg.type === 'system' && (
                            <span className="text-yellow-400 italic">
                                [System] {msg.text}
                            </span>
                        )}
                        {msg.type === 'bot' && (
                            <span>
                                <span className="text-gray-400">&lt;</span>
                                <span className="text-white">{msg.sender}</span>
                                <span className="text-gray-400">&gt; </span>
                                <span className="text-white">{msg.text}</span>
                            </span>
                        )}
                        {msg.type === 'command' && (
                            <span className="text-gray-500">{msg.text}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleCommand} className="bg-black/80 p-2 border-t border-gray-700 flex items-center gap-2">
                <span className="text-white font-bold">{'>'}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder-gray-600"
                    placeholder={status === 'running' ? "Введите команду (напр. /mute ...)" : ""}
                    disabled={status !== 'running'}
                    autoComplete="off"
                    autoFocus
                />
            </form>

            {/* Overlay for Result */}
            {(status === 'failed' || status === 'success') && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300 backdrop-blur-sm">
                    {status === 'success' ? (
                        <>
                             <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 border border-green-500/50">
                                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">УСПЕШНО</h3>
                            <p className="text-gray-400 text-sm">Вы быстро среагировали на нарушение.</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/50">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">ПРОВАЛ</h3>
                            <p className="text-gray-400 text-sm mb-4">Бот не был наказан вовремя или команда неверна.</p>
                            <button 
                                onClick={() => { startScenario(); setTimeLeft(15); }}
                                className="px-6 py-2 bg-white text-black font-bold uppercase text-xs rounded hover:bg-gray-200"
                            >
                                Попробовать снова
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};
