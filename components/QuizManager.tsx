import React, { useState } from 'react';
import { QuizTable } from './QuizTable';
import { QuizForm } from './QuizForm';
import { Quiz } from '../types';

interface QuizManagerProps {
    quizzes: Quiz[];
    addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
    updateQuiz: (quiz: Quiz) => void;
    deleteQuiz: (id: string) => void;
    isSupabaseConfigured: boolean;
    onSync: () => void;
    isLoading: boolean;
    syncError: string | null;
}

export const QuizManager: React.FC<QuizManagerProps> = ({ 
    quizzes, 
    addQuiz, 
    updateQuiz, 
    deleteQuiz, 
    isSupabaseConfigured,
    onSync,
    isLoading,
    syncError
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleAddNew = () => {
    if (isSupabaseConfigured) return;
    setEditingQuiz(null);
    setIsFormVisible(true);
  };

  const handleEdit = (quiz: Quiz) => {
    if (isSupabaseConfigured) return;
    setEditingQuiz(quiz);
    setIsFormVisible(true);
  };

  const handleSave = (quiz: Omit<Quiz, 'id'> | Quiz) => {
    if ('id' in quiz) {
      updateQuiz(quiz);
    } else {
      addQuiz(quiz);
    }
    setIsFormVisible(false);
    setEditingQuiz(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingQuiz(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Quiz</h1>
          {isSupabaseConfigured && (
            <p className="text-sm text-green-400">Connecté à Supabase. Les données sont en lecture seule.</p>
          )}
        </div>
        {!isFormVisible && (
          <div className="flex items-center space-x-2">
            {isSupabaseConfigured && (
              <button
                onClick={onSync}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:bg-gray-500"
              >
                {isLoading ? 'Synchronisation...' : 'Synchroniser'}
              </button>
            )}
            <button
              onClick={handleAddNew}
              disabled={isSupabaseConfigured}
              className="px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              title={isSupabaseConfigured ? "Désactivé car connecté à Supabase" : "Ajouter un nouveau quiz"}
            >
              Ajouter un Quiz
            </button>
          </div>
        )}
      </div>

      {syncError && <div className="bg-red-800 border border-red-600 text-white p-3 rounded-md">{syncError}</div>}

      {isFormVisible ? (
        <QuizForm onSave={handleSave} onCancel={handleCancel} initialData={editingQuiz} />
      ) : (
        <QuizTable 
            quizzes={quizzes} 
            onEdit={handleEdit} 
            onDelete={deleteQuiz} 
            isReadOnly={isSupabaseConfigured}
        />
      )}
    </div>
  );
};