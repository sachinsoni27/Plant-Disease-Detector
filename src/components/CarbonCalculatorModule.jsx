import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Wind, Globe, Info, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CarbonCalculatorModule({ history = [] }) {
  const { t } = useLanguage();

  // Basic carbon sequestration logic: Scans * HealthFactor * AverageSequestration
  const healthyCount = history.filter(h => h.disease.toLowerCase().includes('healthy')).length;
  const totalScans = history.length;
  const healthFactor = totalScans > 0 ? (healthyCount / totalScans) : 0.8;
  const carbonSequestration = Math.round(totalScans * healthFactor * 0.45 * 10) / 10; // kg of CO2/year

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card module-glow h-full p-8 relative overflow-hidden group border-white/40 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('carbonScore')}</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-tight tracking-tight">Eco Impact</p>
        </div>
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
          <Globe size={22} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-end gap-3">
          <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{carbonSequestration}</p>
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase mb-1">
             Kg CO2/y
          </div>
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Estimated Environmental Contribution</p>

        <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-emerald-500/10 relative overflow-hidden">
           <div className="flex items-center gap-3">
              <Wind size={20} className="text-emerald-500" />
              <div>
                 <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Planet Hero Status</p>
                 <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Your plants are actively purifying the air. Keep them healthy to maximize your impact.
                 </p>
              </div>
           </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
           <div className="flex items-center gap-2 group/tip cursor-help">
              <Info size={14} className="text-slate-400 group-hover/tip:text-emerald-500 transition-colors" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/tip:text-slate-600 dark:group-hover/tip:text-slate-300 transition-colors">How is this calculated?</span>
           </div>
           <motion.div 
             whileHover={{ x: 5 }}
             className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
           >
              Detailed Report <ArrowUpRight size={12} />
           </motion.div>
        </div>
      </div>

      <div className="absolute -top-12 -right-12 opacity-[0.05] grayscale group-hover:grayscale-0 transition-all duration-1000 rotate-45 group-hover:rotate-0">
        <Leaf size={200} className="text-emerald-500" />
      </div>
    </motion.div>
  );
}
