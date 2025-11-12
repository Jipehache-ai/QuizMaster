import { WorldDay, Quiz } from './types';

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
];