import React, { useState, useEffect } from 'react';
import { SupabaseSettings } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: SupabaseSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [url, setUrl] = useState('');
    const [anonKey, setAnonKey] = useState('');
    const [tableName, setTableName] = useState('');

    useEffect(() => {
        if (isOpen) {
            try {
                const storedSettings = localStorage.getItem('supabaseSettings');
                if (storedSettings) {
                    const parsed = JSON.parse(storedSettings);
                    setUrl(parsed.url || '');
                    setAnonKey(parsed.anonKey || '');
                    setTableName(parsed.tableName || '');
                }
            } catch (e) {
              console.error("Could not load settings", e)
            }
        }
    }, [isOpen]);

    const handleSave = () => {
        onSave({ url, anonKey, tableName });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">Configuration Supabase</h3>
                <p className="text-gray-400 mb-6 text-sm">
                    Entrez les informations de votre projet Supabase. Celles-ci seront sauvegardées localement dans votre navigateur.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label htmlFor="supabase-url" className="block text-sm font-medium text-gray-300 mb-1">URL du Projet</label>
                        <input
                            id="supabase-url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://<votre-ref-projet>.supabase.co"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="supabase-key" className="block text-sm font-medium text-gray-300 mb-1">Clé Publique (anon)</label>
                        <input
                            id="supabase-key"
                            type="password"
                            value={anonKey}
                            onChange={(e) => setAnonKey(e.target.value)}
                            placeholder="Entrez votre clé 'public anon'"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="supabase-table" className="block text-sm font-medium text-gray-300 mb-1">Nom de la Table des Quiz</label>
                        <input
                            id="supabase-table"
                            type="text"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="ex: quizzes"
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors">
                            Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 bg-brand-accent-600 rounded hover:bg-brand-accent-500 transition-colors">
                            Sauvegarder et Synchroniser
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};