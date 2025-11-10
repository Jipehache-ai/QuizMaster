export const formatNumberWithSpaces = (num: number): string => {
  // La locale 'fr-FR' utilise un espace insécable comme séparateur de milliers.
  return new Intl.NumberFormat('fr-FR').format(num);
};