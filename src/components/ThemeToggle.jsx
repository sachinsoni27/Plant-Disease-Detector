import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 glass rounded-full p-1 flex items-center cursor-pointer transition-colors duration-500 overflow-hidden group"
      aria-label="Toggle Theme"
    >
      <motion.div
        className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />
      
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="z-10 w-6 h-6 bg-white dark:bg-emerald-500 rounded-full shadow-lg flex items-center justify-center text-slate-800 dark:text-white"
        style={{ x: theme === 'dark' ? 24 : 0 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ y: 10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={14} fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 10, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={14} fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background visual indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-slate-400 pointer-events-none opacity-40">
        <Sun size={12} />
        <Moon size={12} />
      </div>
    </button>
  );
}
