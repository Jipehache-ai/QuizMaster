import { useState, useEffect, useCallback } from 'react';
import { Quiz, SupabaseSettings } from '../types';
import { MOCK_QUIZZES } from '../constants';
import { fetchQuizzesFromSupabase } from '../services/supabaseService';

const SUPABASE_SETTINGS_KEY = 'supabaseSettings';

const getStoredSupabaseSettings = (): SupabaseSettings | null => {
  try {
    const storedSettings = localStorage.getItem(SUPABASE_SETTINGS_KEY);
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
  } catch (e) {
    console.error("Failed to parse Supabase settings from localStorage", e);
  }
  return null;
};


export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const settings = getStoredSupabaseSettings();
    if (settings && settings.url && settings.anonKey && settings.tableName) {
      setIsSupabaseConfigured(true);
    }
  }, []);

  const saveSupabaseSettings = (settings: SupabaseSettings) => {
    localStorage.setItem(SUPABASE_SETTINGS_KEY, JSON.stringify(settings));
    if (settings.url && settings.anonKey && settings.tableName) {
      setIsSupabaseConfigured(true);
      // Automatically fetch after saving new settings
      handleFetchFromSupabase();
    } else {
      setIsSupabaseConfigured(false);
    }
  };

  const handleFetchFromSupabase = useCallback(async () => {
    const settings = getStoredSupabaseSettings();
    if (!settings || !settings.url || !settings.anonKey || !settings.tableName) {
      setError("La configuration de Supabase est manquante ou incomplète. Veuillez la vérifier dans les paramètres (roue crantée).");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuizzes = await fetchQuizzesFromSupabase(settings);
      setQuizzes(fetchedQuizzes);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const addQuiz = (quiz: Omit<Quiz, 'id'>) => {
    if (isSupabaseConfigured) return; // Prevent adding if connected to DB
    const newQuiz = { ...quiz, id: new Date().toISOString() + Math.random() };
    setQuizzes(prev => [...prev, newQuiz].sort((a,b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
     if (isSupabaseConfigured) return; // Prevent editing if connected to DB
    setQuizzes(prev => prev.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
  };

  const deleteQuiz = (id: string) => {
     if (isSupabaseConfigured) return; // Prevent deleting if connected to DB
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };

  return {
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    saveSupabaseSettings,
    isSupabaseConfigured,
    fetchFromSupabase: handleFetchFromSupabase,
    isLoading,
    error,
  };
};