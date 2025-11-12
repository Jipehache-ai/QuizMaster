// src/hooks/useQuizzes.ts

import { useState, useEffect, useCallback } from 'react';
import { Quiz } from '../types';
import { supabase } from '../services/supabaseClient';

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // MODIFIÉ ICI : On spécifie le mapping de quiz_date vers quizDate
      const { data, error: dbError } = await supabase
        .from('quizzes')
        // La syntaxe 'quizDate:quiz_date' fait le mapping pour nous !
        .select('id, nom, theme, quizDate:quiz_date, votes')
        // MODIFIÉ ICI : On utilise le vrai nom de colonne pour le tri
        .order('quiz_date', { ascending: false });

      if (dbError) throw dbError;
      
      setQuizzes(data || []);

    } catch (err: any) {
      console.error('Error fetching quizzes from Supabase:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const addQuiz = async (quiz: Omit<Quiz, 'id'>) => {
    try {
      setLoading(true);
      
      // MODIFIÉ ICI : On transforme l'objet avant de l'envoyer à Supabase
      const { quizDate, ...rest } = quiz;
      const quizToInsert = { ...rest, quiz_date: quizDate };

      const { data, error: dbError } = await supabase
        .from('quizzes')
        .insert([quizToInsert])
        .select('id, nom, theme, quizDate:quiz_date, votes') // On récupère aussi les données mappées
        .single();

      if (dbError) throw dbError;

      if (data) {
        setQuizzes(prevQuizzes => [data, ...prevQuizzes].sort((a,b) => new Date(b.quizDate).getTime() - new Date(a.quizDate).getTime()));
      }
    } catch (err: any) {
       console.error('Error adding quiz:', err);
       setError(err as Error);
    } finally {
        setLoading(false);
    }
  };

  const updateQuiz = async (updatedQuiz: Quiz) => {
    try {
        setLoading(true);

        // MODIFIÉ ICI : On transforme l'objet avant de l'envoyer à Supabase
        const { quizDate, ...rest } = updatedQuiz;
        const quizToUpdate = { ...rest, quiz_date: quizDate };

        const { data, error: dbError } = await supabase
            .from('quizzes')
            .update(quizToUpdate)
            .eq('id', updatedQuiz.id)
            .select('id, nom, theme, quizDate:quiz_date, votes')
            .single();
        
        if (dbError) throw dbError;

        if (data) {
            setQuizzes(prevQuizzes => prevQuizzes.map(q => q.id === data.id ? data : q));
        }
    } catch (err: any) {
        console.error('Error updating quiz:', err);
        setError(err as Error);
    } finally {
        setLoading(false);
    }
  };

  const deleteQuiz = async (quizId: string) => {
     try {
        setLoading(true);
        const { error: dbError } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', quizId);
        
        if (dbError) throw dbError;

        setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== quizId));
    } catch (err: any) {
        console.error('Error deleting quiz:', err);
        setError(err as Error);
    } finally {
        setLoading(false);
    }
  };

  return { quizzes, loading, error, addQuiz, updateQuiz, deleteQuiz, refetchQuizzes: fetchQuizzes };
};