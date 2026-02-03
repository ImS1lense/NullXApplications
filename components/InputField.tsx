
import React from 'react';

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
  showSkinPreview?: boolean; // New prop for nickname field
}

export const InputOnly: React.FC<InputBaseProps> = ({ placeholder, value, onChange, required, type = "text", min, max, maxLength, showSkinPreview }) => (
  <div className="relative w-full">
    <input
      type={type}
      value={value}
      onChange={onChange as any}
      placeholder={placeholder}
      min={min}
      max={max}
      maxLength={maxLength}
      className={`w-full bg-[#111] border border-[#1f1f1f] rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#b000ff] glow-purple transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-600 ${showSkinPreview ? 'pl-16' : ''}`}
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

export const TextAreaOnly: React.FC<InputBaseProps> = ({ placeholder, value, onChange, required, maxLength, preventPaste }) => (
  <div className="w-full">
    <textarea
      value={value}
      onChange={onChange as any}
      placeholder={placeholder}
      rows={4}
      maxLength={maxLength}
      onPaste={(e) => {
        if (preventPaste) {
          e.preventDefault();
          // Optional: You could trigger a toast/alert here, but blocking silently is often enough
        }
      }}
      className="w-full bg-[#111] border border-[#1f1f1f] rounded-lg py-3 px-4 text-white focus:outline-none focus:border-[#b000ff] glow-purple transition-all duration-300 resize-none placeholder-gray-600"
      required={required}
    />
    <div className="flex justify-between items-start mt-1">
      <div className="text-[9px] text-gray-600 uppercase tracking-wider font-bold">
        {preventPaste && "⚠️ Вставка текста запрещена"}
      </div>
      {maxLength && (
        <div className={`text-right text-[10px] font-bold tracking-widest transition-colors ${value.length >= maxLength ? 'text-[#b000ff]' : 'text-gray-600'}`}>
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  </div>
);
