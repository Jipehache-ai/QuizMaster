import React, { useState, useEffect } from 'react';
import { Quiz } from '../types';

interface QuizFormProps {
    onSave: (quiz: Omit<Quiz, 'id'> | Quiz) => void;
    onCancel: () => void;
    initialData?: Quiz | null;
}

export const QuizForm: React.FC<QuizFormProps> = ({ onSave, onCancel, initialData }) => {
    const [title, setTitle] = useState('');
    const [theme, setTheme] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [averageScore, setAverageScore] = useState(0);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setTheme(initialData.theme);
            setPublishDate(initialData.publishDate.split('T')[0]);
            setAverageScore(initialData.averageScore);
        } else {
            // Reset form for new entry
            setTitle('');
            setTheme('');
            setPublishDate(new Date().toISOString().split('T')[0]);
            setAverageScore(0);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const quizData = {
            title,
            theme,
            publishDate: new Date(publishDate).toISOString(),
            averageScore
        };

        if (initialData) {
            onSave({ ...quizData, id: initialData.id });
        } else {
            onSave(quizData);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">{initialData ? 'Modifier le Quiz' : 'Ajouter un nouveau Quiz'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                </div>
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-1">Thème</label>
                    <input type="text" id="theme" value={theme} onChange={e => setTheme(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="publishDate" className="block text-sm font-medium text-gray-300 mb-1">Date de parution</label>
                        <input type="date" id="publishDate" value={publishDate} onChange={e => setPublishDate(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    </div>
                    <div>
                        <label htmlFor="averageScore" className="block text-sm font-medium text-gray-300 mb-1">Score (votes)</label>
                        <input type="number" id="averageScore" value={averageScore} onChange={e => setAverageScore(Number(e.target.value))} min="0" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors">Annuler</button>
                    <button type="submit" className="px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors">Sauvegarder</button>
                </div>
            </form>
        </div>
    );
};