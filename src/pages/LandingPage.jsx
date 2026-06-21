import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Lock, ArrowRight, ShieldCheck, Zap, Globe, Code } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import LiveIcon from '../components/LiveIcon';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans selection:bg-emerald-200 selection:text-emerald-900 relative transition-colors duration-500">
      {/* Interaction Block & Suble Dimming Overlay (when modal open) */}
      <div className={`fixed inset-0 z-30 pointer-events-none transition-all duration-700 ${isAuthModalOpen ? 'bg-slate-900/10' : ''}`}></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 font-sans">
        <div className={`max-w-7xl mx-auto flex items-center justify-between glass px-6 py-4 rounded-3xl border-white/50 shadow-2xl shadow-emerald-900/5 transition-all duration-500 ${isAuthModalOpen ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 green-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-400/30">
              <LiveIcon icon={Sprout} type="float" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-800 dark:text-white">Plant<span className="text-emerald-600">AI</span></span>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <LanguageToggle />
            <ThemeToggle />
            <button 
              onClick={openLogin}
              className="text-slate-600 dark:text-slate-300 font-bold px-5 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              {t('login')}
            </button>
            <button 
              onClick={openSignup}
              className="green-gradient text-white font-black px-6 py-2.5 rounded-2xl shadow-lg shadow-emerald-400/20 hover:shadow-emerald-400/40 hover:-translate-y-0.5 transition-all text-sm sm:text-base"
            >
              {t('signIn')}
            </button>
          </div>
        </div>
      </nav>

      <main className={`relative pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center transition-all duration-700 ${isAuthModalOpen ? 'blur-xl scale-95 opacity-50' : ''}`}>
        {/* Hero Background Decorative Elements */}
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[150px] -z-10"></div>

        {/* Mockup Content */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <div className="max-w-6xl mx-auto h-full flex items-center justify-center px-6">
            <div className="w-full aspect-video glass-card rounded-[3rem] p-12 scale-110 opacity-20">
              <div className="grid grid-cols-12 gap-8 h-full">
                <div className="col-span-3 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-slate-200/50 rounded-2xl w-full"></div>)}
                </div>
                <div className="col-span-9 space-y-8">
                  <div className="h-20 bg-slate-200/50 rounded-3xl w-2/3"></div>
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-200/50 rounded-3xl"></div>)}
                  </div>
                  <div className="h-64 bg-slate-200/50 rounded-3xl w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-emerald-100/50 dark:border-emerald-500/20 shadow-sm transition-colors duration-500">
              <Zap size={14} className="animate-pulse" />
              {t('nextGenCrop')}
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-8 transition-colors duration-500">
              {t('heroTitle1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{t('heroTitle2')}</span>
            </h1>

            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed transition-colors duration-500">
              {t('heroDesc')}
            </p>

            <button 
              onClick={openLogin}
              className="group relative inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black px-10 py-5 rounded-2xl shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
            >
              {t('startFreeAnalysis')}
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>



          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-8 opacity-80 dark:opacity-70 transition-all duration-500"
          >
             <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-white"><Globe size={24}/> {t('agritech')}</div>
             <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-white"><ShieldCheck size={24}/> {t('biosave')}</div>
             <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-white"><Globe size={24}/> {t('natureglo')}</div>
             <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-white"><Code size={24}/> {t('openagro')}</div>
          </motion.div>
        </div>
      </main>

      {/* Auth Modal Portal */}
      <AuthModal 
        key={`${isAuthModalOpen}-${authMode}`}
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />


    </div>
  );
}
