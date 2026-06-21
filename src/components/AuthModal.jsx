import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, LogIn, UserPlus, Code, Globe, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LiveIcon from './LiveIcon';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginWithGoogle, loginWithGithub } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let res;
      if (mode === 'login') {
        res = await login(email, password);
      } else {
        res = await signup(email, password, name);
      }

      if (res.success) {
        onClose();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');
    const res = await (provider === 'google' ? loginWithGoogle() : loginWithGithub());
    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop + Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card overflow-hidden relative border border-white/50 shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-full transition-all z-10"
                >
                  <X size={20} />
                </button>

                <div className="p-6 lg:p-8">
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 green-gradient rounded-3xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-400/30">
                      <LiveIcon icon={mode === 'login' ? LogIn : UserPlus} type="float" size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">
                      {mode === 'login' ? t('welcomeBack') : t('joinPlantAi')}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors duration-500">
                      {mode === 'login' ? t('signInToAccess') : t('startMonitoring')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold backdrop-blur-sm shadow-lg shadow-rose-500/10"
                      >
                        <AlertCircle size={20} className="shrink-0 text-rose-500" />
                        <p className="flex-1">{error}</p>
                      </motion.div>
                    )}

                    {mode === 'signup' && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider text-[10px]">{t('fullName')}</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                          <input
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/50 dark:bg-slate-900/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-emerald-500 dark:text-white rounded-2xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider text-[10px]">{t('emailAddress')}</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/50 dark:bg-slate-900/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-emerald-500 dark:text-white rounded-2xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider text-[10px]">{t('password')}</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input
                          name="password"
                          type="password"
                          required
                          autoComplete={mode === 'login' ? "current-password" : "new-password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/50 dark:bg-slate-900/50 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-emerald-500 dark:text-white rounded-2xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full green-gradient text-white font-black text-lg py-3.5 rounded-2xl shadow-lg shadow-emerald-400/30 hover:shadow-xl hover:shadow-emerald-400/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <LiveIcon icon={mode === 'login' ? LogIn : UserPlus} type="none" size={20} className="group-hover:translate-x-1 transition-transform" />
                          {mode === 'login' ? t('signIn') : t('createAccount')}
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-5">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                      <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/50 dark:bg-slate-900/50 px-3 text-slate-400 dark:text-slate-500 font-bold tracking-widest backdrop-blur-sm transition-colors duration-500">{t('orContinueWith')}</span></div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleSocialLogin('google')}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all font-bold text-slate-700 dark:text-white shadow-sm disabled:opacity-50 group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px" className="group-hover:scale-110 transition-transform">
                          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                          <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                          <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                          <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.135,35.545,44,30.12,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        {t('continueWithGoogle')}
                      </button>
                    </div>
                  </div>

                  <p className="text-center mt-6 text-slate-500 dark:text-slate-400 font-medium transition-colors duration-500">
                    {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')} {' '}
                    <button
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-emerald-600 font-black hover:underline"
                    >
                      {mode === 'login' ? t('createAccount') : t('login')}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
