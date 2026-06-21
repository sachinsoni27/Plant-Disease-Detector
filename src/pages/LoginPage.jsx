import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message);
    } else {
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-slate-900/80 overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-500"
      >
        <div className="p-8 lg:p-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold text-sm hover:-translate-x-1 transition-all duration-200"
            >
              <ArrowLeft size={16} />
              {t('backToHome')}
            </button>
            <LanguageToggle />
          </div>

          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 green-gradient rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/50">
              <Sprout size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-500">{t('welcomeBack')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors duration-500">{t('signInToAccess')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-500">{t('emailAddress')}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 transition-colors duration-500">{t('password')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full green-gradient text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                  {t('signIn')}
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 dark:text-slate-400 transition-colors duration-500">
            {t('dontHaveAccount')}{' '}
            <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">{t('signupTitle')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
