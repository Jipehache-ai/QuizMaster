export interface Quiz {
  id: string;
  title: string;
  theme: string;
  publishDate: string; // ISO string
  averageScore: number;
}

export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export interface WorldDay {
  month: number;
  day: number;
  name: string;
}

export interface CalendarEvent {
  date: string; // ISO string
  title: string;
  type: 'quiz' | 'holiday' | 'world-day' | 'personal';
  quizId?: string;
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  tableName: string;
}