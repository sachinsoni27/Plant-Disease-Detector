import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getRainAlertSettings, processAlerts } from '../services/RainAlertService';

/**
 * Background watcher component that handles automated weather monitoring
 * and real-time notifications for the Farmer-First Rain Alert system.
 */
export default function RainAlertWatcher() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const performCheck = async () => {
      try {
        const settings = await getRainAlertSettings(user.uid);
        if (settings && settings.alertsEnabled && settings.lat) {
          console.log("[RAIN WATCHER] Performing periodic weather check...");
          await processAlerts(user.uid, settings, t);
        }
      } catch (err) {
        console.error("RainWatcher Error:", err);
      }
    };

    // 1. Initial check + request notification permission
    performCheck();
    
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // 2. Set periodic interval (e.g., every 15 minutes)
    // For demo purposes, we can keep it relatively frequent
    intervalRef.current = setInterval(performCheck, 15 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("[RAIN WATCHER] Disabling background monitor.");
      }
    };
  }, [user]);

  // This is a headless component that manages logic only
  return null;
}
