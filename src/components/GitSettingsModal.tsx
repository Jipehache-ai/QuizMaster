import React, { useState, useEffect } from 'react';
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
                    <p><strong>Avertissement de sécurité :</strong> Votre token d'accès sera stocké dans le `localStorage` de votre navigateur. Ne partagez jamais cet ordinateur et utilisez un token avec les permissions minimales requises (`repo`).</p>
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
};