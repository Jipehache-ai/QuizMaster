// src/services/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// Récupère les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifie si les variables sont bien présentes
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or Anon Key is missing from .env file");
}

// Crée et exporte le client Supabase
// Ce client sera importé dans les autres fichiers pour interagir avec la base de données
export const supabase = createClient(supabaseUrl, supabaseAnonKey);