import { GoogleGenAI } from '@google/genai';
import { Quiz } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });

export const getQuizSuggestions = async (quizzes: Quiz[], upcomingEvents: { date: string, name: string }[]): Promise<string> => {
  const popularThemes = quizzes.reduce((acc, quiz) => {
    acc[quiz.theme] = (acc[quiz.theme] || { totalVotes: 0, count: 0 });
    acc[quiz.theme].totalVotes += quiz.votes;
    acc[quiz.theme].count += 1;
    return acc;
  }, {} as Record<string, { totalVotes: number, count: number }>);

  const themePerformance = Object.entries(popularThemes)
    .map(([theme, data]) => ({ theme, avgVotes: data.totalVotes / data.count }))
    .sort((a, b) => b.avgVotes - a.avgVotes)
    .map(item => `- Thème: ${item.theme}, Votes moyens: ${item.avgVotes.toFixed(2)}`)
    .join('\n');
    
  const highScoringQuizzes = [...quizzes]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5)
    .map(q => `- Nom: ${q.nom}, Thème: ${q.theme}, Votes: ${q.votes}`)
    .join('\n');

  const upcomingEventsText = upcomingEvents
    .map(e => `- ${e.date}: ${e.name}`)
    .join('\n');

  const prompt = `
    Vous êtes un stratège de contenu expert, spécialisé dans la création de quiz engageants.
    En vous basant sur les données suivantes, suggérez 3 à 5 nouvelles idées de quiz.
    Pour chaque idée, fournissez un titre accrocheur, un thème, et une brève description.
    Donnez la priorité aux sujets liés aux événements à venir.

    ## Performance des quiz passés (par thème) :
    ${themePerformance}

    ## Quiz les plus populaires (par votes) :
    ${highScoringQuizzes}

    ## Événements à venir :
    ${upcomingEventsText}

    Vos suggestions doivent être créatives et susceptibles de bien performer en se basant sur l'historique fourni. Répondez en Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text ?? "Aucune suggestion de texte n'a été générée.";
  } catch (error) {
    console.error('Error getting quiz suggestions from Gemini:', error);
    return "Une erreur est survenue lors de la récupération des suggestions.";
  }
};

export const getOptimalDateSuggestion = async (nom: string, upcomingEvents: { date: string, name: string }[]): Promise<string> => {
    const upcomingEventsText = upcomingEvents
    .map(e => `- ${e.date}: ${e.name}`)
    .join('\n');
    
    const prompt = `
    Vous êtes un stratège de contenu expert. Votre tâche est de suggérer la meilleure date de publication pour un nouveau quiz.

    ## Nom du Quiz :
    "${nom}"

    ## Événements à venir dans les 3 prochains mois :
    ${upcomingEventsText}

    Analysez la liste des événements et suggérez la date la plus stratégique pour publier ce quiz afin de maximiser sa pertinence et son engagement. 
    Fournissez la date et une courte justification de votre choix. 
    Si aucun événement pertinent n'est trouvé, suggérez une date généralement propice à l'engagement (par exemple, un week-end) et précisez qu'aucune correspondance d'événement spécifique n'a été trouvée. Répondez en Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text ?? "Aucune suggestion de date n'a été générée.";
  } catch (error) {
    console.error('Error getting date suggestion from Gemini:', error);
    return "Une erreur est survenue lors de la récupération de la suggestion de date.";
  }
}