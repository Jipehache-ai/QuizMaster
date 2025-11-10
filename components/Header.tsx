import React from 'react';

interface HeaderProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onSettingsClick }) => {
    const navItems = [
        { id: 'manager', label: 'Gestion des Quiz' },
        { id: 'calendar', label: 'Calendrier' },
        { id: 'analytics', label: 'Analyse' },
    ];

    return (
        <header className="bg-gray-900/50 backdrop-blur-sm shadow-lg mb-8 p-4 rounded-lg">
            <nav className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                    Quiz<span className="text-brand-accent-400">Master</span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <ul className="flex flex-wrap space-x-2 sm:space-x-4">
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setCurrentView(item.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        currentView === item.id
                                            ? 'bg-brand-accent-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={onSettingsClick} title="Configuration" className="text-gray-300 hover:bg-gray-700 hover:text-white p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};