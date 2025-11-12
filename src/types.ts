export interface Quiz {
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
}