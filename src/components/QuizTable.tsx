import React, { useState, useMemo } from 'react';
import { Quiz } from '../types';

interface QuizTableProps {
    quizzes: Quiz[];
    onEdit: (quiz: Quiz) => void;
    onDelete: (id: string) => void;
}

type SortKey = keyof Quiz;
type SortOrder = 'asc' | 'desc';

export const QuizTable: React.FC<QuizTableProps> = ({ quizzes, onEdit, onDelete }) => {
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('quizDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const sortedAndFilteredQuizzes = useMemo(() => {
        return quizzes
            .filter(quiz => 
                quiz.nom.toLowerCase().includes(filter.toLowerCase()) ||
                quiz.theme.toLowerCase().includes(filter.toLowerCase())
            )
            .sort((a, b) => {
                const aValue = a[sortKey];
                const bValue = b[sortKey];

                if (aValue < bValue) {
                    return sortOrder === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortOrder === 'asc' ? 1 : -1;
                }
                return 0;
            });
    }, [quizzes, filter, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };
    
    const SortIndicator = ({ columnKey }: { columnKey: SortKey }) => {
        if (sortKey !== columnKey) return null;
        return <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>;
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="mb-4">
                 <input 
                    type="text"
                    placeholder="Filtrer les quiz..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full max-w-sm bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr>
                            {['nom', 'theme', 'quizDate', 'votes'].map(key => (
                                <th key={key} className="p-3 cursor-pointer" onClick={() => handleSort(key as SortKey)}>
                                    { {nom: 'Nom', theme: 'Thème', quizDate: 'Date', votes: 'Votes'}[key] }
                                    <SortIndicator columnKey={key as SortKey} />
                                </th>
                            ))}
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredQuizzes.map(quiz => (
                            <tr key={quiz.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-3">{quiz.nom}</td>
                                <td className="p-3">{quiz.theme}</td>
                                <td className="p-3">{new Date(quiz.quizDate).toLocaleDateString('fr-FR')}</td>
                                <td className="p-3 font-semibold">{quiz.votes}</td>
                                <td className="p-3">
                                    <button onClick={() => onEdit(quiz)} className="text-brand-accent-400 hover:text-brand-accent-300 mr-2">Modifier</button>
                                    <button onClick={() => window.confirm('Êtes-vous sûr ?') && onDelete(quiz.id)} className="text-red-500 hover:text-red-400">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};