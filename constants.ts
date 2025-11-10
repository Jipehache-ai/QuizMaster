import { WorldDay } from './types';

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

export const MOCK_QUIZZES = [
    { id: '1', title: 'Quiz sur la Révolution Française', theme: 'Histoire', publishDate: new Date(2023, 6, 14).toISOString(), averageScore: 85 },
    { id: '2', title: 'Les films de Quentin Tarantino', theme: 'Cinéma', publishDate: new Date(2023, 8, 20).toISOString(), averageScore: 92 },
    { id: '3', title: 'Le système solaire', theme: 'Sciences', publishDate: new Date(2023, 9, 5).toISOString(), averageScore: 88 },
    { id: '4', title: 'Quiz sur la Seconde Guerre Mondiale', theme: 'Histoire', publishDate: new Date(2023, 4, 8).toISOString(), averageScore: 78 },
];