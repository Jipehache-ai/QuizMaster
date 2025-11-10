import React, { useState, useMemo } from 'react';
import { Quiz } from '../types';
import { formatDateToFrench } from '../utils/dateFormatter';
import { formatNumberWithSpaces } from '../utils/numberFormatter';
import { getColorForTheme } from '../utils/colorUtils';

interface QuizTableProps {
    quizzes: Quiz[];
    onEdit: (quiz: Quiz) => void;
    onDelete: (id: string) => void;
    isReadOnly?: boolean;
}

type SortKey = keyof Quiz;
type SortOrder = 'asc' | 'desc';

export const QuizTable: React.FC<QuizTableProps> = ({ quizzes, onEdit, onDelete, isReadOnly = false }) => {
    const [filter, setFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('publishDate');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const sortedAndFilteredQuizzes = useMemo(() => {
        return quizzes
            .filter(quiz => 
                quiz.title.toLowerCase().includes(filter.toLowerCase()) ||
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
                            {['title', 'theme', 'publishDate', 'averageScore'].map(key => (
                                <th key={key} className="p-3 cursor-pointer" onClick={() => handleSort(key as SortKey)}>
                                    { {title: 'Titre', theme: 'Thème', publishDate: 'Date', averageScore: 'Score'}[key] }
                                    <SortIndicator columnKey={key as SortKey} />
                                </th>
                            ))}
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredQuizzes.map(quiz => (
                            <tr key={quiz.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-3">{quiz.title}</td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <span 
                                            className="h-3 w-3 rounded-full mr-2 flex-shrink-0" 
                                            style={{ backgroundColor: getColorForTheme(quiz.theme) }}>
                                        </span>
                                        {quiz.theme}
                                    </div>
                                </td>
                                <td className="p-3">{formatDateToFrench(quiz.publishDate)}</td>
                                <td className="p-3 font-semibold">{formatNumberWithSpaces(quiz.averageScore)}</td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => onEdit(quiz)} 
                                        disabled={isReadOnly}
                                        className="text-brand-accent-400 hover:text-brand-accent-300 mr-2 disabled:text-gray-500 disabled:cursor-not-allowed">
                                        Modifier
                                    </button>
                                    <button 
                                        onClick={() => window.confirm('Êtes-vous sûr ?') && onDelete(quiz.id)}
                                        disabled={isReadOnly}
                                        className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};