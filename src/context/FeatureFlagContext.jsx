import React, { createContext, useContext, useState, useEffect } from 'react';

const FeatureFlagContext = createContext();

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

export const FeatureFlagProvider = ({ children }) => {
  // CONFIG: Initial feature states (Production Ready)
  const [flags, setFlags] = useState({
    weatherPrediction: true,
    notifications: true,
    aiChatbotMemory: true,
    userAnalytics: true,
    offlineDetection: false, // Experimental
    arScanning: false,      // Experimental
    yieldProjection: true,
    carbonCalculator: true,
    diseaseMap: true
  });

  // Potential for dynamic fetching from a remote config (Firebase Remote Config)
  useEffect(() => {
    const fetchRemoteFlags = async () => {
      // Simulate remote fetch
      // const remoteFlags = await getRemoteConfig();
      // setFlags(f => ({ ...f, ...remoteFlags }));
    };
    fetchRemoteFlags();
  }, []);

  const isEnabled = (featureName) => {
    return !!flags[featureName];
  };

  const toggleFeature = (featureName) => {
    setFlags(prev => ({
      ...prev,
      [featureName]: !prev[featureName]
    }));
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, isEnabled, toggleFeature }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
