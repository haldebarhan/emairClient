export interface MonthlyTable {
  _id: string;
  magasin: {
    _id: string;
    date: string;
    complete: boolean;
    stock: {
      denree: string;
      quantite: number;
      conso: number;
      appro: number;
      balance: number;
    }[];
  };
  unites: {
    nom: string;
    matin: number[];
    midi: number[];
    soir: number[];
    totalMatin: number;
    totalMidi: number;
    totalSoir: number;
  }[];
  totalMatin: number[];
  totalMidi: number[];
  totalSoir: number[];
  totalRow: number[];
}
