export const formatDateToFrench = (isoDate: string): string => {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    // Pour éviter les problèmes de fuseau horaire qui pourraient changer la date
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  } catch (e) {
    console.error("Invalid date for formatting:", isoDate);
    return 'Date invalide';
  }
};