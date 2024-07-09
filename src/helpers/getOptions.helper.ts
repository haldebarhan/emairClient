export const getOption = (mesure: string): string[] => {
  let options: string[] = [];
  switch (mesure) {
    case 'KG':
      options = ['KG', 'g', 'mg'];
      break;
    case 'LITRE':
      options = ['LITRE', 'cl', 'ml'];
      break;
    case 'PCE':
      options = ['PCE', 'DEMI PCE', 'QUART PCE'];
      break;
    case 'BOULE':
      options = ['BOULE', 'DEMI BOULE', 'QUART BOULE'];
      break;
    case 'BOTTE':
      options = ['BOTTE', 'DEMI BOTTE', 'QUART BOTTE'];
      break;
    case 'BAGUETTE':
      options = ['BAGUETTE', 'DEMI BAGUETTE', 'QUART BAGUETTE'];
      break;
    case 'NOMBRE':
      options = ['NOMBRE', 'DEMI', 'QUART'];
      break;
    case 'SACHET':
      options = ['SACHET', 'DEMI SACHET', ' QUART SACHET'];
      break;
    case 'BOUTEILLE':
      options = ['BOUTEILLE', 'DEMI BOUTEILLE', 'DEMI BOUTEILLE'];
      break;
    case 'PLAQUETTE':
      options = ['PLAQUETTE', ' DEMI PLAQUETTE', ' QUART PLAQUETTE', 'UNITE'];
      break;
    case 'BOITTE':
      options = ['BOITTE', 'DEMI BOITTE', 'QUART BOITTE'];
      break;
    case 'ROULEAU':
      options = ['ROULEAU', ' DEMI ROULEAU', 'FEUILLE'];
      break;

    case 'UNITE':
      options = ['UNITE'];
      break;
  }

  return options;
};
