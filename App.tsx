
import React, { useState, useEffect, useRef } from 'react';
import { InputOnly, TextAreaOnly } from './components/InputField.tsx';
import { SectionWrapper } from './components/SectionWrapper.tsx';
import { QuizField } from './components/QuizField.tsx';
import { ProgressBar } from './components/ProgressBar.tsx';
import { CustomModal } from './components/CustomModal.tsx';
import { GoogleCaptcha } from './components/GoogleCaptcha.tsx';
import { ParticleBackground } from './components/ParticleBackground.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { PunishmentSorter } from './components/PunishmentSorter.tsx';
import { AchievementToast } from './components/AchievementToast.tsx';
import { ServerStatus } from './components/ServerStatus.tsx';
import { SplashText } from './components/SplashText.tsx';
import { FormData } from './types.ts';
import { sendNotification } from './services/notificationService.ts';

// User provided SFX
const SFX = {
  click: 'https://www.myinstants.com/media/sounds/minecraft_click.mp3',
  success: 'https://www.myinstants.com/media/sounds/levelup_sVAqjan.mp3',
  error: 'https://www.myinstants.com/media/sounds/minecraft-villager-hurhh.mp3',
  enchant: 'https://www.myinstants.com/media/sounds/enchant.mp3'
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

  // New States
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Analytics State
  const startTimeRef = useRef<number>(Date.now());
  const quizStartTimeRef = useRef<number>(0);
  const [quizTimeElapsed, setQuizTimeElapsed] = useState(0);

  const totalSteps = 6;

  // Rate Limiting Check & Draft Loading
  useEffect(() => {
    // Check Rate Limit
    const lastSubmission = localStorage.getItem('nullx_last_submission');
    if (lastSubmission) {
      const hoursSince = (Date.now() - parseInt(lastSubmission)) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        setIsRateLimited(true);
      }
    }

    // Load Draft
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load draft");
      }
    }
  }, []);

  // Save Draft on Change
  useEffect(() => {
    if (view === 'form' && !isSubmitted) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, view, isSubmitted]);

  // Quiz Timer Logic
  useEffect(() => {
    let interval: number;
    // Quiz is step 4 and 5 now
    if (currentStep === 4 || currentStep === 5) {
      if (quizStartTimeRef.current === 0) quizStartTimeRef.current = Date.now();
      
      interval = window.setInterval(() => {
        setQuizTimeElapsed(Math.floor((Date.now() - quizStartTimeRef.current) / 1000));
      }, 1000);