import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ChatAssistant from './ChatAssistant';
import RainAlertManager from './RainAlertManager';
import RainAlertWatcher from './RainAlertWatcher';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col p-4 lg:p-8 overflow-y-auto relative">
        <div className="flex items-center justify-between mb-6">
          {!isDashboard ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 hover:-translate-x-1 transition-all duration-200"
            >
              <ArrowLeft size={16} />
              {t('backToDashboard')}
            </button>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-3">
            <RainAlertManager />
            <RainAlertWatcher />
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex-1 w-full">
          {children}
        </div>
        <footer className="mt-8 py-4 text-center text-sm font-medium text-slate-400 dark:text-slate-500">
          &copy; Copyright Reserved 2026
        </footer>
        <ChatAssistant />
      </main>
    </div>
  );
};

export default DashboardLayout;
