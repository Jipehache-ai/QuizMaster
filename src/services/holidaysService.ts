import { Holiday } from '../types';

export const getFrenchHolidays = async (year: number): Promise<Holiday[]> => {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/FR`);
    if (!response.ok) {
      throw new Error('Failed to fetch holidays');
    }
    const data: Holiday[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching French holidays:', error);
    return [];
  }
};