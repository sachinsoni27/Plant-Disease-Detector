import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2, Minimize2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useLanguage } from '../context/LanguageContext';
import { useLocalHistory } from '../hooks/useLocalHistory';
import { useAuth } from '../context/AuthContext';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


export default function ChatAssistant() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { history: localHistory } = useLocalHistory(user?.uid);
  const [isOpen, setIsOpen] = useState(false);
  
  // Identify latest analysis for context
  const latestScan = localHistory && localHistory.length > 0 ? localHistory[0] : null;

  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chatWelcome') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Re-initialize inside to ensure VITE_GEMINI_API_KEY is latest
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey.length < 10) {
        throw new Error("Invalid or missing API Key");
      }
      
      const genAIInstance = new GoogleGenerativeAI(apiKey);
      const model = genAIInstance.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // GEMINI REQUIREMENT: Simplified history.
      const history = messages
        .filter((m, idx) => idx > 0 || m.role === 'user')
        .slice(-6) // Keep history short for stability
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({ history });
      const contextPrompt = latestScan 
        ? `The user's latest plant analysis was for "${latestScan.disease}" with ${latestScan.confidence}% confidence. ` 
        : "";
      
      const promptText = `User Language: ${language === 'hi' ? 'Hindi' : 'English'}. Please reply in this language. \n\n ${contextPrompt} User Question: ${input}`;
      const result = await chat.sendMessage(promptText);
      const text = result.response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("Gemini Assistant Failure:", error);
      
      // DYNAMIC FALLBACK SYSTEM
      let smartFallback = t('chatFallback');
      
      const prompt = input.toLowerCase();
      if (prompt.includes("water")) smartFallback = t('chatWaterFallback');
      if (prompt.includes("light") || prompt.includes("sun")) smartFallback = t('chatLightFallback');
      if (prompt.includes("rain") || prompt.includes("protect")) smartFallback = t('chatRainFallback');
      if (prompt.includes("dead") || prompt.includes("yellow")) smartFallback = t('chatHealthFallback');
      if (prompt.includes("hi") || prompt.includes("hello")) smartFallback = t('chatHiFallback');

      setMessages(prev => [...prev, { role: 'assistant', content: smartFallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-96 glass-card overflow-hidden flex flex-col shadow-2xl border border-emerald-500/20 h-[70vh] sm:h-[600px] max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 green-gradient text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Bot size={24} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="font-black tracking-tight text-base sm:text-lg">{t('chatAssistantTitle')}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase opacity-80">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                    {t('chatOnline')}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                aria-label="Close chat"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 scroll-smooth"
            >
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none shadow-md shadow-emerald-500/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                    <Loader2 size={18} className="animate-spin text-emerald-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Overlay for Mobile Keyboard */}
            <form 
              onSubmit={handleSend} 
              className="p-4 sm:p-5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0"
            >
              <div className="relative group">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chatPlaceholder')}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 rounded-xl py-3.5 pl-5 pr-14 outline-none transition-all placeholder:text-slate-400 dark:text-white text-sm sm:text-base"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-500/30 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-medium">{t('chatPoweredBy')}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-rose-500 text-white rotate-90' : 'green-gradient text-white hover:shadow-emerald-500/40'
        }`}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? <X size={28} className="sm:w-8 sm:h-8" /> : (
          <div className="relative">
            <MessageSquare size={28} className="sm:w-8 sm:h-8" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
        )}
      </motion.button>
    </div>
  );
}
