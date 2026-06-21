import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History as HistoryIcon,
  Calendar,
  Search,
  Trash2,
  Trash,
  X,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Bug,
  ShieldPlus,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocalHistory } from '../hooks/useLocalHistory';
import LiveIcon from '../components/LiveIcon';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// ─── Detail Modal ────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  const { t, language } = useLanguage();
  if (!item) return null;
  const isHealthy = item.disease.toLowerCase().includes('healthy');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {item.imageUrl && (
          <div className="aspect-video w-full overflow-hidden relative">
            <img src={item.imageUrl} alt={item.disease} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                item.severity === 'Low' ? 'bg-emerald-500' :
                item.severity === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
              }`}>{item.severity === 'Low' ? t('low') : item.severity === 'Medium' ? t('medium') : t('high')} {t('severityTitle')}</span>
              <span className="text-white/80 text-xs font-medium">{item.confidence}% {t('confidence')}</span>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isHealthy
                  ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  : <AlertTriangle size={18} className="text-rose-500 shrink-0" />}
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {isHealthy ? t('healthyStatus') : t('diseaseDetectedStatus')}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                {t(item.disease === 'Healthy' ? 'healthy' : 
                   item.disease === 'Apple___Apple_scab' ? 'appleScab' :
                   item.disease === 'Apple___Black_rot' ? 'appleBlackRot' :
                   item.disease === 'Corn_(maize)___Common_rust' ? 'cornRust' :
                   item.disease === 'Tomato___Early_blight' ? 'tomatoEarlyBlight' :
                   item.disease === 'Tomato___Late_blight' ? 'tomatoLateBlight' :
                   'unknown') || item.disease.replace(/_/g, ' ')}
              </h2>
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs mt-1">
                <Calendar size={12} />
                {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                <Clock size={12} className="ml-1" />
                {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all shrink-0">
              <X size={20} />
            </button>
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {typeof item.description === 'object' ? (item.description[language] || item.description['en']) : item.description}
          </p>

          {/* Treatment */}
          {item.treatment && (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex gap-3">
                <Leaf size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t('recommendedTreatment')}</p>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {(Array.isArray(item.treatment.recommended) ? item.treatment.recommended : (item.treatment.recommended?.[language] || item.treatment.recommended?.['en'] || []))?.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex gap-3">
                <Bug size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t('pesticideFertilizer')}</p>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {(Array.isArray(item.treatment.pesticides) ? item.treatment.pesticides : (item.treatment.pesticides?.[language] || item.treatment.pesticides?.['en'] || []))?.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldPlus size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t('preventiveMeasures')}</p>
                  <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                    {(Array.isArray(item.treatment.preventive) ? item.treatment.preventive : (item.treatment.preventive?.[language] || item.treatment.preventive?.['en'] || []))?.map((pm, i) => <li key={i}>{pm}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Confirmation Modal ──────────────────────────────────────────────────────
function ConfirmationModal({ isOpen, onConfirm, onCancel, title, message, variant = 'danger' }) {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[250] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
          variant === 'danger' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'
        }`}>
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 rounded-xl text-white font-bold transition-all shadow-lg ${
              variant === 'danger' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
            }`}
          >
            {t('confirm')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── History Card ─────────────────────────────────────────────────────────────
function HistoryCard({ item, onDelete, onView, index }) {
  const { t } = useLanguage();
  const isHealthy = item.disease.toLowerCase().includes('healthy');
  const date = new Date(item.createdAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      layout
      className="glass-card overflow-hidden group card-hover"
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.disease}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
            <HistoryIcon size={40} />
          </div>
        )}
        {/* Severity Badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white ${
          item.severity === 'Low' ? 'bg-emerald-500/90' :
          item.severity === 'Medium' ? 'bg-amber-500/90' :
          'bg-rose-500/90'
        }`}>
          {item.severity === 'Low' ? t('low') : item.severity === 'Medium' ? t('medium') : t('high')}
        </div>
        {/* Delete Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-rose-500 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md"
          title="Delete this entry"
        >
          <Trash2 size={14} />
        </button>
        {/* Status icon */}
        <div className={`absolute bottom-3 left-3 p-1.5 rounded-full ${isHealthy ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}>
          {isHealthy
            ? <CheckCircle2 size={14} className="text-white" />
            : <AlertTriangle size={14} className="text-white" />}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-2">
          <Calendar size={12} />
          {date.toLocaleDateString()}
          <span className="mx-1 opacity-50">•</span>
          <Clock size={12} />
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize mb-1 leading-tight line-clamp-2">
          {t(item.disease === 'Healthy' ? 'healthy' : 
             item.disease === 'Apple___Apple_scab' ? 'appleScab' :
             item.disease === 'Apple___Black_rot' ? 'appleBlackRot' :
             item.disease === 'Corn_(maize)___Common_rust' ? 'cornRust' :
             item.disease === 'Tomato___Early_blight' ? 'tomatoEarlyBlight' :
             item.disease === 'Tomato___Late_blight' ? 'tomatoLateBlight' :
             'unknown') || item.disease.replace(/_/g, ' ')}
        </h3>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {item.confidence}% {t('confidence')}
          </span>
          <button
            onClick={() => onView(item)}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {t('details')} <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { history, deleteEntry, clearAll } = useLocalHistory(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isConfirmingClearAll, setIsConfirmingClearAll] = useState(false);

  const filteredHistory = history.filter(item =>
    item.disease.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteEntry(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleConfirmClearAll = () => {
    clearAll();
    setIsConfirmingClearAll(false);
  };

  return (
    <>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors duration-500">{t('analysisHistory')}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg transition-colors duration-500 font-medium italic">
                {history.length > 0
                  ? `${history.length} ${history.length === 1 ? t('scanSavedLocally') : t('scansSavedLocally')}`
                  : t('pastReportsAppearHere')}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder={t('searchByDisease')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 dark:text-white rounded-2xl py-3 pl-11 pr-4 outline-none transition-all shadow-sm w-60 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Clear All */}
              {history.length > 0 && (
                <button
                  onClick={() => setIsConfirmingClearAll(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-100 dark:border-rose-500/20 shadow-sm"
                >
                  <Trash size={16} />
                  {t('clearAll')}
                </button>
              )}

              {/* New Analysis */}
              <Link
                to="/analysis"
                className="flex items-center gap-2 px-4 py-3 rounded-2xl green-gradient text-white font-bold text-sm shadow-lg shadow-emerald-400/30 hover:shadow-emerald-400/50 hover:-translate-y-0.5 transition-all"
              >
                {t('startAiScan')}
              </Link>
            </div>
          </section>

          {/* Content */}
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card text-center py-24 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700"
            >
              <LiveIcon icon={HistoryIcon} type="float" size={80} className="mb-6 opacity-20 mx-auto" />
              <p className="text-xl font-bold tracking-tight text-slate-600 dark:text-slate-400">{t('noHistoryYet')}</p>
              <p className="text-sm mt-2 mb-8 text-slate-400 dark:text-slate-500">{t('runFirstAnalysis')}</p>
              <Link
                to="/analysis"
                className="inline-flex items-center gap-2 px-6 py-3 green-gradient text-white font-bold rounded-2xl shadow-lg shadow-emerald-400/30 hover:shadow-emerald-400/50 hover:-translate-y-0.5 transition-all"
              >
                {t('startAnalysis')}
              </Link>
            </motion.div>
          ) : filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card text-center py-16 text-slate-400 dark:text-slate-500"
            >
              <Search size={48} className="mb-4 opacity-20 mx-auto" />
              <p className="text-lg font-bold">{t('noResultsFor')} "{searchTerm}"</p>
              <p className="text-sm mt-1">{t('tryDifferentSearch')}</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHistory.map((item, index) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    index={index}
                    onDelete={(id) => setDeleteTargetId(id)}
                    onView={setSelectedItem}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DashboardLayout>

      {/* Modals */}
      <AnimatePresence>
        {/* Detail Modal */}
        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
        
        {/* Confirmation: Delete Single Item */}
        {deleteTargetId && (
          <ConfirmationModal
            isOpen={true}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteTargetId(null)}
            title={t('deleteScanPrompt')}
            message={t('deleteScanMessage')}
          />
        )}
        
        {/* Confirmation: Clear All */}
        {isConfirmingClearAll && (
          <ConfirmationModal
            isOpen={true}
            onConfirm={handleConfirmClearAll}
            onCancel={() => setIsConfirmingClearAll(false)}
            title={t('clearAllPrompt')}
            message={t('clearAllMessage')}
          />
        )}
      </AnimatePresence>
    </>
  );
}
