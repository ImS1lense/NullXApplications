
import React, { useState } from 'react';

// Standard UI Sounds
const CLICK_SOUND = 'https://www.myinstants.com/media/sounds/minecraft_click.mp3';
const ERROR_SOUND = 'https://www.myinstants.com/media/sounds/classic_hurt-1.mp3'; // Oof sound for error

const playSound = (url: string, volume = 0.3) => {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
};

interface InputBaseProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  type?: string;
  min?: string;
  max?: string;
  maxLength?: number;
  preventPaste?: boolean;
  showSkinPreview?: boolean; 
}

export const InputOnly: React.FC<InputBaseProps> = ({ placeholder, value, onChange, required, type = "text", min, max, maxLength, showSkinPreview }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > value.length) {
      // Standard typing click
      const audio = new Audio(CLICK_SOUND);
      audio.volume = 0.1;
      audio.playbackRate = 1.2 + Math.random() * 0.3; 
      audio.play().catch(() => {});
    }
    onChange(e);
    setIsValid(null); // Reset validation state on type
  };

  const handleBlur = () => {
      let valid = true;
      if (required && value.trim().length === 0) valid = false;

      if (valid && value.length > 0) {
          // Silent success or just visual change
          setIsValid(true);
      } else if (!valid) {
          playSound(ERROR_SOUND, 0.2);
          setIsValid(false);
      }
  };

  return (
    <div className="relative w-full group">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        maxLength={maxLength}
        className={`w-full bg-[#111] border rounded-lg py-3 px-4 text-white focus:outline-none transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-600 ${showSkinPreview ? 'pl-16' : ''} ${
            isValid === false 
            ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-shake' 
            : isValid === true 
                ? 'border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                : 'border-[#1f1f1f] focus:border-[#b000ff] glow-purple'
        }`}
        required={required}
      />
      
      {showSkinPreview && value.trim().length > 0 && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md overflow-hidden border border-[#333] animate-in zoom-in duration-300">
          <img 
            src={`https://minotar.net/helm/${value}/100.png`} 
            alt="Skin" 
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
          />
        </div>
      )}
    </div>
  );
};

export const TextAreaOnly: React.FC<InputBaseProps> = ({ placeholder, value, onChange, required, maxLength, preventPaste }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > value.length) {
       const audio = new Audio(CLICK_SOUND);
       audio.volume = 0.1;
       audio.playbackRate = 1.2 + Math.random() * 0.3;
       audio.play().catch(() => {});
    }
    onChange(e);
    setIsValid(null);
  };

  const handleBlur = () => {
    let valid = true;
    if (required && value.trim().length < 10) valid = false;

    if (valid) {
        setIsValid(true);
    } else {
        playSound(ERROR_SOUND, 0.2);
        setIsValid(false);
    }
  };

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={4}
        maxLength={maxLength}
        onPaste={(e) => {
          if (preventPaste) {
            e.preventDefault();
          }
        }}
        className={`w-full bg-[#111] border rounded-lg py-3 px-4 text-white focus:outline-none transition-all duration-300 resize-none placeholder-gray-600 ${
            isValid === false 
            ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-shake' 
            : isValid === true 
                ? 'border-green-500/50' 
                : 'border-[#1f1f1f] focus:border-[#b000ff] glow-purple'
        }`}
        required={required}
      />
      <div className="flex justify-between items-start mt-1">
        <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
          {preventPaste && "⚠️ Вставка текста запрещена"}
          {isValid === false && <span className="text-red-500 ml-2">Слишком коротко!</span>}
        </div>
        {maxLength && (
          <div className={`text-right text-[10px] font-bold tracking-widest transition-colors ${value.length >= maxLength ? 'text-[#b000ff]' : 'text-gray-600'}`}>
            {value.length} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};
