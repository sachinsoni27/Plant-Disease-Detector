import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle, ExternalLink, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToNotifications, markAsRead } from '../services/NotificationService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function NotificationManager() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'warning': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'danger': return { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10' };
      case 'success': return { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all relative group"
        aria-label="Notifications"
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-swing' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 glass-card shadow-2xl z-[300] overflow-hidden border border-slate-200 dark:border-slate-700 max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider text-xs">{t('notifications')}</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                    {unreadCount} {t('new')}
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                  <Inbox size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-bold opacity-60">{t('noNotifications')}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.map((n) => {
                    const styles = getTypeStyles(n.type);
                    return (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative cursor-pointer ${!n.read ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1 p-2 rounded-xl h-fit ${styles.bg} ${styles.color}`}>
                            <styles.icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h4 className={`text-sm font-black truncate ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                {n.title}
                              </h4>
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap pt-0.5">
                                {n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">
                              {n.message}
                            </p>
                            {n.actionUrl && (
                              <Link 
                                to={n.actionUrl}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-wider"
                              >
                                {t('viewDetails')} <ExternalLink size={10} />
                              </Link>
                            )}
                          </div>
                          {!n.read && (
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">
                  {t('markAllAsRead')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
