import React, { useMemo, useState, useEffect } from 'react';
import { Quiz, CalendarEvent } from '../types';
import { getQuizSuggestions, getOptimalDateSuggestion } from '../services/geminiService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { getFrenchHolidays } from '../services/holidaysService';
import { WORLD_DAYS } from '../constants';
import { formatDateToFrench } from '../utils/dateFormatter';
import { formatNumberWithSpaces } from '../utils/numberFormatter';
import { getColorForTheme } from '../utils/colorUtils';

interface AnalyticsDashboardProps {
    quizzes: Quiz[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const formattedValue = name.includes('Score') ? formatNumberWithSpaces(value) : value;

    return (
      <div className="bg-gray-700 p-2 border border-gray-600 rounded text-sm">
        <p className="label text-white font-semibold">{label}</p>
        <p className="text-gray-300">{`${name}: ${formattedValue}`}</p>
      </div>
    );
  }
  return null;
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent-400"></div>
    </div>
);


export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ quizzes }) => {
    const [suggestions, setSuggestions] = useState('');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [dateSuggestion, setDateSuggestion] = useState('');
    const [isLoadingDate, setIsLoadingDate] = useState(false);
    const [topicForDate, setTopicForDate] = useState('');
    const [upcomingEvents, setUpcomingEvents] = useState<{ date: string, name: string }[]>([]);

     useEffect(() => {
        const fetchEvents = async () => {
            const today = new Date();
            // Set hours to 0 to compare dates only
            today.setHours(0,0,0,0);
            const year = today.getFullYear();
            const holidays = await getFrenchHolidays(year);
            const futureHolidays = holidays
                .filter(h => new Date(h.date) >= today)
                .map(h => ({ date: h.date, name: h.localName }));

            const futureWorldDays = WORLD_DAYS
                .map(wd => new Date(year, wd.month - 1, wd.day))
                .filter(d => d >= today)
                .map(d => ({ 
                    date: d.toISOString().split('T')[0], 
                    name: WORLD_DAYS.find(wd => wd.month === d.getMonth() + 1 && wd.day === d.getDate())?.name || ''
                }));
            
            const allEvents = [...futureHolidays, ...futureWorldDays]
                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 20); // Limit to next 20 events
            
            setUpcomingEvents(allEvents);
        };
        fetchEvents();
    }, []);

    const dataByTheme = useMemo(() => {
        const themeMap = new Map<string, number>();
        quizzes.forEach(quiz => {
            themeMap.set(quiz.theme, (themeMap.get(quiz.theme) || 0) + 1);
        });
        return Array.from(themeMap, ([name, value]) => ({ name, value }));
    }, [quizzes]);
    
    const quizzesPerMonth = useMemo(() => {
        const monthMap = new Map<string, number>();
        quizzes.forEach(quiz => {
            const month = new Date(quiz.publishDate).toLocaleString('fr-FR', { year: 'numeric', month: 'short' });
            monthMap.set(month, (monthMap.get(month) || 0) + 1);
        });
        const sortedMonths = Array.from(monthMap.entries()).sort((a, b) => {
            const dateA = new Date(`01 ${a[0].replace(' ', ' ')}`);
            const dateB = new Date(`01 ${b[0].replace(' ', ' ')}`);
            return dateA.getTime() - dateB.getTime();
        });
        return sortedMonths.map(([name, quizCount]) => ({ name, quizCount }));

    }, [quizzes]);

    const performanceOverTime = useMemo(() => {
        return [...quizzes]
            .sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime())
            .map(q => ({
                date: formatDateToFrench(q.publishDate),
                score: q.averageScore,
                title: q.title,
            }));
    }, [quizzes]);

    const handleGetSuggestions = async () => {
        setIsLoadingSuggestions(true);
        const result = await getQuizSuggestions(quizzes, upcomingEvents);
        setSuggestions(result);
        setIsLoadingSuggestions(false);
    };

    const handleGetDateSuggestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topicForDate) return;
        setIsLoadingDate(true);
        const result = await getOptimalDateSuggestion(topicForDate, quizzes, upcomingEvents);
        setDateSuggestion(result);
        setIsLoadingDate(false);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Analyse et Suggestions</h1>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Quiz par Thème</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={dataByTheme} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {dataByTheme.map((entry, index) => <Cell key={`cell-${index}`} fill={getColorForTheme(entry.name)} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Quiz publiés par mois</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={quizzesPerMonth}>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(14, 165, 233, 0.1)'}}/>
                            <Legend />
                            <Bar dataKey="quizCount" name="Nombre de Quiz" fill="#0ea5e9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-gray-800 p-6 rounded-lg shadow-lg lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Performance au fil du temps</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceOverTime}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#0ea5e9', strokeWidth: 1}}/>
                            <Legend />
                            <Line type="monotone" dataKey="score" name="Score (votes)" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Suggestions Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Idées de quiz (IA)</h2>
                    <button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="w-full px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors font-semibold disabled:bg-gray-600">
                        Générer des suggestions
                    </button>
                    <div className="mt-4 p-4 bg-gray-900 rounded-md min-h-[200px] prose prose-invert prose-sm max-w-none">
                        {isLoadingSuggestions ? <LoadingSpinner /> : <div dangerouslySetInnerHTML={{ __html: suggestions.replace(/\n/g, '<br />') }} />}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Suggestion de date de publication (IA)</h2>
                    <form onSubmit={handleGetDateSuggestion}>
                        <input type="text" value={topicForDate} onChange={e => setTopicForDate(e.target.value)} placeholder="Entrez un sujet de quiz..." className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                        <button type="submit" disabled={isLoadingDate || !topicForDate} className="w-full px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors font-semibold disabled:bg-gray-600">
                           Trouver la date optimale
                        </button>
                    </form>
                    <div className="mt-4 p-4 bg-gray-900 rounded-md min-h-[200px] prose prose-invert prose-sm max-w-none">
                       {isLoadingDate ? <LoadingSpinner /> : <div dangerouslySetInnerHTML={{ __html: dateSuggestion.replace(/\n/g, '<br />') }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};