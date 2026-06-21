import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sprout, Wheat, Zap, Info, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function YieldProjectionModule({ history = [], weatherRisk = null }) {
  const { t } = useLanguage();

  // Basic projection logic: Health % * Weather Factor
  const healthyCount = history.filter(h => h.disease.toLowerCase().includes('healthy')).length;
  const totalScans = history.length;
  const healthFactor = totalScans > 0 ? (healthyCount / totalScans) : 0.8;
  const weatherFactor = (weatherRisk?.riskLevel === 'High') ? 0.7 : (weatherRisk?.riskLevel === 'Moderate' ? 0.9 : 1.0);
  
  const yieldProjection = Math.round(healthFactor * weatherFactor * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card module-glow h-full p-8 relative overflow-hidden group border-white/40 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('yieldProjection')}</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-tight tracking-tight">Harvest Forecast</p>
        </div>
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
          <Wheat size={22} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-end gap-3">
          <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{yieldProjection}%</p>
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase mb-1">
            <ArrowUpRight size={14} />
            Optimized
          </div>
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Current Potential Yield</p>

        <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 relative overflow-hidden group/inner">
           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
           <div className="flex items-start gap-3">
              <Zap size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                 <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1.5">Growth Insight</p>
                 <p className="text-xs font-medium text-white/90 leading-relaxed italic">
                    {yieldProjection > 80 
                      ? "Maintaining current conditions could lead to a bumper harvest. Continue regular monitoring."
                      : "Environmental stress detected. Adjust irrigation and nutrients to recover yield potential."
                    }
                 </p>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
           <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${yieldProjection}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
           </div>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-0">
        <Sprout size={240} className="text-slate-900 dark:text-white" />
      </div>
    </motion.div>
  );
}
