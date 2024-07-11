const mois = {
  Janvier: 1,
  Février: 2,
  Mars: 3,
  Avril: 4,
  Mai: 5,
  Juin: 6,
  Juillet: 7,
  Août: 8,
  Septembre: 9,
  Octobre: 10,
  Novembre: 11,
  Décembre: 12,
};

export function search(month: number) {
  for (const [key, value] of Object.entries(mois)) {
    if (value === month) {
      return key.toString();
    }
  }
  return null;
}
