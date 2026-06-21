import { useState, useCallback } from 'react';

const STORAGE_KEY = 'plantai_history';

// Load history from localStorage, scoped to a userId
const loadHistory = (userId) => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Save history to localStorage
const saveHistory = (userId, history) => {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(history));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
};

export function useLocalHistory(userId) {
  const [history, setHistory] = useState(() => loadHistory(userId));

  // Add a new entry. Deduplication: skip if same disease within last 5 seconds.
  const addEntry = useCallback((entry) => {
    setHistory(prev => {
      const now = Date.now();
      const isDuplicate = prev.length > 0 &&
        prev[0].disease === entry.disease &&
        now - prev[0].createdAt < 5000;

      if (isDuplicate) return prev;

      const newEntry = { ...entry, id: `${now}_${Math.random().toString(36).slice(2)}`, createdAt: now };
      const updated = [newEntry, ...prev].slice(0, 100); // Keep max 100 items
      saveHistory(userId, updated);
      return updated;
    });
  }, [userId]);

  // Delete a single entry
  const deleteEntry = useCallback((id) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveHistory(userId, updated);
      return updated;
    });
  }, [userId]);

  // Clear all history
  const clearAll = useCallback(() => {
    setHistory([]);
    saveHistory(userId, []);
  }, [userId]);

  return { history, addEntry, deleteEntry, clearAll };
}
