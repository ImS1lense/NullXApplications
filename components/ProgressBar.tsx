
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate percentage for width
  // We use (currentStep - 1) to start at 0% and end at almost 100% before submission
  const percentage = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 select-none relative group">
      {/* Level Number */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#80ff20] font-brand font-bold text-xl drop-shadow-[2px_2px_0_#000]">
        {currentStep === totalSteps ? 'MAX' : currentStep}
      </div>

      {/* Bar Container */}
      <div className="h-4 w-full bg-[#1a1a1a] border-[2px] border-[#000] relative overflow-hidden">
        {/* Border outline effect (lighter grey inside) */}
        <div className="absolute inset-0 border-t-2 border-[#3d3d3d] border-b-2 border-[#5e5e5e] opacity-50 pointer-events-none"></div>

        {/* The Green Fill */}
        <div 
          className="h-full bg-[#80ff20] transition-all duration-700 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Top highlight on the green bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#b7ff73] opacity-60"></div>
          {/* Bottom shadow on the green bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36680e] opacity-60"></div>
        </div>

        {/* The Separators (Vertical lines) */}
        {/* We use a repeating gradient to simulate the dividers every ~20px */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 18px, #000 18px, #000 20px)`
          }}
        ></div>
      </div>
      
      {/* Experience Orbs Particles (Visual flair) */}
      <div className="absolute -right-2 -top-2 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <div className="w-2 h-2 rounded-full bg-[#80ff20] shadow-[0_0_10px_#80ff20]"></div>
      </div>
    </div>
  );
};
