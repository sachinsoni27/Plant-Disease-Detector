import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const OPENWEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "demo_key";

/**
 * Saves or updates rain alert settings for a user
 */
export const saveRainAlertSettings = async (uid, settings) => {
  try {
    const userRef = doc(db, "user_weather_settings", uid);
    await setDoc(userRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving alert settings:", error);
    throw error;
  }
};

/**
 * Retrieves rain alert settings for a user
 */
export const getRainAlertSettings = async (uid) => {
  try {
    const userRef = doc(db, "user_weather_settings", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching alert settings:", error);
    return null;
  }
};

/**
 * Fetches current weather and checks for "Alert-worthy" conditions
 * Specifically looking for Rain, Storms, or Frost risks.
 */
export const checkRainStatus = async (lat, lon) => {
  if (OPENWEATHER_API_KEY === "demo_key") {
    // Simulated rain alert for demo purposes
    return {
      hasAlert: true,
      condition: "Rain predicted in 6 hours",
      severity: "Moderate",
      message: "Expect light to moderate rain tonight. Protect your sensitive seedlings."
    };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    
    const weatherId = data.weather[0].id;
    const temp = data.main.temp;
    
    let hasAlert = false;
    let message = "";
    
    // OpenWeather Codes: 2xx (Thunder), 3xx (Drizzle), 5xx (Rain), 6xx (Snow)
    if (weatherId >= 200 && weatherId < 600) {
      hasAlert = true;
      message = "Rain/Storm detected in your area. Please take precautions for your crops.";
    } else if (temp < 5) {
      hasAlert = true;
      message = "Near-frost temperatures detected. Cold stress risk for your plants!";
    }

    return {
      hasAlert,
      condition: data.weather[0].main,
      temp: temp,
      message: message
    };
  } catch (error) {
    console.error("Weather Check Error:", error);
    return { hasAlert: false };
  }
};

/**
 * Simulates sending an SMS or WhatsApp alert
 */
export const triggerTestAlert = async (phoneNumber, message) => {
  // In a real implementation, this would call Twilio or MSG91 API
  console.log(`[SMS SERVICE] Sending alert to ${phoneNumber}: ${message}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return { success: true, provider: "Simulated SMS Gateway" };
};

/**
 * Higher-level function to check weather AND trigger notifications
 */
export const processAlerts = async (uid, settings, t) => {
  if (!settings || !settings.alertsEnabled || !settings.lat) return { checked: false };

  // Throttling: only notify once every 4 hours for the same condition
  const lastAlertKey = `last_alert_${uid}`;
  const lastAlert = localStorage.getItem(lastAlertKey);
  const now = Date.now();
  
  if (lastAlert && (now - parseInt(lastAlert)) < 4 * 60 * 60 * 1000) {
    console.log("[RAIN ALERT] Throttled: Alert already sent recently.");
    return { checked: true, throttled: true };
  }

  const status = await checkRainStatus(settings.lat, settings.lng);
  
  if (status.hasAlert) {
    console.log("[RAIN ALERT] Threat detected! Triggering notifications...");
    
    // 1. Send Simulated SMS
    await triggerTestAlert(settings.phoneNumber, `${t('weatherAlert')}: ${status.message}`);
    
    // 2. Browser Notification (if supported and permitted)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Farmer-First Rain Alert", {
        body: status.message,
        icon: "/favicon.ico"
      });
    }

    localStorage.setItem(lastAlertKey, now.toString());
    return { checked: true, alerted: true, status };
  }

  return { checked: true, alerted: false, status };
};
