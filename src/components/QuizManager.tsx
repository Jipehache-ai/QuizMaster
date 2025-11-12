import React, { useState } from 'react';
import { Quiz } from '../types';
import { QuizTable } from './QuizTable';
import { QuizForm } from './QuizForm';

interface QuizManagerProps {
    quizzes: Quiz[];
    addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
    updateQuiz: (quiz: Quiz) => void;
    deleteQuiz: (id: string) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}

const RefreshIcon = ({ refreshing }: { refreshing: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m-5-5a12 12 0 0119.53 7.5M20 20v-5h-5m5 5a12 12 0 01-19.53-7.5" />
    </svg>
);


export const QuizManager: React.FC<QuizManagerProps> = ({ quizzes, addQuiz, updateQuiz, deleteQuiz, onRefresh, isRefreshing }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

    const handleAddNew = () => {
        setEditingQuiz(null);
        setIsFormVisible(true);
    };

    const handleEdit = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setIsFormVisible(true);
    }

    const handleSave = (quizData: Omit<Quiz, 'id'> | Quiz) => {
        if ('id' in quizData) {
            updateQuiz(quizData as Quiz);
        } else {
            addQuiz(quizData);
        }
        setIsFormVisible(false);
        setEditingQuiz(null);
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Gestion des Quiz</h1>
                {!isFormVisible && (
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={onRefresh} 
                            disabled={isRefreshing}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshIcon refreshing={isRefreshing} />
                            <span>{isRefreshing ? 'Chargement...' : 'Synchroniser'}</span>
                        </button>
                        <button onClick={handleAddNew} className="px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors font-semibold">
                            Ajouter un Quiz
                        </button>
                    </div>
                )}
            </div>
            
            {isFormVisible ? (
                <QuizForm 
                    onSave={handleSave} 
                    onCancel={() => { setIsFormVisible(false); setEditingQuiz(null); }}
                    initialData={editingQuiz}
                />
            ) : (
                <QuizTable quizzes={quizzes} onEdit={handleEdit} onDelete={deleteQuiz} />
            )}
        </div>
    );
};