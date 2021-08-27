const capitalize = (s) => {
  const word = s.trim().toLowerCase();
  if (!word) return '';
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
};

export const collectionName = (collectionId) =>
  collectionId.split('.').pop().split('-').map(capitalize).join(' ');