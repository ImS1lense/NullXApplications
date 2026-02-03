
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
  { name: 'Золотые яблоки', key: 'apple', icon: 'https://minecraft.wiki/images/Golden_Apple_JE2_BE2.png' },
  { name: 'Алмазные мечи', key: 'sword', icon: 'https://minecraft.wiki/images/Diamond_Sword_JE3_BE3.png' },
  { name: 'Криперов', key: 'creeper', icon: 'https://minecraft.wiki/images/Creeper_Face_JE1.png' },
  { name: 'ТНТ', key: 'tnt', icon: 'https://minecraft.wiki/images/TNT_JE3_BE2.png' },
];

const DECOYS = [
  'https://minecraft.wiki/images/Chest_JE2_BE2.png',
  'https://minecraft.wiki/images/Bread_JE3_BE3.png',
  'https://minecraft.wiki/images/Stone_JE2_BE2.png',
  'https://minecraft.wiki/images/Oak_Log_JE3_BE2.png',
  'https://minecraft.wiki/images/Iron_Ingot_JE3_BE2.png',
];

export const VisualCaptcha: React.FC<VisualCaptchaProps> = ({ onVerify }) => {
  const [targetCategory, setTargetCategory] = useState(CATEGORIES[0]);
  const [items, setItems] = useState<CaptchaItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [stage, setStage] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = (currentStage: number) => {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setTargetCategory(category);
    setSelected([]);
    setError(false);
    setIsVerifying(false);

    const newItems: CaptchaItem[] = [];
    // Randomize difficulty
    const targetCount = 2 + Math.floor(Math.random() * 3); 

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
    generateCaptcha(1);
  }, []);

  const toggleItem = (id: number) => {
    if (isVerifying) return;
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setError(false);
  };

  const handleVerify = () => {
    const selectedItems = items.filter(item => selected.includes(item.id));
    const allTargets = items.filter(item => item.type === 'target');
    
    const correctSelected = selectedItems.filter(item => item.type === 'target').length;
    const incorrectSelected = selectedItems.filter(item => item.type === 'decoy').length;

    if (correctSelected === allTargets.length && incorrectSelected === 0 && selected.length > 0) {
      if (stage === 1) {
        setIsVerifying(true);
        // Fake heavy processing
        setTimeout(() => {
          setStage(2);
          generateCaptcha(2);
        }, 1000);
      } else {
        setIsVerifying(true);
        setTimeout(() => onVerify(true), 800);
      }
    } else {
      setError(true);
      setTimeout(() => {
        setStage(1);
        generateCaptcha(1);
      }, 1000);
    }
  };

  return (
    <div className={`bg-[#0f0f0f] border border-[#1f1f1f] rounded-md overflow-hidden shadow-2xl w-full select-none animate-in fade-in zoom-in duration-300 ${error ? 'animate-shake' : ''}`}>
      <div className="bg-[#b000ff] p-5 text-white relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        
        <div className="flex justify-between items-start mb-1 relative z-10">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">
            {stage === 1 ? 'Проверка безопасности' : 'Финальный этап'}
          </p>
          {isVerifying && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
        </div>
        <p className="text-[11px] uppercase tracking-wider mb-1 relative z-10">Выберите все квадраты, где есть</p>
        <h4 className="text-2xl font-brand font-black uppercase leading-none tracking-tight relative z-10">{targetCategory.name}</h4>
      </div>

      <div className="p-1 grid grid-cols-3 gap-1 bg-[#050505] relative">
         {/* Noise overlay for complexity */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}></div>
        
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`relative aspect-square cursor-pointer transition-all duration-200 overflow-hidden ${
              selected.includes(item.id) ? 'p-2' : 'p-0'
            }`}
          >
            <div className={`w-full h-full flex items-center justify-center border-2 transition-all ${
              selected.includes(item.id) 
                ? 'border-[#b000ff] bg-[#b000ff]/20' 
                : 'border-transparent bg-[#111] hover:bg-[#1a1a1a]'
            }`}>
              <img 
                src={item.iconPath} 
                alt="Minecraft Item" 
                className={`w-12 h-12 object-contain transition-transform duration-500 ${isVerifying ? 'scale-0' : 'scale-100'}`}
                style={{ imageRendering: 'pixelated' }}
                loading="eager"
              />
              {selected.includes(item.id) && !isVerifying && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-[#b000ff] rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
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
            onClick={() => { setStage(1); generateCaptcha(1); }} 
            className="text-gray-500 hover:text-white transition-colors p-2"
            disabled={isVerifying}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
        
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || selected.length === 0}
          className={`px-8 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all ${
            isVerifying 
              ? 'bg-gray-800 text-gray-500 cursor-wait' 
              : error 
                ? 'bg-red-600 text-white' 
                : 'bg-[#b000ff] text-white hover:brightness-110 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isVerifying ? 'Ждите...' : error ? 'Ошибка' : stage === 1 ? 'Далее' : 'Подтвердить'}
        </button>
      </div>
    </div>
  );
};
