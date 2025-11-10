// Une palette de couleurs vives et accessibles
const THEME_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f43f5e', // rose-500
];

/**
 * Une fonction de hachage simple pour obtenir un index cohérent pour une chaîne de caractères.
 * @param str La chaîne à hacher (le nom du thème).
 * @returns Un nombre positif.
 */
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertit en entier 32 bits
  }
  return Math.abs(hash);
};

/**
 * Attribue une couleur déterministe à un thème donné.
 * @param theme Le nom du thème.
 * @returns Un code couleur hexadécimal.
 */
export const getColorForTheme = (theme: string): string => {
  if (!theme) return '#6b7280'; // gris pour un thème non défini
  const index = hashCode(theme) % THEME_COLORS.length;
  return THEME_COLORS[index];
};