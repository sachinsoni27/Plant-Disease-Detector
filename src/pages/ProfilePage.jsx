import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Sprout, History } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto space-y-8 pb-12"
      >
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">
              {t('accountSettings').split(' ')[0]} <span className="text-emerald-600">{t('accountSettings').split(' ')[1]}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg transition-colors duration-500 font-medium">{t('accountSettingsDesc')}</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              {t('activeNow')}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar and Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-800 p-2 shadow-2xl shadow-emerald-200/50 dark:shadow-slate-900/50 transition-colors duration-500 relative z-10">
                  <div className="w-full h-full rounded-[2rem] bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-4xl font-black transition-colors duration-500 ring-4 ring-emerald-50 dark:ring-emerald-500/10">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-emerald-600 z-20 border-4 border-slate-50 dark:border-slate-900 cursor-pointer hover:scale-110 transition-transform">
                  <User size={18} strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate w-full">
                {user?.displayName || 'Adventurer'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 truncate w-full">{user?.email}</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">{t('totalScans').split(' ')[1]}</p>
                  <p className="text-xl font-bold text-emerald-600">24</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">{t('userLevel')}</p>
                  <p className="text-xl font-bold text-emerald-600">{t('pro')}</p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 rounded-[1.5rem] font-black hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all group shadow-sm hover:shadow-rose-500/10"
            >
              <LogOut size={20} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
              {t('signOut')}
            </button>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('personalInfo')}</h3>
                <button className="text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline">{t('editDetails')}</button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('fullName')}</label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-700/50 transition-colors duration-500">
                      <User className="text-emerald-500/50" size={20} />
                      <p className="font-bold text-slate-900 dark:text-white transition-colors duration-500">{user?.displayName || 'Not Provided'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('emailHash')}</label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-700/50 transition-colors duration-500">
                      <Mail className="text-emerald-500/50" size={20} />
                      <p className="font-bold text-slate-900 dark:text-white transition-colors duration-500 truncate lowercase">{user?.email?.split('@')[0]}...</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{t('accountRole')}</label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-700/50 transition-colors duration-500">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Sprout size={18} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white transition-colors duration-500">{t('agriExpert')}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{t('agriExpertDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600">
                      <History size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-400">{t('securityUpdate')}</p>
                      <p className="text-xs text-amber-600/80 font-medium tracking-tight">{t('securityDesc')}</p>
                    </div>
                  </div>
                  <button className="text-xs font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest hover:underline">{t('update')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
