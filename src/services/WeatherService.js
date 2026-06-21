// Advanced Weather Analysis Service for Plant Health Prediction
const OPENWEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "demo_key"; 

export const getWeatherRisk = async (lat, lon) => {
  try {
    // If no key, return simulated high-value data for demo
    if (OPENWEATHER_API_KEY === "demo_key") {
      return {
        temp: 28,
        humidity: 85,
        condition: "Humid",
        riskLevel: "High",
        riskFactor: "Fungal Growth",
        advice: "High humidity detected. Prune leaves for better airflow and avoid overhead watering."
      };
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();

    const humidity = data.main.humidity;
    const temp = data.main.temp;
    
    let riskLevel = "Low";
    let riskFactor = "None";
    let advice = "Weather conditions are optimal for plant health.";

    if (humidity > 80 && temp > 25) {
      riskLevel = "High";
      riskFactor = "Fungal Infections (Powdery Mildew)";
      advice = "Conditions are perfect for fungal growth. Increase ventilation and monitor lower leaves.";
    } else if (temp > 35) {
      riskLevel = "Moderate";
      riskFactor = "Heat Stress / Wilting";
      advice = "Extreme heat detected. Ensure deep watering during early morning/late evening.";
    } else if (humidity < 30) {
      riskLevel = "Moderate";
      riskFactor = "Spider Mites / Dehydration";
      advice = "Very dry air. Consider misting non-sensitive plants or using a humidifier.";
    }

    return {
      temp,
      humidity,
      condition: data.weather[0].main,
      riskLevel,
      riskFactor,
      advice
    };
  } catch (error) {
    console.error("Weather Service Error:", error);
    return null;
  }
};
