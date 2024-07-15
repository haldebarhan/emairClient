export const getOption = (mesure: string): string[] => {
  let options: string[] = [];
  switch (mesure) {
    case 'KG':
      options = ['g'];
      break;
    case 'LITRE':
      options = ['cl'];
      break;
    case 'UNITE':
      options = ['UNITE'];
      break;
  }

  return options;
};
