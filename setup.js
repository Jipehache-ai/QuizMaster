const fs = require('fs');
const path = require('path');

const filesToCreate = [
    {
        path: 'package.json',
        content: `{
  "name": "quiz-dashboard",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.12.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}`
    },
    {
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`
    },
    {
        path: 'tailwind.config.js',
        content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-accent': {
          '50': '#f0faff',
          '100': '#e0f2fe',
          '200': '#bae6fd',
          '300': '#7dd3fc',
          '400': '#38bdf8',
          '500': '#0ea5e9',
          '600': '#0284c7',
          '700': '#0369a1',
          '800': '#075985',
          '900': '#0c4a6e',
          '950': '#082f49',
        },
      }
    }
  },
  plugins: [],
}`
    },
    {
        path: 'postcss.config.js',
        content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
    },
    {
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
    },
    {
        path: 'tsconfig.node.json',
        content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}`
    },
    {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tableau de Bord de Quiz</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-gray-900 text-gray-100">
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`
    },
    {
        path: 'src/index.css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    {
        path: 'src/index.tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    {
        path: 'src/App.tsx',
        content: `import React, { useState, useEffect } from 'react';
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

export default App;`
    },
    {
        path: 'src/types.ts',
        content: `export interface Quiz {
  id: string;
  nom: string;
  theme: string;
  quizDate: string; // ISO string format
  votes: number;
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  localName: string;
  name: string;
}

export interface WorldDay {
    month: number; // 1-12
    day: number;
    name: string;
}

export interface CalendarEvent {
    date: string; // ISO string format
    title: string;
    type: 'quiz' | 'holiday' | 'world-day' | 'personal';
    quizId?: string;
}

export type Section = 'calendar' | 'quizzes' | 'analytics';

export interface GitSettings {
    username: string;
    repo: string;
    path: string;
    token: string;
}`
    },
    {
        path: 'src/constants.ts',
        content: `import { WorldDay, Quiz } from './types';

export const WORLD_DAYS: WorldDay[] = [
  { month: 2, day: 14, name: "Saint-Valentin" },
  { month: 3, day: 8, name: "Journée internationale des droits des femmes" },
  { month: 3, day: 20, name: "Journée internationale de la Francophonie" },
  { month: 4, day: 1, name: "Poisson d'avril" },
  { month: 4, day: 22, name: "Journée mondiale de la Terre" },
  { month: 5, day: 9, name: "Journée de l'Europe" },
  { month: 6, day: 5, name: "Journée mondiale de l'environnement" },
  { month: 6, day: 21, name: "Fête de la Musique" },
  { month: 10, day: 31, name: "Halloween" },
];

export const MOCK_QUIZZES: Omit<Quiz, 'id'>[] = [
    { nom: 'Quiz sur la Révolution Française', theme: 'Histoire', quizDate: new Date(2023, 6, 14).toISOString(), votes: 125 },
    { nom: 'Les films de Quentin Tarantino', theme: 'Cinéma', quizDate: new Date(2023, 8, 20).toISOString(), votes: 250 },
    { nom: 'Le système solaire', theme: 'Sciences', quizDate: new Date(2023, 9, 5).toISOString(), votes: 180 },
    { nom: 'Quiz sur la Seconde Guerre Mondiale', theme: 'Histoire', quizDate: new Date(2023, 4, 8).toISOString(), votes: 95 },
];`
    },
    {
        path: 'src/hooks/useQuizzes.ts',
        content: `import { useState, useEffect, useCallback } from 'react';
import { Quiz, GitSettings } from '../types';
import { getFile, updateFile } from '../services/gitService';
import { MOCK_QUIZZES } from '../constants';

export const useQuizzes = (settings: GitSettings | null) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fileSha, setFileSha] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async () => {
    if (!settings) {
        setLoading(false);
        return;
    };
    setLoading(true);
    setError(null);
    try {
        const { content, sha } = await getFile(settings);
        setQuizzes(content.sort((a,b) => new Date(b.quizDate).getTime() - new Date(a.quizDate).getTime()));
        setFileSha(sha);
    } catch (err: any) {
        if (err.message.includes('Not Found')) {
            console.log('File not found. Seeding with initial data...');
            try {
                const initialQuizzes = MOCK_QUIZZES.map(q => ({ ...q, id: crypto.randomUUID() }));
                const { sha } = await updateFile(settings, initialQuizzes, 'feat: Initial commit des quiz', null);
                setQuizzes(initialQuizzes.sort((a,b) => new Date(b.quizDate).getTime() - new Date(a.quizDate).getTime()));
                setFileSha(sha);
            } catch (seedError: any) {
                console.error('Error seeding file:', seedError);
                setError(seedError);
            }
        } else {
            console.error('Error during quiz fetch:', err);
            setError(err as Error);
        }
    } finally {
        setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);
  
  const saveQuizzes = async (updatedQuizzes: Quiz[], commitMessage: string) => {
    if (!settings) return;
    setError(null);
    try {
      setLoading(true);
      const { sha: newSha } = await updateFile(settings, updatedQuizzes, commitMessage, fileSha);
      setFileSha(newSha);
      setQuizzes(updatedQuizzes.sort((a,b) => new Date(b.quizDate).getTime() - new Date(a.quizDate).getTime()));
    } catch (err) {
      console.error('Error saving quizzes:', err);
      setError(err as Error);
      fetchQuizzes();
    } finally {
      setLoading(false);
    }
  };


  const addQuiz = async (quiz: Omit<Quiz, 'id'>) => {
    const newQuiz = { ...quiz, id: crypto.randomUUID() };
    const updatedQuizzes = [newQuiz, ...quizzes];
    await saveQuizzes(updatedQuizzes, \`feat: Ajout du quiz "\${newQuiz.nom}"\`);
  };

  const updateQuiz = async (updatedQuiz: Quiz) => {
    const updatedQuizzes = quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q);
    await saveQuizzes(updatedQuizzes, \`fix: Mise à jour du quiz "\${updatedQuiz.nom}"\`);
  };

  const deleteQuiz = async (quizId: string) => {
    const quizToDelete = quizzes.find(q => q.id === quizId);
    const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
    if(quizToDelete) {
        await saveQuizzes(updatedQuizzes, \`feat: Suppression du quiz "\${quizToDelete.nom}"\`);
    }
  };

  return { quizzes, loading, error, addQuiz, updateQuiz, deleteQuiz, refetchQuizzes: fetchQuizzes };
};`
    },
    {
        path: 'src/services/holidaysService.ts',
        content: `import { Holiday } from '../types';

export const getFrenchHolidays = async (year: number): Promise<Holiday[]> => {
  try {
    const response = await fetch(\`https://date.nager.at/api/v3/PublicHolidays/\${year}/FR\`);
    if (!response.ok) {
      throw new Error('Failed to fetch holidays');
    }
    const data: Holiday[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching French holidays:', error);
    return [];
  }
};`
    },
    {
        path: 'src/services/geminiService.ts',
        content: `import { GoogleGenAI } from '@google/genai';
import { Quiz } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getQuizSuggestions = async (quizzes: Quiz[], upcomingEvents: { date: string, name: string }[]): Promise<string> => {
  const popularThemes = quizzes.reduce((acc, quiz) => {
    acc[quiz.theme] = (acc[quiz.theme] || { totalVotes: 0, count: 0 });
    acc[quiz.theme].totalVotes += quiz.votes;
    acc[quiz.theme].count += 1;
    return acc;
  }, {} as Record<string, { totalVotes: number, count: number }>);

  const themePerformance = Object.entries(popularThemes)
    .map(([theme, data]) => ({ theme, avgVotes: data.totalVotes / data.count }))
    .sort((a, b) => b.avgVotes - a.avgVotes)
    .map(item => \`- Thème: \${item.theme}, Votes moyens: \${item.avgVotes.toFixed(2)}\`)
    .join('\\n');
    
  const highScoringQuizzes = [...quizzes]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5)
    .map(q => \`- Nom: \${q.nom}, Thème: \${q.theme}, Votes: \${q.votes}\`)
    .join('\\n');

  const upcomingEventsText = upcomingEvents
    .map(e => \`- \${e.date}: \${e.name}\`)
    .join('\\n');

  const prompt = \`
    Vous êtes un stratège de contenu expert, spécialisé dans la création de quiz engageants.
    En vous basant sur les données suivantes, suggérez 3 à 5 nouvelles idées de quiz.
    Pour chaque idée, fournissez un titre accrocheur, un thème, et une brève description.
    Donnez la priorité aux sujets liés aux événements à venir.

    ## Performance des quiz passés (par thème) :
    \${themePerformance}

    ## Quiz les plus populaires (par votes) :
    \${highScoringQuizzes}

    ## Événements à venir :
    \${upcomingEventsText}

    Vos suggestions doivent être créatives et susceptibles de bien performer en se basant sur l'historique fourni. Répondez en Markdown.
  \`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error getting quiz suggestions from Gemini:', error);
    return "Une erreur est survenue lors de la récupération des suggestions.";
  }
};

export const getOptimalDateSuggestion = async (nom: string, upcomingEvents: { date: string, name: string }[]): Promise<string> => {
    const upcomingEventsText = upcomingEvents
    .map(e => \`- \${e.date}: \${e.name}\`)
    .join('\\n');
    
    const prompt = \`
    Vous êtes un stratège de contenu expert. Votre tâche est de suggérer la meilleure date de publication pour un nouveau quiz.

    ## Nom du Quiz :
    "\${nom}"

    ## Événements à venir dans les 3 prochains mois :
    \${upcomingEventsText}

    Analysez la liste des événements et suggérez la date la plus stratégique pour publier ce quiz afin de maximiser sa pertinence et son engagement. 
    Fournissez la date et une courte justification de votre choix. 
    Si aucun événement pertinent n'est trouvé, suggérez une date généralement propice à l'engagement (par exemple, un week-end) et précisez qu'aucune correspondance d'événement spécifique n'a été trouvée. Répondez en Markdown.
  \`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error getting date suggestion from Gemini:', error);
    return "Une erreur est survenue lors de la récupération de la suggestion de date.";
  }
}`
    },
    {
        path: 'src/services/gitService.ts',
        content: `import { Quiz, GitSettings } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

const atob_utf8 = (b64: string) => {
    return decodeURIComponent(
        atob(b64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
    );
};

const btoa_utf8 = (str: string) => {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
            String.fromCharCode(parseInt(p1, 16)),
        ),
    );
};


async function githubApiRequest(url: string, settings: GitSettings, options: RequestInit = {}) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': \`token \${settings.token}\`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(\`GitHub API Error: \${response.status} \${errorData.message || 'Unknown error'}\`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export const getFile = async (settings: GitSettings): Promise<{ content: Quiz[], sha: string }> => {
    const { username, repo, path } = settings;
    const url = \`\${GITHUB_API_BASE}/repos/\${username}/\${repo}/contents/\${path}\`;
    const data = await githubApiRequest(url, settings);

    const content = JSON.parse(atob_utf8(data.content));
    return { content, sha: data.sha };
};

export const updateFile = async (
    settings: GitSettings,
    content: Quiz[],
    message: string,
    sha: string | null
): Promise<{ sha: string }> => {
    const { username, repo, path } = settings;
    const url = \`\${GITHUB_API_BASE}/repos/\${username}/\${repo}/contents/\${path}\`;
    
    const body = {
        message,
        content: btoa_utf8(JSON.stringify(content, null, 2)),
        sha,
    };

    const response = await githubApiRequest(url, settings, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

    return { sha: response.content.sha };
};`
    },
    {
        path: 'src/components/Header.tsx',
        content: `import React from 'react';
import { Section } from '../types';

interface HeaderProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  onOpenSettings: () => void;
}

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, onOpenSettings }) => {
  const navItems: { id: Section; label: string; icon: React.ReactElement }[] = [
    { id: 'calendar', label: 'Calendrier', icon: <CalendarIcon /> },
    { id: 'quizzes', label: 'Gestion des Quiz', icon: <ListIcon /> },
    { id: 'analytics', label: 'Analyse & Suggestions', icon: <ChartIcon /> },
  ];

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-white">Quiz Dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={\`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 \${
                  activeSection === item.id
                    ? 'bg-brand-accent-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }\`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
            <button
                onClick={onOpenSettings}
                className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                aria-label="Settings"
            >
                <SettingsIcon />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};`
    },
    {
        path: 'src/components/CalendarView.tsx',
        content: `import React, { useState, useEffect, useMemo } from 'react';
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
    return \`\${y}-\${m}-\${d}\`;
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
            if (!day) return <div key={\`blank-\${index}\`} className="border border-gray-700/50"></div>;

            const dayDate = new Date(year, month, day);
            const dateKey = getLocalDateKey(dayDate);
            const dayEvents = calendarEvents[dateKey] || [];
            
            const isToday = getLocalDateKey(new Date()) === dateKey;

            return (
                <div key={day} className={\`border border-gray-700/50 p-2 flex flex-col min-h-[120px] relative transition-colors duration-200 \${isToday ? 'bg-gray-700' : 'bg-gray-800'}\`}>
                     <button onClick={() => handleAddEventClick(day)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-brand-accent-600 hover:bg-brand-accent-500 flex items-center justify-center text-white text-lg font-bold transition-transform transform hover:scale-110">+</button>
                    <time dateTime={dateKey} className={\`font-bold \${isToday ? 'text-brand-accent-400' : ''}\`}>{day}</time>
                    <div className="mt-1 flex-grow overflow-y-auto text-xs space-y-1">
                        {dayEvents.map((event, i) => (
                           <div key={i} className={\`p-1 rounded truncate \${
                               event.type === 'quiz' ? 'bg-green-600' :
                               event.type === 'holiday' ? 'bg-blue-600' :
                               event.type === 'world-day' ? 'bg-purple-600' :
                               'bg-yellow-600'
                           } text-white\`}>
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
};`
    },
    {
        path: 'src/components/QuizManager.tsx',
        content: `import React, { useState } from 'react';
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
    <svg xmlns="http://www.w3.org/2000/svg" className={\`h-5 w-5 mr-2 \${refreshing ? 'animate-spin' : ''}\`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
};`
    },
    {
        path: 'src/components/QuizForm.tsx',
        content: `import React, { useState, useEffect } from 'react';
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
};`
    },
    {
        path: 'src/components/QuizTable.tsx',
        content: `import React, { useState, useMemo } from 'react';
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
};`
    },
    {
        path: 'src/components/AnalyticsDashboard.tsx',
        content: `import React, { useMemo, useState, useEffect } from 'react';
import { Quiz } from '../types';
import { getQuizSuggestions, getOptimalDateSuggestion } from '../services/geminiService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { getFrenchHolidays } from '../services/holidaysService';
import { WORLD_DAYS } from '../constants';

interface AnalyticsDashboardProps {
    quizzes: Quiz[];
}

const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-700 p-2 border border-gray-600 rounded text-white text-sm">
        <p className="label font-bold">{label}</p>
        {Object.entries(data).map(([key, value]) => {
            if (key !== 'name' && key !== 'nom' && key !== 'date') {
                 return <p key={key}>{\`\${payload[0].name}: \${value}\`}</p>
            }
            return null;
        })}
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
    const [nomForDate, setNomForDate] = useState('');
    const [upcomingEvents, setUpcomingEvents] = useState<{ date: string, name: string }[]>([]);

     useEffect(() => {
        const fetchEvents = async () => {
            const today = new Date();
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
                .slice(0, 20);
            
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
            const month = new Date(quiz.quizDate).toLocaleString('fr-FR', { year: 'numeric', month: 'short' });
            monthMap.set(month, (monthMap.get(month) || 0) + 1);
        });
        return Array.from(monthMap, ([name, quizCount]) => ({ name, quizCount }))
            .sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    }, [quizzes]);

    const performanceOverTime = useMemo(() => {
        return [...quizzes]
            .sort((a, b) => new Date(a.quizDate).getTime() - new Date(b.quizDate).getTime())
            .map(q => ({
                date: new Date(q.quizDate).toLocaleDateString('fr-FR'),
                votes: q.votes,
                nom: q.nom,
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
        if (!nomForDate) return;
        setIsLoadingDate(true);
        const result = await getOptimalDateSuggestion(nomForDate, upcomingEvents);
        setDateSuggestion(result);
        setIsLoadingDate(false);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Analyse et Suggestions</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Quiz par Thème</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={dataByTheme} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {dataByTheme.map((entry, index) => <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />)}
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
                    <h2 className="text-xl font-semibold mb-4">Popularité au fil du temps (par votes)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceOverTime}>
                             <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                            <XAxis dataKey="date" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#0ea5e9', strokeWidth: 1}}/>
                            <Legend />
                            <Line type="monotone" dataKey="votes" name="Nombre de votes" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Idées de quiz (IA)</h2>
                    <button onClick={handleGetSuggestions} disabled={isLoadingSuggestions} className="w-full px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors font-semibold disabled:bg-gray-600">
                        Générer des suggestions
                    </button>
                    <div className="mt-4 p-4 bg-gray-900 rounded-md min-h-[200px] prose prose-invert prose-sm max-w-none">
                        {isLoadingSuggestions ? <LoadingSpinner /> : <div dangerouslySetInnerHTML={{ __html: suggestions.replace(/\\n/g, '<br />') }} />}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Suggestion de date de publication (IA)</h2>
                    <form onSubmit={handleGetDateSuggestion}>
                        <input type="text" value={nomForDate} onChange={e => setNomForDate(e.target.value)} placeholder="Entrez un nom de quiz..." className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                        <button type="submit" disabled={isLoadingDate || !nomForDate} className="w-full px-4 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors font-semibold disabled:bg-gray-600">
                           Trouver la date optimale
                        </button>
                    </form>
                    <div className="mt-4 p-4 bg-gray-900 rounded-md min-h-[200px] prose prose-invert prose-sm max-w-none">
                       {isLoadingDate ? <LoadingSpinner /> : <div dangerouslySetInnerHTML={{ __html: dateSuggestion.replace(/\\n/g, '<br />') }} />}
                    </div>
                </div>
            </div>
        </div>
    );
};`
    },
    {
        path: 'src/components/GitSettingsModal.tsx',
        content: `import React, { useState, useEffect } from 'react';
import { GitSettings } from '../types';

interface GitSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: GitSettings) => void;
    initialSettings: GitSettings | null;
}

export const GitSettingsModal: React.FC<GitSettingsModalProps> = ({ isOpen, onClose, onSave, initialSettings }) => {
    const [username, setUsername] = useState('');
    const [repo, setRepo] = useState('');
    const [path, setPath] = useState('quizzes.json');
    const [token, setToken] = useState('');

    useEffect(() => {
        if (initialSettings) {
            setUsername(initialSettings.username);
            setRepo(initialSettings.repo);
            setPath(initialSettings.path);
            setToken(initialSettings.token);
        }
    }, [initialSettings]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (username && repo && path && token) {
            onSave({ username, repo, path, token });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Configuration GitHub</h2>
                    {initialSettings && (
                        <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                    )}
                </div>
                <p className="text-gray-400 mb-6">
                    Veuillez fournir les informations de votre dépôt GitHub pour la sauvegarde des données.
                </p>

                <div className="space-y-4">
                    <input type="text" placeholder="Nom d'utilisateur GitHub" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    <input type="text" placeholder="Nom du dépôt" value={repo} onChange={e => setRepo(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    <input type="text" placeholder="Chemin du fichier (ex: data/quizzes.json)" value={path} onChange={e => setPath(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                    <input type="password" placeholder="Token d'accès personnel" value={token} onChange={e => setToken(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500" />
                </div>
                
                <div className="mt-6 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-200 rounded-md text-sm">
                    <p><strong>Avertissement de sécurité :</strong> Votre token d'accès sera stocké dans le \`localStorage\` de votre navigateur. Ne partagez jamais cet ordinateur et utilisez un token avec les permissions minimales requises (\`repo\`).</p>
                    <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener noreferrer" className="text-brand-accent-400 hover:underline">Comment créer un token ?</a>
                </div>

                <div className="flex justify-end mt-6">
                    <button 
                        onClick={handleSave} 
                        disabled={!username || !repo || !path || !token}
                        className="px-6 py-2 bg-brand-accent-600 text-white rounded-md hover:bg-brand-accent-500 transition-colors font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Sauvegarder et Continuer
                    </button>
                </div>
            </div>
        </div>
    );
};`
    }
];

function createProject() {
    console.log('Starting project setup...');
    filesToCreate.forEach(file => {
        const dir = path.dirname(file.path);
        if (dir !== '.' && !fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
        fs.writeFileSync(file.path, file.content.trim());
        console.log(`Created file: ${file.path}`);
    });
    console.log('\\nProject setup complete!');
    console.log('Next steps:');
    console.log('1. Run "npm install" to install dependencies.');
    console.log('2. Run "npm run dev" to start the development server.');
}

createProject();