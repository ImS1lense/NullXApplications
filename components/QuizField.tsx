
import React from 'react';

interface QuizOption {
  label: string;
  value: string;
}

interface QuizFieldProps {
  question: string;
  options: QuizOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

export const QuizField: React.FC<QuizFieldProps> = ({ question, options, selectedValue, onChange, required, questionNumber, totalQuestions }) => {
  const isAnswered = selectedValue !== '';

  return (
    <div className={`bg-[#0a0a0a] border rounded-2xl p-6 mb-6 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
      !isAnswered ? 'border-[#1f1f1f]' : 'border-[#b000ff]/30'
    }`}>
      <div className="flex flex-col gap-2 mb-5">
        {questionNumber && totalQuestions && (
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#b000ff]">
             Вопрос {questionNumber} из {totalQuestions}
          </div>
        )}
        <h3 className="text-white text-base md:text-lg font-bold leading-tight tracking-tight">
          {question} {required && <span className="text-[#b000ff]">*</span>}
        </h3>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          
          let borderColor = isSelected ? 'border-[#b000ff]/50' : 'border-[#1f1f1f]';
          let bgColor = isSelected ? 'bg-[#b000ff]/5' : 'bg-transparent';

          return (
            <label 
              key={option.value} 
              className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 group ${borderColor} ${bgColor} hover:border-[#333]`}
              onClick={() => onChange(option.value)}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name={question}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => {}}
                  className={`peer appearance-none w-5 h-5 border-2 rounded-full transition-all duration-200 ${
                    isSelected ? 'border-[#b000ff]' : 'border-[#333]'
                  }`}
                />
                <div className={`absolute w-2.5 h-2.5 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 bg-[#b000ff] shadow-[0_0_8px_#b000ff]`}></div>
              </div>
              <span className={`ml-3 text-sm transition-colors ${
                isSelected ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'
              }`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
