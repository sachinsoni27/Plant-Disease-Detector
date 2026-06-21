import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AnalyticsModule({ history = [] }) {
  const { t } = useLanguage();

  // Basic analytics processing from history
  const totalScans = history.length;
  const healthyCount = history.filter(h => h.disease.toLowerCase().includes('healthy')).length;
  const healthRate = totalScans > 0 ? Math.round((healthyCount / totalScans) * 100) : 100;
  
  // Simulated trend - real apps would compare time periods
  const isTrendUp = healthRate >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card module-glow p-8 h-full relative overflow-hidden group border-white/40 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('analytics')}</h3>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-tight tracking-tight">Health Trends</p>
        </div>
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
          <BarChart3 size={22} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Metric */}
        <div className="flex items-end gap-3">
          <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{healthRate}%</p>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black mb-1 ${
            isTrendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
          }`}>
            {isTrendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {isTrendUp ? '+12%' : '-5%'}
          </div>
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Overall Plant Vitality</p>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Scans</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalScans}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Health Score</p>
            <p className="text-xl font-black text-emerald-500">{healthRate}/100</p>
          </div>
        </div>

        {/* Visual Cue - Simplified Bar Chart */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Trajectory</span>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimized</span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${healthRate}%` }}
              className="h-full green-gradient shadow-lg shadow-emerald-500/30"
            />
          </div>
        </div>
      </div>

      {/* Futuristic Link Overlay */}
      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-100 transition-opacity">
        <TrendingUp size={100} className="text-slate-400 dark:text-slate-600" />
      </div>
    </motion.div>
  );
}
