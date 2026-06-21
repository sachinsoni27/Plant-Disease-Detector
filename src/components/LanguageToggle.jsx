import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className="flex p-1 bg-slate-200/50 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-300/50 dark:border-slate-700/50 relative overflow-hidden shadow-sm h-9 w-[160px] transition-colors duration-500"
    >
      {/* Sliding Background - Using X transform for stability */}
      <motion.div
        animate={{ 
          x: language === 'en' ? 0 : 76
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute top-1 left-1 bottom-1 w-[76px] green-gradient rounded-lg shadow-md shadow-emerald-500/20 z-0"
      />
      
      <button
        onClick={() => setLanguage('en')}
        className={`relative z-10 w-[76px] flex items-center justify-center gap-2 text-[11px] font-black transition-colors duration-300 ${
          language === 'en'
            ? 'text-white'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <Languages size={14} />
        <span>EN</span>
      </button>

      <button
        onClick={() => setLanguage('hi')}
        className={`relative z-10 w-[76px] flex items-center justify-center gap-2 text-[11px] font-black transition-colors duration-300 ${
          language === 'hi'
            ? 'text-white'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        <Languages size={14} />
        <span className="font-serif text-sm">हि</span>
      </button>
    </div>
  );
};

export default LanguageToggle;
