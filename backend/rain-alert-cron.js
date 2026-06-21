/**
 * Rain Alert Background Scheduler (Reference Script)
 * 
 * This script is designed to run as a Firebase Cloud Function (Scheduled Function).
 * It runs every 4 hours, checks weather for all opted-in users, and sends alerts.
 * 
 * Deployment: Use 'firebase deploy --only functions'
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const SMS_API_KEY = process.env.SMS_API_KEY; // e.g., Twilio or MSG91

exports.checkWeatherAndNotify = functions.pubsub
  .schedule('every 4 hours')
  .onRun(async (context) => {
    const db = admin.firestore();
    const snapshot = await db.collection('user_weather_settings')
      .where('alertsEnabled', '==', true)
      .get();

    if (snapshot.empty) {
      console.log('No users with active weather alerts.');
      return null;
    }

    const alertPromises = [];

    snapshot.forEach(doc => {
      const userData = doc.data();
      const { phoneNumber, lat, lng, lastAlertSent } = userData;

      if (!lat || !lng || !phoneNumber) return;

      // Logic to prevent spam: Only alert once per 12 hours unless it's an emergency
      const now = Date.now();
      const twelveHoursAgo = now - (12 * 60 * 60 * 1000);
      if (lastAlertSent && lastAlertSent.toDate().getTime() > twelveHoursAgo) {
        return;
      }

      alertPromises.push(processUserAlert(doc.id, phoneNumber, lat, lng));
    });

    return Promise.all(alertPromises);
  });

async function processUserAlert(userId, phoneNumber, lat, lng) {
  try {
    // 1. Fetch Weather
    const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`);
    const weather = weatherRes.data;
    const weatherId = weather.weather[0].id;
    
    // 2. Check Conditions (Rain: 2xx, 3xx, 5xx)
    if (weatherId >= 200 && weatherId < 600) {
      const message = `Alert: Aapke area me barish ka khatra hai. Kripya apni fasal ko surakshit karein. (Rain Alert - PlantAI)`;
      
      // 3. Send SMS (Placeholder for Twilio/MSG91)
      console.log(`Sending Alert to ${phoneNumber}: ${message}`);
      // await sendSms(phoneNumber, message);
      
      // 4. Update lastAlertSent
      await admin.firestore().collection('user_weather_settings').doc(userId).update({
        lastAlertSent: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  } catch (error) {
    console.error(`Error processing alert for ${userId}:`, error);
  }
}

/**
 * Placeholder for SMS API integration
 */
async function sendSms(to, message) {
  // Example for MSG91 / Twilio
  // return axios.post('https://api.msg91.com/api/v5/flow/', { ... });
}
