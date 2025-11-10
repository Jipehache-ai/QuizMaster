import React, { useState, useEffect, useMemo } from 'react';
import { Quiz, Holiday, CalendarEvent } from '../types';
import { getFrenchHolidays } from '../services/holidaysService';
import { WORLD_DAYS } from '../constants';
import { getColorForTheme } from '../utils/colorUtils';

interface CalendarViewProps {
    quizzes: Quiz[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ quizzes }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const quizzesById = useMemo(() => {
        return new Map(quizzes.map(q => [q.id, q]));
    }, [quizzes]);

    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const fetchAndSetEvents = async () => {
            const year = viewDate.getFullYear();
            const holidays: Holiday[] = await getFrenchHolidays(year);

            const holidayEvents: CalendarEvent[] = holidays.map(h => ({
                date: new Date(h.date).toISOString(),
                title: h.localName,
                type: 'holiday',
            }));
            
            const worldDayEvents: CalendarEvent[] = WORLD_DAYS.map(wd => {
                const date = new Date(Date.UTC(year, wd.month - 1, wd.day));
                return {
                    date: date.toISOString(),
                    title: wd.name,
                    type: 'world-day',
                };
            });
            
            const quizEvents: CalendarEvent[] = quizzes.map(q => ({
                date: new Date(q.publishDate).toISOString(),
                title: q.title,
                type: 'quiz',
                quizId: q.id,
            }));

            setEvents([...holidayEvents, ...worldDayEvents, ...quizEvents]);
        };

        fetchAndSetEvents();
    }, [quizzes, viewDate]);

    const { days, currentMonth } = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const startOfMonth = new Date(Date.UTC(year, month, 1));
        const endOfMonth = new Date(Date.UTC(year, month + 1, 0));
        
        const startDate = new Date(startOfMonth);
        const dayOfWeek = startDate.getUTCDay(); // 0=Sun, 1=Mon...
        startDate.setUTCDate(startDate.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const endDate = new Date(endOfMonth);
        const endDayOfWeek = endDate.getUTCDay();
        if (endDayOfWeek !== 0) { // If not Sunday
            endDate.setUTCDate(endDate.getUTCDate() + (7 - endDayOfWeek));
        }

        const calendarDays = [];
        let day = new Date(startDate);
        while (day <= endDate) {
            calendarDays.push(new Date(day));
            day.setUTCDate(day.getUTCDate() + 1);
        }
        return { days: calendarDays, currentMonth: month };
    }, [viewDate]);
    
    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        events.forEach(event => {
            const dateStr = new Date(event.date).toISOString().split('T')[0];
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)?.push(event);
        });
        return map;
    }, [events]);

    const changeMonth = (offset: number) => {
        setViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset, 1);
            return newDate;
        });
    };

    const getEventTypeStyles = (type: CalendarEvent['type']) => {
        switch (type) {
            case 'holiday':
                return 'bg-green-600/80 border-green-400';
            case 'world-day':
                return 'bg-purple-600/80 border-purple-400';
            default:
                return 'bg-gray-600/80 border-gray-400';
        }
    };
    
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">&lt; Précédent</button>
                <h2 className="text-2xl font-bold capitalize">
                    {viewDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">Suivant &gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center font-semibold">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d => <div key={d} className="py-2 text-gray-400 text-sm">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days.map(d => {
                    const dateStr = d.toISOString().split('T')[0];
                    const dayEvents = eventsByDate.get(dateStr) || [];
                    const isCurrentMonth = d.getUTCMonth() === currentMonth;
                    const isToday = dateStr === todayStr;

                    return (
                        <div 
                            key={dateStr} 
                            className={`relative min-h-[120px] p-2 border border-gray-700 rounded-lg overflow-hidden transition-colors ${isCurrentMonth ? 'bg-gray-900/50' : 'bg-gray-800/30 text-gray-500'}`}
                        >
                            <span className={`font-bold ${isToday ? 'bg-brand-accent-500 text-white rounded-full h-7 w-7 flex items-center justify-center' : ''}`}>
                                {d.getUTCDate()}
                            </span>
                            <div className="mt-2 space-y-1 overflow-y-auto max-h-24 pr-1">
                                {dayEvents.map((event, index) => {
                                    const quiz = event.type === 'quiz' ? quizzesById.get(event.quizId!) : undefined;
                                    const bgColor = quiz?.theme ? getColorForTheme(quiz.theme) : undefined;
                                    
                                    return (
                                        <div 
                                            key={index}
                                            title={event.title}
                                            className={`text-xs p-1.5 rounded-md truncate text-left text-white ${!bgColor ? getEventTypeStyles(event.type) : ''}`}
                                            style={bgColor ? { backgroundColor: bgColor, opacity: 0.9 } : {}}
                                        >
                                           <span className="font-semibold">{event.type === 'quiz' ? 'Q:' : ''}</span> {event.title}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};