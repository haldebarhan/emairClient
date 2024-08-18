export interface Booklet {
  magasin: string;

  total_matin: Array<number>;

  total_midi: Array<number>;

  total_soir: Array<number>;

  carnet: {
    produit: string;
    appro: Array<number>;
    conso: Array<number>;
    balance: Array<number>;
    existant: number;
  }[];
}
