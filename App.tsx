import React, { useState } from 'react';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CalendarView } from './components/CalendarView';
import { Header } from './components/Header';
import { QuizManager } from './components/QuizManager';
import { SettingsModal } from './components/SettingsModal';
import { useQuizzes } from './hooks/useQuizzes';
import { Quiz } from './types';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState('manager');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { 
        quizzes, 
        addQuiz, 
        updateQuiz, 
        deleteQuiz,
        saveSupabaseSettings,
        isSupabaseConfigured,
        fetchFromSupabase,
        isLoading,
        error
    } = useQuizzes();

    const renderView = () => {
        switch (currentView) {
            case 'calendar':
                return <CalendarView quizzes={quizzes} />;
            case 'analytics':
                return <AnalyticsDashboard quizzes={quizzes} />;
            case 'manager':
            default:
                return <QuizManager 
                    quizzes={quizzes} 
                    addQuiz={addQuiz} 
                    updateQuiz={updateQuiz} 
                    deleteQuiz={deleteQuiz}
                    isSupabaseConfigured={isSupabaseConfigured}
                    onSync={fetchFromSupabase}
                    isLoading={isLoading}
                    syncError={error}
                />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                <Header 
                    currentView={currentView} 
                    setCurrentView={setCurrentView} 
                    onSettingsClick={() => setIsSettingsOpen(true)}
                />
                <main>
                    {renderView()}
                </main>
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onSave={saveSupabaseSettings}
                />
            </div>
        </div>
    );
};

export default App;