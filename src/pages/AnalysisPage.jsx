import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  FlaskConical,
  Bug,
  ShieldPlus,
  Download,
  RefreshCcw,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import analyzeImage from '../utils/analyzeImage';
import diseaseData from '../utils/diseaseData';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import LiveIcon from '../components/LiveIcon';
import { useLocalHistory } from '../hooks/useLocalHistory';

import { useLanguage } from '../context/LanguageContext';

export default function AnalysisPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { addEntry } = useLocalHistory(user?.uid);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const imgData = await toPng(reportRef.current, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const nodeWidth = reportRef.current.offsetWidth || 800;
      const nodeHeight = reportRef.current.offsetHeight || 600;
      const pdfHeight = (nodeHeight * pdfWidth) / nodeWidth;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PlantAI_Report.pdf`);
    } catch (err) {
      console.error('PDF generation failed', err);
      alert('Failed to generate PDF: ' + (err.message || err));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
      setResult(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  // Convert a file to base64 data URL for localStorage storage
  const fileToDataUrl = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

  const runAnalysis = async () => {
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    setError('');

    try {
      // 1. AI Analysis
      const arrayBuffer = await selectedFile.arrayBuffer();
      const aiResult = await analyzeImage(arrayBuffer, selectedFile.type);

      // 2. Map disease details
      const details = diseaseData[aiResult.label] || {
        description: { 
          en: 'No specific details available for this condition.', 
          hi: 'इस स्थिति के लिए कोई विशिष्ट विवरण उपलब्ध नहीं है।' 
        },
        severity: 'Medium',
        treatment: {
          recommended: { 
            en: ['Consult an agricultural expert'], 
            hi: ['कृषि विशेषज्ञ से सलाह लें'] 
          },
          pesticides: { 
            en: ['N/A'], 
            hi: ['उपलब्ध नहीं'] 
          },
          preventive: { 
            en: ['Ensure proper plant care'], 
            hi: ['पौधों की उचित देखभाल सुनिश्चित करें'] 
          },
        },
      };

      const analysisResult = {
        disease: aiResult.label,
        confidence: aiResult.confidence,
        source: aiResult.source,
        description: details.description,
        severity: details.severity,
        treatment: details.treatment,
      };

      // 3. Save to localStorage history with real image thumbnail
      const imageDataUrl = await fileToDataUrl(selectedFile);
      addEntry({
        ...analysisResult,
        imageUrl: imageDataUrl,
        fileName: selectedFile.name,
        userId: user.uid,
      });

      // 4. Try to save to Firestore (best-effort, does not block UI)
      try {
        const docRef = await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          imageUrl: 'local',
          disease: analysisResult.disease,
          confidence: analysisResult.confidence,
          description: analysisResult.description,
          severity: analysisResult.severity,
          treatment: analysisResult.treatment,
          createdAt: serverTimestamp(),
        });
        console.log('Saved to Firestore:', docRef.id);
      } catch (firestoreErr) {
        console.warn('Firestore save skipped (offline/quota):', firestoreErr.message);
      }

      setResult({ ...analysisResult, createdAt: new Date() });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight lg:text-5xl mb-2 transition-colors duration-500">
               {t('diseaseAnalysis').split(' ')[0]} <span className="text-emerald-600">{t('diseaseAnalysis').split(' ')[1]}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl transition-colors duration-500 font-medium italic">{t('analysisDesc')}</p>
          </div>
          <Link
            to="/history"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all shrink-0 shadow-sm"
          >
            <History size={16} />
            {t('viewHistory')}
          </Link>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Panel */}
          <div className="space-y-6">
            <div className="glass-card p-2 border-2 border-dashed border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 transition-colors relative group">
              {!preview ? (
                <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors duration-300">
                    <LiveIcon icon={Upload} type="bounce" size={40} />
                  </div>
                  <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{t('chooseImage')}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-base mt-2 font-medium">{t('dragDrop')}</span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs mt-1">{t('fileLimits')}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden aspect-video group/preview">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <button
                    onClick={clearSelection}
                    className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300 opacity-0 group-hover/preview:opacity-100 shadow-xl"
                  >
                    <X size={20} className="font-bold" />
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertTriangle size={18} />
                {error}
              </div>
            )}

            <button
              onClick={runAnalysis}
              disabled={!selectedFile || isAnalyzing}
              className="w-full green-gradient text-white font-black text-lg py-5 rounded-2xl shadow-lg shadow-emerald-400/30 hover:shadow-xl hover:shadow-emerald-400/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3">
                {isAnalyzing && <LiveIcon icon={FlaskConical} type="spin" size={24} />}
                {isAnalyzing ? t('analyzing') : t('runAnalysis')}
              </div>
            </button>
          </div>

          {/* Results Panel */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full glass-card flex flex-col items-center justify-center p-12 text-center min-h-[400px]"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-40 rounded-full animate-pulse"></div>
                    <LiveIcon icon={FlaskConical} type="wiggle" size={64} className="text-emerald-600 dark:text-emerald-400 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2 text-slate-800 dark:text-white">{t('analyzingImage')}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{t('runningModels')}</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div ref={reportRef} className="glass-card overflow-hidden p-8 mb-6">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-3xl ${result.disease.toLowerCase().includes('healthy') ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                          <LiveIcon icon={result.disease.toLowerCase().includes('healthy') ? CheckCircle2 : AlertTriangle} type="pulse" size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t('analysisResultTitle')}</h3>
                          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                            {t('confidenceTitle')}: {result.confidence}%
                            {result.source && <span className="ml-2 text-emerald-500 normal-case font-semibold">via {result.source}</span>}
                          </p>
                        </div>
                      </div>
                      <div className={`px-5 py-2 rounded-full text-sm font-black tracking-wide uppercase shadow-sm ${
                        result.severity === 'Low' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400' :
                        result.severity === 'Medium' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400' :
                        'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400'
                      }`}>
                        {result.severity === 'Low' ? t('low') : result.severity === 'Medium' ? t('medium') : t('high')} {t('severityTitle')}
                      </div>
                    </div>

                    <h2 className="text-4xl font-black text-slate-900 dark:text-white capitalize mb-4 tracking-tight leading-none">
                      {t(result.disease === 'Healthy' ? 'healthy' : 
                         result.disease === 'Apple___Apple_scab' ? 'appleScab' :
                         result.disease === 'Apple___Black_rot' ? 'appleBlackRot' :
                         result.disease === 'Corn_(maize)___Common_rust' ? 'cornRust' :
                         result.disease === 'Tomato___Early_blight' ? 'tomatoEarlyBlight' :
                         result.disease === 'Tomato___Late_blight' ? 'tomatoLateBlight' :
                         'unknown') || result.disease.replace(/_/g, ' ')}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-300 text-lg mb-10 leading-relaxed font-medium">
                      {result.description[language] || result.description['en']}
                    </p>

                    <div className="space-y-8 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-colors duration-500">
                      <div className="flex gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0 h-fit">
                          <LiveIcon icon={Leaf} type="float" size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 dark:text-white mb-2">{t('recommendedTreatment')}</h4>
                          <ul className="list-disc list-inside text-base font-medium text-slate-600 dark:text-slate-400 space-y-2">
                            {(result.treatment.recommended[language] || result.treatment.recommended['en']).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 shrink-0 h-fit">
                          <LiveIcon icon={Bug} type="wiggle" size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 dark:text-white mb-2">{t('pesticideFertilizer')}</h4>
                          <ul className="list-disc list-inside text-base font-medium text-slate-600 dark:text-slate-400 space-y-2">
                            {(result.treatment.pesticides[language] || result.treatment.pesticides['en']).map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0 h-fit">
                          <LiveIcon icon={ShieldPlus} type="pulse" size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 dark:text-white mb-2">{t('preventiveMeasures')}</h4>
                          <ul className="list-disc list-inside text-base font-medium text-slate-600 dark:text-slate-400 space-y-2">
                            {(result.treatment.preventive[language] || result.treatment.preventive['en']).map((pm, i) => <li key={i}>{pm}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <button
                      onClick={downloadPDF}
                      disabled={isGeneratingPdf}
                      className="flex-1 flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                    >
                      <LiveIcon icon={Download} type="bounce" size={20} />
                      {isGeneratingPdf ? t('generating') : t('downloadPdf')}
                    </button>
                    <button
                      onClick={clearSelection}
                      className="flex-1 flex items-center justify-center gap-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-bold py-4 rounded-2xl hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors duration-300"
                    >
                      <LiveIcon icon={RefreshCcw} type="spin" size={20} />
                      {t('analyzeAnother')}
                    </button>
                  </div>

                  {/* Quick link to history */}
                  <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-4">
                    ✅ {t('resultSaved')}{' '}
                    <Link to="/history" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                      {t('analysisHistory')}
                    </Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full glass-card border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-12 text-center text-slate-400 dark:text-slate-500 min-h-[400px]"
                >
                  <LiveIcon icon={ImageIcon} type="float" size={64} className="mb-6 opacity-20" />
                  <p className="font-medium text-lg">{t('emptyResults')}</p>
                  <p className="text-sm mt-2 opacity-70">{t('uploadLeafPrompt')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>

  );
}
