import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { QuizManager } from './components/QuizManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { useQuizzes } from './hooks/useQuizzes';
import { Section, GitSettings } from './types';
import { GitSettingsModal } from './components/GitSettingsModal';

const GIT_SETTINGS_KEY = 'gitSettings';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-brand-accent-500"></div>
    </div>
);

const ErrorMessage = ({ error, onResetSettings }: { error: Error, onResetSettings: () => void }) => (
    <div className="flex justify-center items-center h-screen p-4 sm:p-8">
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-6 sm:px-6 rounded-lg shadow-xl max-w-2xl text-center">
            <strong className="font-bold text-xl block">Oops! Une erreur est survenue.</strong>
            <span className="block sm:inline mt-2">Impossible de communiquer avec l'API GitHub.</span>
            <details className="mt-4 text-left bg-gray-800 p-3 rounded-md text-sm">
                <summary className="cursor-pointer font-semibold text-gray-300">Afficher les détails techniques</summary>
                <pre className="text-xs whitespace-pre-wrap mt-2 font-mono">{error.message}</pre>
            </details>
             <p className="mt-4 text-sm text-gray-300">
                Action recommandée : Veuillez vérifier vos paramètres GitHub (Token, nom du dépôt, etc.) en cliquant sur le bouton ci-dessous.
             </p>
             <button onClick={onResetSettings} className="mt-4 px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors font-semibold">
                Modifier les paramètres
            </button>
        </div>
    </div>
);


const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('calendar');
  const [settings, setSettings] = useState<GitSettings | null>(() => {
    const stored = localStorage.getItem(GIT_SETTINGS_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(!settings);
  
  const { quizzes, loading, error, addQuiz, updateQuiz, deleteQuiz, refetchQuizzes } = useQuizzes(settings);

  useEffect(() => {
    setIsSettingsModalOpen(!settings);
  }, [settings]);

  const handleSaveSettings = (newSettings: GitSettings) => {
    localStorage.setItem(GIT_SETTINGS_KEY, JSON.stringify(newSettings));
    setSettings(newSettings);
    setIsSettingsModalOpen(false);
  };
  
  const handleOpenSettings = () => setIsSettingsModalOpen(true);
  
  const renderSection = () => {
    switch (activeSection) {
      case 'calendar':
        return <CalendarView quizzes={quizzes} />;
      case 'quizzes':
        return <QuizManager quizzes={quizzes} addQuiz={addQuiz} updateQuiz={updateQuiz} deleteQuiz={deleteQuiz} onRefresh={refetchQuizzes} isRefreshing={loading} />;
      case 'analytics':
        return <AnalyticsDashboard quizzes={quizzes} />;
      default:
        return <CalendarView quizzes={quizzes} />;
    }
  };

  if (!settings || isSettingsModalOpen) {
    return <GitSettingsModal 
        isOpen={true} 
        onClose={() => { if(settings) setIsSettingsModalOpen(false); }} 
        onSave={handleSaveSettings} 
        initialSettings={settings}
    />;
  }

  if (loading && quizzes.length === 0 && !error) {
    return <LoadingSpinner />;
  }
  
  if (error) {
      return <ErrorMessage error={error} onResetSettings={handleOpenSettings} />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onOpenSettings={handleOpenSettings} 
      />
       {isSettingsModalOpen && <GitSettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
        onSave={handleSaveSettings}
        initialSettings={settings} 
       />}
      <main className="p-4 sm:p-6 lg:p-8">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;