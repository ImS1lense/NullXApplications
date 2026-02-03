
import React, { useState, useEffect } from 'react';

interface Violation {
  id: number;
  text: string;
  correctCategory: 'mute' | 'ban' | 'warn';
}

interface PunishmentSorterProps {
  onPass: () => void;
  playSfx: (type: 'click' | 'success' | 'error') => void;
}

const VIOLATIONS: Violation[] = [
  { id: 1, text: 'Спам в чате', correctCategory: 'mute' },
  { id: 2, text: 'Читы (KillAura)', correctCategory: 'ban' },
  { id: 3, text: 'Реклама стороннего сервера', correctCategory: 'ban' },
  { id: 4, text: 'Оскорбление родных', correctCategory: 'ban' },
  { id: 5, text: 'Капс (Caps Lock)', correctCategory: 'mute' },
];

export const PunishmentSorter: React.FC<PunishmentSorterProps> = ({ onPass, playSfx }) => {
  const [items, setItems] = useState<Violation[]>(VIOLATIONS);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle on mount
  useEffect(() => {
    setItems([...VIOLATIONS].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (completedItems.length === VIOLATIONS.length && !isComplete) {
      setIsComplete(true);
      playSfx('success');
      onPass();
    }
  }, [completedItems, isComplete, onPass, playSfx]);

  const handleItemClick = (id: number) => {
    if (completedItems.includes(id)) return;
    playSfx('click');
    setSelectedItemId(id === selectedItemId ? null : id);
  };

  const handleCategoryClick = (category: 'mute' | 'ban' | 'warn') => {
    if (selectedItemId === null) return;

    const item = items.find(i => i.id === selectedItemId);
    if (!item) return;

    if (item.correctCategory === category) {
      playSfx('success');
      setCompletedItems(prev => [...prev, item.id]);
      setSelectedItemId(null);
    } else {
      playSfx('error');
      setMistakes(prev => prev + 1);
      
      // Visual shake effect
      const zone = document.getElementById(`zone-${category}`);
      zone?.classList.add('animate-shake');
      setTimeout(() => zone?.classList.remove('animate-shake'), 500);

      // Deselect immediately (Reset selection)
      setSelectedItemId(null);
    }
  };

  if (isComplete) {
    return (
      <div className="bg-[#0a0a0a] border border-green-500/30 rounded-2xl p-8 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
           <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
           </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 uppercase">Тест пройден!</h3>
        <p className="text-gray-400">Вы отлично разбираетесь в правилах.</p>
        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-600">
           Ошибок: {mistakes}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-white mb-2">Распределите нарушения</h3>
        <p className="text-gray-400 text-xs uppercase tracking-widest">
           Выберите нарушение, затем нажмите на правильное наказание
        </p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8 min-h-[120px]">
        {items.map(item => {
          if (completedItems.includes(item.id)) return null;
          const isSelected = selectedItemId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 transform active:scale-95 flex items-center justify-center text-center text-sm font-medium ${
                isSelected 
                  ? 'bg-[#b000ff] border-[#b000ff] text-white shadow-[0_0_20px_rgba(176,0,255,0.5)] scale-105 z-10' 
                  : 'bg-[#111] border-[#1f1f1f] text-gray-300 hover:border-gray-500'
              }`}
            >
              {item.text}
            </div>
          );
        })}
        {completedItems.length === items.length && (
           <div className="col-span-full text-center text-gray-500 py-4 italic">Все распределено!</div>
        )}
      </div>

      {/* Categories (Drop Zones) */}
      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          id="zone-mute"
          onClick={() => handleCategoryClick('mute')}
          className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
            selectedItemId !== null 
              ? 'border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20 cursor-pointer animate-pulse' 
              : 'border-[#1f1f1f] bg-[#0a0a0a] text-gray-600'
          }`}
        >
          <svg className={`w-8 h-8 mb-2 ${selectedItemId !== null ? 'text-yellow-500' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
          <span className={`font-black uppercase tracking-widest text-xs ${selectedItemId !== null ? 'text-yellow-500' : ''}`}>MUTE</span>
        </button>

        <button
          type="button"
          id="zone-ban"
          onClick={() => handleCategoryClick('ban')}
          className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
            selectedItemId !== null 
              ? 'border-red-600/50 bg-red-600/10 hover:bg-red-600/20 cursor-pointer animate-pulse' 
              : 'border-[#1f1f1f] bg-[#0a0a0a] text-gray-600'
          }`}
        >
          <svg className={`w-8 h-8 mb-2 ${selectedItemId !== null ? 'text-red-600' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <span className={`font-black uppercase tracking-widest text-xs ${selectedItemId !== null ? 'text-red-600' : ''}`}>BAN</span>
        </button>

        <button
          type="button"
          id="zone-warn"
          onClick={() => handleCategoryClick('warn')}
          className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
            selectedItemId !== null 
              ? 'border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 cursor-pointer animate-pulse' 
              : 'border-[#1f1f1f] bg-[#0a0a0a] text-gray-600'
          }`}
        >
           <svg className={`w-8 h-8 mb-2 ${selectedItemId !== null ? 'text-orange-500' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className={`font-black uppercase tracking-widest text-xs ${selectedItemId !== null ? 'text-orange-500' : ''}`}>WARN</span>
        </button>
      </div>
    </div>
  );
};
