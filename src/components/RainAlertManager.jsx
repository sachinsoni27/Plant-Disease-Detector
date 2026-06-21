import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, X, Phone, MapPin, Bell, CheckCircle, RefreshCw, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { saveRainAlertSettings, getRainAlertSettings, triggerTestAlert, processAlerts } from '../services/RainAlertService';

export default function RainAlertManager() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    phoneNumber: '',
    alertsEnabled: true,
    lat: null,
    lng: null
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const data = await getRainAlertSettings(user.uid);
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  const detectLocation = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSettings(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          setLoading(false);
        },
        (err) => {
          setError(t('locationDenied'));
          setLoading(false);
        }
      );
    } else {
      setError(t('locationUnavailable'));
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(settings.phoneNumber)) {
      setError(t('invalidPhone'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let normalizedPhone = settings.phoneNumber;
      if (!normalizedPhone.startsWith('+91')) {
        normalizedPhone = '+91' + normalizedPhone;
      }

      const savedData = {
        ...settings,
        phoneNumber: normalizedPhone
      };

      await saveRainAlertSettings(user.uid, savedData);
      
      if (settings.alertsEnabled) {
        // First, send the welcome/confirm SMS
        await triggerTestAlert(normalizedPhone, t('welcomeSms'));
        
        // Then, perform an immediate weather check for instant feedback
        await processAlerts(user.uid, savedData, t);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Failed to save settings. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all relative group"
        aria-label="Rain Alert Settings"
      >
        <CloudRain size={20} className={settings.alertsEnabled ? 'text-emerald-500' : ''} />
        {settings.alertsEnabled && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[500] p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50"
            >
              <div className="p-6 bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                    <CloudRain size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">{t('rainAlertTitle')}</h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest leading-none mt-1">Live Weather Monitoring</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg hover:bg-white/20">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t('rainAlertDesc')}
                </p>

                <div className="space-y-6">
                  {/* Phone Input */}
                  <div className="group">
                    <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">
                      {t('phoneNumber')}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                        <Phone size={18} />
                      </div>
                      <input 
                        type="text"
                        value={settings.phoneNumber}
                        onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
                        placeholder={t('phoneNumberPlaceholder')}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Location Segment */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">Weather Location</p>
                          <p className="text-sm font-black text-slate-800 dark:text-white">
                            {settings.lat ? `${settings.lat.toFixed(4)}, ${settings.lng.toFixed(4)}` : 'Location not set'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={detectLocation}
                        disabled={loading}
                        className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all group"
                      >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                      </button>
                    </div>
                    {settings.lat && (
                      <div className="flex items-center gap-2 mt-2 px-1">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('locationDetected')}</span>
                      </div>
                    )}
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-between p-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${settings.alertsEnabled ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        <Bell size={20} />
                      </div>
                      <span className="text-sm font-black text-slate-800 dark:text-white tracking-tight">{t('enableAlerts')}</span>
                    </div>
                    <button 
                      onClick={() => setSettings({...settings, alertsEnabled: !settings.alertsEnabled})}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${settings.alertsEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    >
                      <motion.div 
                        animate={{ x: settings.alertsEnabled ? 26 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-xs font-black">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                {saved && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs font-black">
                    <CheckCircle size={16} />
                    {t('alertSettingsSuccess')}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pb-2">
                  <button
                    onClick={() => triggerTestAlert(settings.phoneNumber, "Test Alert").then(() => alert("Test Sent")).catch(err => console.error(err))}
                    disabled={loading || !settings.phoneNumber}
                    className="py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-white text-sm font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                  >
                    {t('testAlert')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="relative py-4 rounded-2xl green-gradient text-white text-sm font-black shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center overflow-hidden"
                  >
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : t('saveAlertSettings')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
