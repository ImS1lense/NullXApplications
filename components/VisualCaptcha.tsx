
import React, { useState, useEffect } from 'react';

interface CaptchaItem {
  id: number;
  type: 'target' | 'decoy';
  iconPath: string;
}

interface VisualCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const CATEGORIES = [
  { name: 'Золотые яблоки', key: 'apple', icon: 'images/apple.png' },
  { name: 'Алмазные мечи', key: 'sword', icon: 'images/diamondsword.png' },
  { name: 'Криперов', key: 'creeper', icon: 'images/creeper.png' },
];

const DECOYS = [
  'images/chest.png',
  'images/dirt.png',
  'images/bread.png',
  'images/stone.png'
];

export const VisualCaptcha: React.FC<VisualCaptchaProps> = ({ onVerify }) => {
  const [targetCategory, setTargetCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<CaptchaItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setTargetCategory(category);
    setSelected([]);
    setError(false);
    setIsVerified(false);

    const newItems: CaptchaItem[] = [];
    const targetCount = 3 + Math.floor(Math.random() * 2);

    for (let i = 0; i < 9; i++) {
      const isTarget = i < targetCount;
      newItems.push({
        id: i,
        type: isTarget ? 'target' : 'decoy',
        iconPath: isTarget ? category.icon : DECOYS[Math.floor(Math.random() * DECOYS.length)]
      });
    }

    setItems(newItems.sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const toggleItem = (id: number) => {
    if (isVerified) return;
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setError(false);
  };

  const handleVerify = () => {
    const selectedTargets = items.filter(item => selected.includes(item.id) && item.type === 'target').length;
    const totalTargets = items.filter(item => item.type === 'target').length;
    const selectedDecoys = items.filter(item => selected.includes(item.id) && item.type === 'decoy').length;

    if (selectedTargets === totalTargets && selectedDecoys === 0 && selected.length > 0) {
      setIsVerified(true);
      onVerify(true);
    } else {
      setError(true);
      setTimeout(() => {
        generateCaptcha();
      }, 1000);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden shadow-2xl w-full max-w-[340px] mx-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-[#b000ff] p-5 text-white">
        <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-80 mb-1">Выберите все квадраты, где есть</p>
        <h4 className="text-xl font-brand font-black uppercase leading-none tracking-tight">{targetCategory.name}</h4>
      </div>

      <div className="p-2 grid grid-cols-3 gap-1 bg-[#050505]">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`relative aspect-square cursor-pointer transition-all duration-200 overflow-hidden group ${
              selected.includes(item.id) ? 'scale-[0.88]' : 'hover:scale-[0.97]'
            }`}
          >
            <div className={`w-full h-full flex items-center justify-center border-2 transition-all ${
              selected.includes(item.id) 
                ? 'border-[#b000ff] bg-[#b000ff]/20' 
                : 'border-[#1f1f1f] bg-[#111] hover:bg-[#161616]'
            }`}>
              <img 
                src={item.iconPath} 
                alt="Item" 
                className="w-12 h-12 object-contain image-pixelated"
                style={{ imageRendering: 'pixelated' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://minotar.net/cube/Steve/64.png'; // Fallback
                }}
              />
              
              {selected.includes(item.id) && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-[#b000ff] rounded-full flex items-center justify-center shadow-[0_0_10px_#b000ff]">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-[#1f1f1f] flex items-center justify-between">
        <button 
            type="button"
            onClick={generateCaptcha}
            className="text-gray-500 hover:text-white transition-colors"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </button>

        {isVerified ? (
          <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-right-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Проверено
          </div>
        ) : (
          <button
            type="button"
            onClick={handleVerify}
            className={`px-8 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all ${
              error 
                ? 'bg-red-600 text-white animate-shake' 
                : 'bg-gradient-to-r from-[#6200ea] to-[#b000ff] text-white hover:brightness-110 active:scale-95 shadow-lg'
            }`}
          >
            {error ? 'Повтор' : 'Проверить'}
          </button>
        )}
      </div>
    </div>
  );
};
