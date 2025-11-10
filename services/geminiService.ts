import { GoogleGenAI } from '@google/genai';
import { Quiz } from '../types';
import { formatNumberWithSpaces } from '../utils/numberFormatter';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getQuizSuggestions = async (quizzes: Quiz[], upcomingEvents: { date: string, name: string }[]): Promise<string> => {
  // Fix: Rewrote the reducer to ensure proper type inference for the accumulator, resolving errors on `totalScore` and `count`.
  const popularThemes = quizzes.reduce((acc, quiz) => {
    const theme = quiz.theme;
    if (!acc[theme]) {
      acc[theme] = { totalScore: 0, count: 0 };
    }
    acc[theme].totalScore += quiz.averageScore;
    acc[theme].count += 1;
    return acc;
  }, {} as Record<string, { totalScore: number, count: number }>);

  const themePerformance = Object.entries(popularThemes)
    .map(([theme, data]) => ({ theme, avgScore: data.totalScore / data.count }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .map(item => `- Thème: ${item.theme}, Score moyen: ${formatNumberWithSpaces(Math.round(item.avgScore))}`)
    .join('\n');
    
  const highScoringQuizzes = [...quizzes]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 5)
    .map(q => `- Titre: ${q.title}, Thème: ${q.theme}, Score: ${formatNumberWithSpaces(q.averageScore)}`)
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

    ## Quiz les plus performants :
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
    return response.text;
  } catch (error) {
    console.error('Error getting quiz suggestions from Gemini:', error);
    return "Une erreur est survenue lors de la récupération des suggestions.";
  }
};

export const getOptimalDateSuggestion = async (topic: string, quizzes: Quiz[], upcomingEvents: { date: string, name: string }[]): Promise<string> => {
    const upcomingEventsText = upcomingEvents
        .map(e => `- ${new Date(e.date).toLocaleDateString('fr-FR')}: ${e.name}`)
        .join('\n');

    const sortedQuizzes = [...quizzes].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    const lastQuizTheme = sortedQuizzes.length > 0 ? sortedQuizzes[0].theme : "N/A";

    const quizPerformanceHistory = sortedQuizzes
        .slice(0, 10) // Limit to the 10 most recent for brevity
        .map(q => `- Thème: ${q.theme}, Score: ${formatNumberWithSpaces(q.averageScore)}`)
        .join('\n');

    const prompt = `
    Vous êtes un stratège de contenu expert. Votre tâche est de suggérer la MEILLEURE date de publication FUTURE pour un nouveau quiz.

    ## Sujet du Quiz :
    "${topic}"

    ## Contexte et Règles à respecter IMPÉRATIVEMENT :
    1.  **Date Future Uniquement** : La date suggérée doit être dans le futur. La date d'aujourd'hui est ${new Date().toLocaleDateString('fr-FR')}.
    2.  **Performance Passée (Votes)** : Analysez l'historique des quiz. Les thèmes avec de meilleurs scores sont plus prometteurs.
    3.  **Variété des Thèmes** : Le thème du dernier quiz publié était "${lastQuizTheme}". Évitez de proposer un quiz sur le même thème, sauf si un événement majeur à venir le justifie pleinement.
    4.  **Pertinence des Événements** : Cherchez une synergie avec un événement à venir. Un quiz publié près d'une journée mondiale pertinente a plus d'impact.

    ## Données à analyser :
    
    ### Historique de performance des derniers quiz (par score/votes) :
    ${quizPerformanceHistory}

    ### Événements à venir dans les 3 prochains mois :
    ${upcomingEventsText}

    ## Votre mission :
    Suggérez UNE seule date de publication optimale. Fournissez une justification claire et structurée expliquant votre choix en fonction des 4 règles ci-dessus.
    
    Exemple de réponse attendue :
    **Date Suggérée :** jj-mm-aaaa
    **Justification :**
    *   **Événement :** Cette date est proche de [Nom de l'événement], ce qui maximise la pertinence.
    *   **Performance :** Le thème est similaire à des quiz passés qui ont eu de bons scores, comme [Exemple de quiz].
    *   **Variété :** Le thème est différent du dernier quiz publié ([Thème du dernier quiz]), ce qui assure une bonne diversité de contenu.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error getting date suggestion from Gemini:', error);
    return "Une erreur est survenue lors de la récupération de la suggestion de date.";
  }
}