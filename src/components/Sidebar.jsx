import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LiveIcon from './LiveIcon';
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  User, 
  LogOut, 
  Sprout, 
  Menu, 
  X,
  Landmark
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: t('dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('uploadAnalysis'), href: '/analysis', icon: Upload },
    { name: t('history'), href: '/history', icon: History },
    { name: t('govtSchemes'), href: '/schemes', icon: Landmark, isNew: true },
    { name: t('profile'), href: '/profile', icon: User },
  ];

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-800 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0) }}
        className={`fixed left-0 top-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-45 flex flex-col transition-all duration-500 ${
          isOpen ? 'shadow-2xl' : ''
        } lg:translate-x-0`}
      >
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 green-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-400/30">
            <LiveIcon icon={Sprout} type="float" size={26} />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-800 dark:text-white transition-colors duration-500">Plant<span className="text-emerald-600">AI</span></span>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-5 py-4 rounded-[1.25rem] font-black transition-all duration-300 group ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.15)] border border-emerald-500/20' 
                    : 'text-slate-900 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/10 hover:text-emerald-600 dark:hover:text-white border border-transparent'
                }`}
              >
                <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  <LiveIcon 
                    icon={item.icon} 
                    type={isActive ? 'pulse' : 'none'}
                    size={22} 
                    className={isActive ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-400 group-hover:text-emerald-500 transition-colors'} 
                  />
                </div>
                <span className="flex-1 tracking-tight">{item.name}</span>
                {item.isNew && (
                  <span className="px-2 py-0.5 bg-rose-500 text-[10px] text-white rounded-full animate-pulse shadow-lg shadow-rose-500/30 uppercase font-black tracking-tighter">
                    {t('new')}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800/50">
          <Link to="/profile" className="block">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-[1.5rem] p-4 mb-4 transition-all hover:bg-emerald-50 dark:hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/10 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black shadow-sm group-hover:scale-105 transition-transform">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{user?.displayName || 'User'}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-500 truncate font-bold uppercase tracking-widest">{t('activeMember')}</p>
                </div>
              </div>
            </div>
          </Link>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-5 py-3 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all group font-black border border-transparent hover:border-rose-500/10"
          >
            <LiveIcon icon={LogOut} type="none" size={20} className="group-hover:text-rose-500 transition-colors" />
            {t('logout')}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
