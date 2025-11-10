import { createClient } from '@supabase/supabase-js';
import { Quiz, SupabaseSettings } from '../types';

export const fetchQuizzesFromSupabase = async (settings: SupabaseSettings): Promise<Quiz[]> => {
    const { url, anonKey, tableName } = settings;

    if (!url || !anonKey || !tableName) {
        throw new Error('Les informations de connexion à Supabase sont incomplètes.');
    }

    const supabase = createClient(url, anonKey);

    const { data, error } = await supabase
        .from(tableName)
        .select('*');

    if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Impossible de récupérer les données de la table "${tableName}". Assurez-vous que le nom de la table est correct et que les politiques RLS autorisent la lecture. Détails: ${error.message}`);
    }

    if (!data) {
        return [];
    }

    // Traduction personnalisée pour correspondre à VOS noms de colonnes.
    return data.map((item: any) => ({
        id: item.id, // On suppose que la colonne 'id' existe toujours.
        title: item.nom, // On prend la colonne 'nom' de votre table.
        theme: item.theme, // Le nom est déjà correct.
        publishDate: new Date(item.quiz_date).toISOString(), // On prend 'quiz_date'.
        averageScore: item.votes // On prend 'votes' pour le score.
    }));
};