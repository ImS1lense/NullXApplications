
import React, { useState, useEffect, useRef } from 'react';
import { InputOnly, TextAreaOnly } from './components/InputField.tsx';
import { SectionWrapper } from './components/SectionWrapper.tsx';
import { QuizField } from './components/QuizField.tsx';
import { ProgressBar } from './components/ProgressBar.tsx';
import { CustomModal } from './components/CustomModal.tsx';
import { GoogleCaptcha } from './components/GoogleCaptcha.tsx';
import { ParticleBackground } from './components/ParticleBackground.tsx';
import { PunishmentSorter } from './components/PunishmentSorter.tsx';
import { AchievementToast } from './components/AchievementToast.tsx';
import { ServerStatus } from './components/ServerStatus.tsx';
import { EndCredits } from './components/EndCredits.tsx';
import { ExplosionParticles } from './components/ExplosionParticles.tsx';
import { TotemPop } from './components/TotemPop.tsx';
import { FormData } from './types.ts';
import { sendNotification } from './services/notificationService.ts';

// User provided SFX
const SFX = {
  click: 'https://www.myinstants.com/media/sounds/minecraft_click.mp3',
  success: 'https://www.myinstants.com/media/sounds/minecraft_click.mp3', 
  error: 'https://www.myinstants.com/media/sounds/minecraft-damage-oof.mp3', // Damage sound
  enchant: 'https://www.myinstants.com/media/sounds/enchant.mp3',
  fuse: 'https://www.myinstants.com/media/sounds/creeper-hiss.mp3',
  explode: 'https://www.myinstants.com/media/sounds/explode1.mp3',
  elytra: 'https://www.myinstants.com/media/sounds/elytra-fly.mp3'
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => (
  <div className="bg-[#111] border border-[#1f1f1f] p-6 rounded-2xl hover:border-[#b000ff]/50 transition-all group">
    <div className="w-12 h-12 bg-[#b000ff]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#b000ff] transition-colors">
      <svg className="w-6 h-6 text-[#b000ff] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {icon}
      </svg>
    </div>
    <h3 className="text-white font-bold uppercase tracking-wider mb-2">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const initialFormState: FormData = {
  nickname: '',
  discord: '',
  age: '',
  about: '',
  timeOnProject: '',
  hoursDaily: '',
  activeTime: '',
  previousModExp: '',
  expectations: '',
  duties: '',
  teamLimit: '',
  betterPvpAllowed: '',
  multiAccountAllowed: '',
  recordCheckAllowed: 'no', 
  deanonPunishment: '',
  weaknessPunishment: '',
  insultModPunishment: '',
  mentionAllowedProjects: '',
  punishmentTestPassed: false,
  punishmentTestMistakes: 0,
};

const DRAFT_KEY = 'nullx_form_draft';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'form'>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaAttempts, setCaptchaAttempts] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);

  // Animation States
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isExploding, setIsExploding] = useState(false); // For shaking (fuse)
  const [hasExploded, setHasExploded] = useState(false); // For disintegration
  const [showTotem, setShowTotem] = useState(false);

  // Analytics State
  const startTimeRef = useRef<number>(Date.now());
  const quizStartTimeRef = useRef<number>(0);
  const [quizTimeElapsed, setQuizTimeElapsed] = useState(0);

  const totalSteps = 6;
  const QUIZ_TOTAL_QUESTIONS = 7; 

  // Rate Limiting Check & Draft Loading
  useEffect(() => {
    const lastSubmission = localStorage.getItem('nullx_last_submission');
    if (lastSubmission) {
      const now = Date.now();
      const diff = 24 * 60 * 60 * 1000 - (now - parseInt(lastSubmission));
      
      if (diff > 0) {
        setIsRateLimited(true);
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${h}ч ${m}мин`);
      }
    }

    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.nickname && parsed.nickname.length > 0) {
           setFormData(prev => ({ ...prev, ...parsed }));
           setShowTotem(true);
        }
      } catch (e) {
        console.error("Failed to load draft");
      }
    }
    
    if (view === 'landing') {
        const audio = new Audio(SFX.elytra);
        audio.volume = 0.2;
        audio.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (view === 'form' && !isSubmitted) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, view, isSubmitted]);

  useEffect(() => {
    let interval: number;
    if (currentStep === 4 || currentStep === 5) {
      if (quizStartTimeRef.current === 0) quizStartTimeRef.current = Date.now();
      
      interval = window.setInterval(() => {
        setQuizTimeElapsed(Math.floor((Date.now() - quizStartTimeRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  const playSfx = (type: keyof typeof SFX) => {
    const audio = new Audio(SFX[type]);
    audio.volume = 0.5; 
    audio.play().catch(() => {});
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleNumericInput = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  // Specific handler for Hours input to cap at 24
  const handleHoursInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val !== '') {
        let num = parseInt(val, 10);
        if (num > 24) {
             num = 24;
             val = '24';
             // Optional: Play a "limit reached" sound here if desired, otherwise standard typing sound
        }
    }
    setFormData(prev => ({ ...prev, hoursDaily: val }));
  };

  const handleActiveTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 8) val = val.substring(0, 8);
    
    let h1 = val.substring(0, 2);
    let m1 = val.substring(2, 4);
    let h2 = val.substring(4, 6);
    let m2 = val.substring(6, 8);

    if (h1.length === 2 && parseInt(h1) > 23) h1 = '23';
    if (m1.length === 2 && parseInt(m1) > 59) m1 = '59';
    if (h2.length === 2 && parseInt(h2) > 23) h2 = '23';
    if (m2.length === 2 && parseInt(m2) > 59) m2 = '59';

    let formatted = '';
    if (h1) formatted += h1;
    if (m1) formatted += ':' + m1;
    if (h2) formatted += '-' + h2;
    if (m2) formatted += ':' + m2;
    
    setFormData(prev => ({ ...prev, activeTime: formatted }));
  };

  const handleQuizChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        return formData.nickname.trim() !== '' && formData.discord.trim() !== '' && formData.age.trim() !== '';
      case 2:
        return (
          formData.timeOnProject.trim() !== '' && 
          formData.hoursDaily.trim() !== '' && 
          formData.activeTime.length === 11 && 
          formData.about.trim() !== ''
        );
      case 3: // Punishment Sorter
        return formData.punishmentTestPassed;
      case 4:
        return formData.weaknessPunishment !== '' && formData.mentionAllowedProjects !== '' && formData.insultModPunishment !== '';
      case 5:
        return (
          formData.teamLimit.length > 0 && 
          formData.betterPvpAllowed.length > 0 && 
          formData.multiAccountAllowed.length > 0
        );
      case 6:
        return (
          formData.expectations.trim() !== '' && 
          formData.duties.trim() !== '' && 
          formData.deanonPunishment !== '' &&
          isCaptchaVerified
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    playSfx('click');
    if (validateStep()) {
      playSfx('success');
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      playSfx('error');
      let errorMsg = "Пожалуйста, ответьте на все вопросы на текущем шаге.";
      if (currentStep === 2 && formData.activeTime.length < 11 && formData.activeTime.length > 0) {
        errorMsg = "Неверный формат времени. Используйте ЧЧ:ММ-ЧЧ:ММ";
      } else if (currentStep === 3) {
        errorMsg = "Вы должны полностью распределить все нарушения!";
      }
      setModal({ isOpen: true, title: "Внимание", message: errorMsg });
    }
  };

  const prevStep = () => {
    playSfx('click');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      playSfx('error');
      if (!isCaptchaVerified) {
         setModal({ isOpen: true, title: "Ошибка", message: "Пожалуйста, подтвердите, что вы не робот." });
      } else {
         setModal({ isOpen: true, title: "Ошибка", message: "Анкета заполнена не полностью." });
      }
      return;
    }

    setIsSubmitting(true);
    
    // Gather Analytics
    const analytics = {
      timeSpentSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
      captchaAttempts: captchaAttempts,
      userAgent: navigator.userAgent,
      quizTimeSeconds: quizTimeElapsed
    };

    const success = await sendNotification(formData, analytics);
    
    if (success) {
      playSfx('success');
      setShowAchievement(true);
      localStorage.setItem('nullx_last_submission', Date.now().toString()); // Set Rate Limit
      setIsRateLimited(true);
      localStorage.removeItem(DRAFT_KEY); // Clear Draft
      setIsSubmitted(true);
    } else {
      playSfx('error');
      setModal({ isOpen: true, title: "Сбой отправки", message: "Не удалось отправить заявку. Попробуйте еще раз." });
    }
    setIsSubmitting(false);
  };

  const handleReset = (withExplosion = false) => {
    if (withExplosion) {
      // Creeper Logic
      playSfx('fuse');
      setIsExploding(true); // Triggers shake animation
      
      setTimeout(() => {
        playSfx('explode');
        setIsExploding(false);
        setHasExploded(true); // Triggers visual disintegration and particles
        
        // Wait for visual disintegration to finish before resetting state
        setTimeout(() => {
          performReset();
          setHasExploded(false);
        }, 1000); 
      }, 1500); // Fuse time
    } else {
      playSfx('click');
      performReset();
    }
  };

  const performReset = () => {
    setFormData(initialFormState);
    setCurrentStep(1);
    setIsCaptchaVerified(false);
    setIsSubmitted(false);
    setCaptchaAttempts(0);
    setShowAchievement(false);
    startTimeRef.current = Date.now();
    quizStartTimeRef.current = 0;
    setQuizTimeElapsed(0);
    setView('landing');
    localStorage.removeItem(DRAFT_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#050505] relative overflow-hidden">
        <AchievementToast show={showAchievement} title="Application Sent!" description="Ваша заявка успешно отправлена" />
        <EndCredits onClose={() => handleReset(false)} username={formData.nickname || 'Player'} />
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-start py-10 px-4 overlay-animate-show overflow-hidden relative perspective-1000">
        <ParticleBackground />
        <ServerStatus />
        
        {/* Elytra Animation Container */}
        <div className="w-full flex flex-col items-center animate-elytra-land">
        
            {/* Gradients */}
            <div className="fixed top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#6200ea] opacity-[0.06] blur-[140px] pointer-events-none"></div>
            <div className="fixed bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#b000ff] opacity-[0.06] blur-[140px] pointer-events-none"></div>

            <div className="text-center max-w-4xl mb-20 px-4 z-10 flex flex-col items-center mt-20">
            <h1 className="text-7xl md:text-[110px] font-brand font-extrabold tracking-tighter leading-[0.9] mb-4 uppercase flex flex-col items-center text-white cursor-none relative">
                <span>Null<span className="text-[#b000ff] ml-3">X</span></span>
                <span className="text-3xl md:text-[40px] text-transparent bg-clip-text bg-gradient-to-r from-[#6200ea] to-[#b000ff] mt-4 font-bold tracking-[0.4em] border-b-2 border-[#b000ff]/30 pb-2">STAFF TEAM</span>
            </h1>
            
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10 opacity-80 mt-8">
                Мы ищем амбициозных игроков, готовых следить за порядком и помогать сообществу NullX расти. Твой путь в команду начинается здесь.
            </p>
            
            {isRateLimited ? (
                <button 
                disabled
                className="group relative inline-flex items-center justify-center px-20 py-7 bg-gray-800 border border-red-900/50 rounded-2xl text-gray-400 font-bold uppercase tracking-[0.2em] text-lg md:text-xl cursor-not-allowed opacity-70"
                >
                <span className="mr-3">🔒</span> {timeRemaining}
                </button>
            ) : (
                <button 
                onClick={() => { playSfx('click'); setView('form'); }}
                className="group relative inline-flex items-center justify-center px-20 py-7 bg-gradient-to-r from-[#6200ea] to-[#b000ff] rounded-2xl text-white font-bold uppercase tracking-[0.2em] text-lg md:text-xl transition-all active:scale-95 shadow-[0_20px_60px_rgba(176,0,255,0.4)] hover:shadow-[0_25px_80px_rgba(176,0,255,0.6)] cursor-pointer"
                >
                Подать заявку
                </button>
            )}
            </div>

            <div className="flex flex-wrap justify-center gap-12 md:gap-32 mb-24 max-w-5xl opacity-80 z-10">
            <div className="text-center group">
                <h3 className="text-4xl font-brand font-extrabold text-white mb-2 group-hover:text-[#b000ff] transition-colors">7</h3>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Модераторов</p>
            </div>
            <div className="text-center group">
                <h3 className="text-4xl font-brand font-extrabold text-white mb-2 group-hover:text-[#b000ff] transition-colors">24/7</h3>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Активность</p>
            </div>
            <div className="text-center group">
                <h3 className="text-4xl font-brand font-extrabold text-white mb-2 group-hover:text-[#b000ff] transition-colors">1k+</h3>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Игроков</p>
            </div>
            </div>

            <div className="w-full max-w-6xl mb-20 z-10">
                <div className="text-center mb-16">
                <h2 className="text-4xl font-brand font-extrabold uppercase mb-4 tracking-tight text-white">О работе персонала</h2>
                <p className="text-gray-500 tracking-wider text-sm font-medium">Мы — команда профессионалов, которая ежедневно делает сервер лучше</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FeatureCard 
                    icon={<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                    title="Быстрые ответы"
                    desc="Отвечаем на обращения в кратчайшие сроки и помогаем новичкам освоиться."
                />
                <FeatureCard 
                    icon={<path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                    title="Опытная команда"
                    desc="Квалифицированные специалисты с глубоким знанием правил и механик проекта."
                />
                <FeatureCard 
                    icon={<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    title="Помощь 24/7"
                    desc="Работаем круглосуточно для вашего комфорта и стабильности игрового мира."
                />
                <FeatureCard 
                    icon={<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                    title="Справедливость"
                    desc="Объективный подход к каждой ситуации и строгое соблюдение регламента сервера."
                />
                </div>
            </div>
        </div>
        
        <style>{`
          .perspective-1000 {
             perspective: 1000px;
          }
          @keyframes elytraLand {
             0% { opacity: 0; transform: translateY(-500px) rotateX(45deg) scale(1.5); }
             100% { opacity: 1; transform: translateY(0) rotateX(0) scale(1); }
          }
          .animate-elytra-land {
             animation: elytraLand 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 md:px-6 relative overflow-hidden flex flex-col items-center bg-[#050505] overlay-animate-show transition-all duration-100 ${isExploding ? 'animate-[shake_0.5s_ease-in-out_infinite] bg-red-900/10' : ''}`}>
      <TotemPop show={showTotem} onComplete={() => setShowTotem(false)} />
      <CustomModal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} />
      
      {/* Backgrounds */}
      <ParticleBackground />
      {hasExploded && <ExplosionParticles />}
      
      <div className="fixed top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#6200ea] opacity-[0.03] blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#b000ff] opacity-[0.03] blur-[140px] pointer-events-none"></div>

      {/* Main Content Container with Disintegration Effect */}
      <div className={`max-w-2xl w-full relative z-10 transition-all duration-700 ${hasExploded ? 'opacity-0 scale-75 rotate-3 blur-sm brightness-50' : 'opacity-100 scale-100'}`}>
        <header className="text-center mb-10 animate-float flex flex-col items-center relative">
          
          <div className="w-full flex justify-between items-center mb-6">
             <button 
                onClick={() => { 
                    playSfx('click'); 
                    // Trigger Totem visual if saving draft/going back
                    if (formData.nickname.length > 0) setShowTotem(true); 
                    setView('landing'); 
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group cursor-pointer"
             >
                <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-widest">Назад</span>
             </button>

             {/* Creeper Reset Button */}
             <button
                type="button"
                onClick={() => handleReset(true)}
                title="Очистить форму"
                className={`group/reset relative p-2 rounded-full transition-all duration-200 cursor-pointer ${isExploding ? 'bg-white text-black scale-110' : 'hover:bg-red-900/30'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isExploding ? 'text-black' : 'text-gray-500 group-hover/reset:text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {/* Creeper face hint on hover */}
                {!isExploding && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/reset:opacity-100 transition-opacity text-[10px] text-green-500 font-bold whitespace-nowrap">
                    Tnt?
                    </div>
                )}
             </button>
          </div>

          <h1 className="text-6xl md:text-7xl font-brand font-extrabold tracking-tighter mb-2 select-none uppercase text-white cursor-none">
            Null<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200ea] to-[#b000ff] ml-3">X</span>
          </h1>
          <div className="flex items-center justify-center gap-3 opacity-60">
             <span className="h-[1px] w-12 bg-gray-600"></span>
             <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] font-bold">Staff Recruitment</p>
             <span className="h-[1px] w-12 bg-gray-600"></span>
          </div>
        </header>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {/* Quiz Timer Display */}
        {(currentStep === 4 || currentStep === 5) && (
          <div className="fixed top-4 right-4 md:absolute md:top-0 md:right-[-80px] z-50 animate-in fade-in duration-500">
            <div className="bg-[#0a0a0a] border border-[#b000ff]/30 rounded-lg p-3 text-center shadow-lg">
              <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Таймер</div>
              <div className="text-xl font-brand font-bold text-white tabular-nums">
                {Math.floor(quizTimeElapsed / 60).toString().padStart(2, '0')}:{(quizTimeElapsed % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="transition-opacity duration-1000">
          
          {currentStep === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <SectionWrapper title="Профиль" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Никнейм в Minecraft</label>
                    <InputOnly 
                      placeholder="Ваш ник..." 
                      value={formData.nickname} 
                      onChange={handleInputChange('nickname')} 
                      required 
                      showSkinPreview={true}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Discord</label>
                    <InputOnly placeholder="user_tag" value={formData.discord} onChange={handleInputChange('discord')} required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Возраст (Цифры)</label>
                    <InputOnly placeholder="17" type="text" value={formData.age} onChange={handleNumericInput('age')} required />
                  </div>
                </div>
              </SectionWrapper>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <SectionWrapper title="Активность" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Как давно вы с нами?</label>
                    <InputOnly placeholder="Напр: полгода" value={formData.timeOnProject} onChange={handleInputChange('timeOnProject')} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Активность на сервере (часы)</label>
                      <InputOnly placeholder="8" type="text" value={formData.hoursDaily} onChange={handleHoursInput} required max="24" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Время активности</label>
                      <InputOnly placeholder="22:00-00:30" type="text" value={formData.activeTime} onChange={handleActiveTimeInput} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Расскажите о себе</label>
                    <TextAreaOnly 
                      placeholder="Ваши увлечения, черты характера..." 
                      value={formData.about} 
                      onChange={handleInputChange('about')} 
                      required 
                      maxLength={500} 
                      preventPaste={true} 
                    />
                  </div>
                </div>
              </SectionWrapper>
            </div>
          )}

          {currentStep === 3 && (
             <div className="animate-in slide-in-from-right-8 duration-500">
               <SectionWrapper title="Проверка Знаний" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}>
                 <PunishmentSorter 
                   playSfx={playSfx}
                   onPass={(mistakes) => setFormData(prev => ({ 
                      ...prev, 
                      punishmentTestPassed: true, 
                      punishmentTestMistakes: mistakes 
                    }))}
                 />
               </SectionWrapper>
             </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">
              <QuizField 
                questionNumber={1}
                totalQuestions={QUIZ_TOTAL_QUESTIONS}
                question="Какое наказание за фразы 'ez', 'bezdar', 'slabak'?"
                selectedValue={formData.weaknessPunishment}
                onChange={handleQuizChange('weaknessPunishment')}
                options={[
                  { label: 'MUTE до 30 минут', value: 'mute_30' },
                  { label: 'Без наказания (это исключение)', value: 'no_punish' },
                  { label: 'BAN на 1 час', value: 'ban_1h' }
                ]}
              />
              <QuizField 
                questionNumber={2}
                totalQuestions={QUIZ_TOTAL_QUESTIONS}
                question="Разрешено ли рекламировать FunTime или HolyWorld?"
                selectedValue={formData.mentionAllowedProjects}
                onChange={handleQuizChange('mentionAllowedProjects')}
                options={[
                  { label: 'Да, эти проекты являются исключением', value: 'yes' },
                  { label: 'Нет, это карается PERMBAN', value: 'no' }
                ]}
              />
              <QuizField 
                questionNumber={3}
                totalQuestions={QUIZ_TOTAL_QUESTIONS}
                question="Наказание за прямое оскорбление модерации?"
                selectedValue={formData.insultModPunishment}
                onChange={handleQuizChange('insultModPunishment')}
                options={[
                  { label: 'MUTE до 1 дня', value: 'mute_1d' },
                  { label: 'MUTE 20 минут', value: 'mute_20' },
                  { label: 'WARN и предупреждение', value: 'warn' }
                ]}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">
               <QuizField 
                questionNumber={4}
                totalQuestions={QUIZ_TOTAL_QUESTIONS}
                question="Максимальное кол-во человек в команде?"
                selectedValue={formData.teamLimit}
                onChange={handleQuizChange('teamLimit')}
                options={[
                  { label: '3 человека', value: '3' },
                  { label: '5 человек', value: '5' },
                  { label: 'Лимита нет', value: 'none' }
                ]}
              />
              <QuizField 
                questionNumber={5}
                totalQuestions={QUIZ_TOTAL_QUESTIONS}
                question="Разрешено ли использование мода BetterPvP?"
                selectedValue={formData.betterPvpAllowed}
                onChange={handleQuizChange('betterPvpAllowed')}
                options={[
                  { label: 'Разрешен', value: 'yes' },
                  { label: 'Запрещен (BAN до 30 дней)', value: 'no' }
                ]}
              />
              <QuizField 
                questionNumber={6}
                totalQuestions={QUIZ_TOTAL_QUESTIONS}
                question="Разрешено ли иметь мультиаккаунт на разных ТГ?"
                selectedValue={formData.multiAccountAllowed}
                onChange={handleQuizChange('multiAccountAllowed')}
                options={[
                  { label: 'Да, разрешено', value: 'yes' },
                  { label: 'Нет, BAN на 30 дней', value: 'no' }
                ]}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">
              <SectionWrapper title="Завершение">
                <div className="space-y-6">
                   <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Опыт модерации</label>
                    <TextAreaOnly placeholder="Где вы работали ранее?" value={formData.previousModExp} onChange={handleInputChange('previousModExp')} required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Почему именно вы?</label>
                    <TextAreaOnly placeholder="Цели и ожидания..." value={formData.expectations} onChange={handleInputChange('expectations')} required />
                  </div>
                   <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Обязанности</label>
                    <TextAreaOnly placeholder="Что должен делать стажёр?" value={formData.duties} onChange={handleInputChange('duties')} required />
                  </div>
                </div>
              </SectionWrapper>
              
              <QuizField 
                questionNumber={7}
                totalQuestions={QUIZ_TOTAL_QUESTIONS}
                question="Наказание за деанон других игроков?"
                selectedValue={formData.deanonPunishment}
                onChange={handleQuizChange('deanonPunishment')}
                options={[
                  { label: 'BAN на 7 дней', value: 'ban_7' },
                  { label: 'PERMBAN', value: 'permban' },
                  { label: 'WARN', value: 'warn' }
                ]}
              />

              <div className="mt-8 flex flex-col items-center gap-4">
                <GoogleCaptcha onVerify={(val) => {
                  setIsCaptchaVerified(val);
                  setCaptchaAttempts(prev => prev + 1);
                }} />
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-10">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-4 bg-[#111] border border-[#1f1f1f] rounded-xl text-gray-400 font-extrabold uppercase tracking-widest text-[10px] hover:bg-[#1a1a1a] hover:text-white transition-all active:scale-95 shadow-lg cursor-pointer"
              >
                Назад
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-[2] py-4 bg-gradient-to-r from-[#6200ea] to-[#b000ff] rounded-xl text-white font-extrabold uppercase tracking-widest text-[10px] hover:brightness-110 shadow-[0_10px_30px_rgba(176,0,255,0.3)] transition-all active:scale-95 cursor-pointer"
              >
                Далее
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isCaptchaVerified}
                className={`flex-[2] py-4 rounded-xl text-white font-extrabold uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg cursor-pointer ${
                  isSubmitting || !isCaptchaVerified 
                  ? 'bg-gray-800 opacity-50 cursor-not-allowed border border-gray-700' 
                  : 'bg-gradient-to-r from-[#6200ea] to-[#b000ff] hover:brightness-110 shadow-[0_0_30px_rgba(176,0,255,0.45)]'
                }`}
              >
                {isSubmitting ? 'Загрузка...' : 'Подать заявку'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
