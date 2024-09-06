import { Denree } from "../app/models/denree";

export const getOption = (denree: Denree): string => {
  let option = ""
  switch (denree.mesure) {
    case 'KG':
      option= 'g';
      break;
    case 'LITRE':
      option = 'ml';
      break;
    case 'UNITE':
      option = 'UNITE';
      break;
    default:
      option = `1 ${denree.mesure} pour`
  }

  return option;
};
