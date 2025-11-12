import React, { useState, useEffect } from 'react';
import { Quiz } from '../types';

interface QuizFormProps {
    onSave: (quiz: Omit<Quiz, 'id'> | Quiz) => void;
    onCancel: () => void;
    initialData?: Quiz | null;
}

export const QuizForm: React.FC<QuizFormProps> = ({ onSave, onCancel, initialData }) => {
    const [nom, setNom] = useState('');
    const [theme, setTheme] = useState('');
    const [quizDate, setQuizDate] = useState('');
    const [votes, setVotes] = useState(0);

    useEffect(() => {
        if (initialData) {
            setNom(initialData.nom);
            setTheme(initialData.theme);
            setQuizDate(initialData.quizDate.split('T')[0]);
            setVotes(initialData.votes);
        } else {
            setNom('');
            setTheme('');
            setQuizDate(new Date().toISOString().split('T')[0]);
            setVotes(0);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const quizData = {
            nom,
            theme,
            quizDate: new Date(quizDate).toISOString(),
            votes
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
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                        <input type="text" id="nom" value={nom} onChange={e => setNom(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    </div>
                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-1">Thème</label>
                        <input type="text" id="theme" value={theme} onChange={e => setTheme(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quizDate" className="block text-sm font-medium text-gray-300 mb-1">Date du quiz</label>
                        <input type="date" id="quizDate" value={quizDate} onChange={e => setQuizDate(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    </div>
                    <div>
                        <label htmlFor="votes" className="block text-sm font-medium text-gray-300 mb-1">Votes</label>
                        <input type="number" id="votes" value={votes} onChange={e => setVotes(Number(e.target.value))} min="0" required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
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