import React, { useState, useEffect } from 'react';
import { Cloud, Thermometer, Droplets, MapPin, AlertTriangle, Loader2, ShieldAlert, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getWeatherRisk } from '../services/WeatherService';

export default function WeatherWidget() {
  const { t } = useLanguage();
  const [state, setState] = useState({
    status: 'loading', 
    location: '',
    city: '',
    region: '',
    temp: null,
    humidity: null,
    risk: null, // Will hold the object from WeatherService
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, status: 'error' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const [geoRes, weatherData] = await Promise.all([
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            ),
            getWeatherRisk(latitude, longitude)
          ]);

          const geoData = await geoRes.json();
          const city = geoData.city || geoData.locality || "Your Location";
          const region = geoData.principalSubdivision || geoData.countryName || '';

          setState({
            status: 'success',
            location: `${city}, ${region}`,
            city,
            region,
            temp: weatherData.temp,
            humidity: weatherData.humidity,
            risk: weatherData,
          });
        } catch (err) {
          console.error('Weather/Geo fetch error:', err);
          setState(s => ({ ...s, status: 'error' }));
        }
      },
      () => setState(s => ({ ...s, status: 'denied' })),
      { timeout: 10000 }
    );
  }, []);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      case 'Moderate': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      default: return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card module-glow p-8 h-full relative overflow-hidden group border-white/40 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('environment')}</h3>
          {state.status === 'success' ? (
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-tight">{state.city}</p>
          ) : state.status === 'loading' ? (
            <p className="text-slate-400 dark:text-slate-500 mt-1 font-semibold text-sm animate-pulse whitespace-nowrap">{t('detectingLocation')}</p>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 mt-1 font-semibold text-sm">{t('locationUnavailable')}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
          {state.status === 'loading' ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <MapPin size={22} />
          )}
        </div>
      </div>

      {state.status === 'success' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-2 text-rose-500 bg-rose-500/10 rounded-xl">
                <Thermometer size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('temp')}</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{state.temp}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="p-2 text-blue-500 bg-blue-500/10 rounded-xl">
                <Droplets size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('humidity')}</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{state.humidity}%</p>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {state.risk && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl border ${getRiskColor(state.risk.riskLevel)}`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{t('riskAssessment')}</p>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-bold uppercase">{state.risk.riskLevel}</span>
                    </div>
                    <p className="text-sm font-bold mb-2 leading-tight">{state.risk.riskFactor}</p>
                    <div className="flex items-start gap-2 pt-2 border-t border-current/10">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      <p className="text-[11px] font-medium leading-relaxed opacity-90">{state.risk.advice}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {(state.status === 'denied' || state.status === 'error') && (
        <div className="py-8 text-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
          <Cloud size={40} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-bold opacity-70">{t('locationUnavailable')}</p>
          <p className="text-[10px] mt-1 font-medium">{t('grantAccess')}</p>
        </div>
      )}
    </motion.div>
  );
}
