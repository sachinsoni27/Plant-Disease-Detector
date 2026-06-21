import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Sprout, 
  History, 
  ArrowRight, 
  TrendingUp, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import LiveIcon from '../components/LiveIcon';
import WeatherWidget from '../components/WeatherWidget';
import AnalyticsModule from '../components/AnalyticsModule';
import YieldProjectionModule from '../components/YieldProjectionModule';
import CarbonCalculatorModule from '../components/CarbonCalculatorModule';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocalHistory } from '../hooks/useLocalHistory';

const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isEnabled } = useFeatureFlags();
  const { history } = useLocalHistory(user?.uid);
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    diseased: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "analyses"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data());
        
        const healthy = data.filter(a => a.disease.toLowerCase().includes('healthy')).length;
        setStats({
          total: data.length,
          healthy,
          diseased: data.length - healthy
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, [user]);

  const cards = [
    { title: t('totalAnalyses'), value: stats.total, icon: History, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20', type: 'spin' },
    { title: t('healthyPlants'), value: stats.healthy, icon: ShieldCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20', type: 'pulse' },
    { title: t('issuesDetected'), value: stats.diseased, icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20', type: 'bounce' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 perspective-1000">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('hello')}, {user?.displayName?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">{t('personalInsights')}</p>
          </motion.div>
          <Link 
            to="/analysis"
            className="flex items-center justify-center gap-2 green-gradient text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-400/30 hover:shadow-emerald-400/50 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <LiveIcon icon={PlusCircle} type="spin" size={22} />
            {t('startAiScan')}
          </Link>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <TiltCard key={card.title} className="perspective-1000">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card module-glow p-8 h-full relative group overflow-hidden border-white/40 dark:border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className={`w-16 h-16 ${card.bg} border-2 ${card.color} rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 dark:shadow-black/20`}>
                    <LiveIcon icon={card.icon} type={card.type} size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-1.5">{card.title}</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{card.value}</p>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {isEnabled('weatherPrediction') && <WeatherWidget />}
          </div>
          
          <div className="lg:col-span-1">
            {isEnabled('userAnalytics') && <AnalyticsModule history={history} />}
          </div>

          <div className="lg:col-span-1">
            {isEnabled('yieldProjection') && <YieldProjectionModule history={history} />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="lg:col-span-1">
              {isEnabled('carbonCalculator') && <CarbonCalculatorModule history={history} />}
           </div>
           
           <TiltCard className="lg:col-span-1 h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card module-glow p-10 h-full relative overflow-hidden group border-white/40 dark:border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.01]">
                <div className="w-fit px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-emerald-500/20">
                  {t('advancedDetection')}
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">{t('aiCropAnalysis')}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm text-lg font-medium leading-relaxed">
                  {t('aiCropAnalysisDesc')}
                </p>
                <Link 
                  to="/analysis"
                  className="inline-flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black text-xl group-hover:gap-5 transition-all"
                >
                  {t('initiateScan')} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
              <div className="absolute top-1/2 right-[-40px] translate-y-[-50%] opacity-[0.05] dark:opacity-20 group-hover:opacity-30 group-hover:scale-125 transition-all duration-1000 ease-out">
                <LiveIcon icon={Sprout} type="float" size={280} />
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </div>
    </DashboardLayout>


  );
}
