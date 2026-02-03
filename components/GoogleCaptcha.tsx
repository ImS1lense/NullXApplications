
import React, { useState, useEffect } from 'react';
import { VisualCaptcha } from './VisualCaptcha.tsx';

interface GoogleCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export const GoogleCaptcha: React.FC<GoogleCaptchaProps> = ({ onVerify }) => {
  const [status, setStatus] = useState<'idle' | 'challenging' | 'verified'>('idle');

  const handleCheckboxClick = () => {
    if (status === 'idle') {
      setStatus('challenging');
    }
  };

  const handleVerified = (isValid: boolean) => {
    if (isValid) {
      setStatus('verified');
      onVerify(true);
    } else {
      setStatus('idle');
      onVerify(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div 
        onClick={handleCheckboxClick}
        className={`flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-md shadow-xl cursor-pointer transition-all duration-300 w-full max-w-[300px] hover:border-[#b000ff]/50 ${status === 'verified' ? 'border-green-500/50' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div className={`relative flex items-center justify-center w-7 h-7 rounded border-2 transition-all duration-300 ${
            status === 'idle' ? 'border-gray-600 bg-[#111]' : 
            status === 'challenging' ? 'border-[#b000ff] bg-[#111]' : 
            'border-green-500 bg-green-500'
          }`}>
            {status === 'challenging' && (
              <div className="w-4 h-4 border-2 border-[#b000ff] border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === 'verified' && (
              <svg className="w-5 h-5 text-white animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest select-none">
            Я не робот
          </span>
        </div>
        
        <div className="flex flex-col items-center opacity-40">
          <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span className="text-[6px] font-bold uppercase tracking-tighter mt-1">reCAPTCHA</span>
        </div>
      </div>

      {status === 'challenging' && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overlay-animate-show">
          <div className="modal-animate-show w-full max-w-[360px]">
            <VisualCaptcha onVerify={handleVerified} />
          </div>
        </div>
      )}
    </div>
  );
};
