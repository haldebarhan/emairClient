export const getDayName = (date: Date): string => {
  let jourSemaine = date.getDay();
  let joursSemaine = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];
  let nomJourSemaine = joursSemaine[jourSemaine];
  return nomJourSemaine;
};
