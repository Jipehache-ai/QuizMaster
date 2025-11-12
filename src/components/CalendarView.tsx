import React, { useState, useEffect, useMemo } from 'react';
import { Quiz, Holiday, CalendarEvent } from '../types';
import { getFrenchHolidays } from '../services/holidaysService';
import { WORLD_DAYS } from '../constants';

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const getLocalDateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
};

interface CalendarViewProps {
    quizzes: Quiz[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ quizzes }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [personalEvents, setPersonalEvents] = useState<CalendarEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [eventTitle, setEventTitle] = useState('');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        getFrenchHolidays(year).then(setHolidays);
    }, [year]);

    const calendarEvents = useMemo(() => {
        const events: Record<string, CalendarEvent[]> = {};
        const addEvent = (date: Date, event: Omit<CalendarEvent, 'date'>) => {
            if (isNaN(date.getTime())) return;
            const key = getLocalDateKey(date);
            if (!events[key]) events[key] = [];
            events[key].push({ ...event, date: date.toISOString() });
        };

        quizzes.forEach(q => addEvent(new Date(q.quizDate), { title: q.nom, type: 'quiz', quizId: q.id }));
        
        holidays.forEach(h => {
            const dateParts = h.date.split('-').map(Number);
            const holidayDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            addEvent(holidayDate, { title: h.localName, type: 'holiday' });
        });

        WORLD_DAYS.forEach(wd => {
            addEvent(new Date(year, wd.month - 1, wd.day), { title: wd.name, type: 'world-day' });
        });
        
        personalEvents.forEach(pe => {
            addEvent(new Date(pe.date), { title: pe.title, type: 'personal' });
        });

        return events;
    }, [quizzes, holidays, year, personalEvents]);

    const handleAddEventClick = (day: number) => {
        setSelectedDate(new Date(year, month, day));
        setIsModalOpen(true);
    };

    const handleSaveEvent = () => {
        if (selectedDate && eventTitle) {
            setPersonalEvents([...personalEvents, {
                date: selectedDate.toISOString(),
                title: eventTitle,
                type: 'personal'
            }]);
            setEventTitle('');
            setIsModalOpen(false);
            setSelectedDate(null);
        }
    };
    
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(year, month);
        let firstDay = getFirstDayOfMonth(year, month);
        firstDay = firstDay === 0 ? 6 : firstDay - 1;

        const blanks = Array(firstDay).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return [...blanks, ...days].map((day, index) => {
            if (!day) return <div key={`blank-${index}`} className="border border-gray-700/50"></div>;

            const dayDate = new Date(year, month, day);
            const dateKey = getLocalDateKey(dayDate);
            const dayEvents = calendarEvents[dateKey] || [];
            
            const isToday = getLocalDateKey(new Date()) === dateKey;

            return (
                <div key={day} className={`border border-gray-700/50 p-2 flex flex-col min-h-[120px] relative transition-colors duration-200 ${isToday ? 'bg-gray-700' : 'bg-gray-800'}`}>
                     <button onClick={() => handleAddEventClick(day)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-brand-accent-600 hover:bg-brand-accent-500 flex items-center justify-center text-white text-lg font-bold transition-transform transform hover:scale-110">+</button>
                    <time dateTime={dateKey} className={`font-bold ${isToday ? 'text-brand-accent-400' : ''}`}>{day}</time>
                    <div className="mt-1 flex-grow overflow-y-auto text-xs space-y-1">
                        {dayEvents.map((event, i) => (
                           <div key={i} className={`p-1 rounded truncate ${
                               event.type === 'quiz' ? 'bg-green-600' :
                               event.type === 'holiday' ? 'bg-blue-600' :
                               event.type === 'world-day' ? 'bg-purple-600' :
                               'bg-yellow-600'
                           } text-white`}>
                               {event.title}
                           </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="px-4 py-2 bg-brand-accent-600 rounded hover:bg-brand-accent-500 transition-colors">Précédent</button>
                <h2 className="text-2xl font-bold capitalize">{new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate)}</h2>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="px-4 py-2 bg-brand-accent-600 rounded hover:bg-brand-accent-500 transition-colors">Suivant</button>
            </div>
            <div className="grid grid-cols-7 gap-px">
                {dayNames.map(day => <div key={day} className="text-center font-semibold text-gray-400 py-2">{day}</div>)}
                {renderCalendar()}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Ajouter un événement</h3>
                        <p className="text-gray-400 mb-4">Date : {selectedDate?.toLocaleDateString('fr-FR')}</p>
                        <input
                            type="text"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                            placeholder="Titre de l'événement"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-500"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">Annuler</button>
                            <button onClick={handleSaveEvent} className="px-4 py-2 bg-brand-accent-600 rounded hover:bg-brand-accent-500 transition-colors">Sauvegarder</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};