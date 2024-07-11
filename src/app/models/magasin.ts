export interface Magasin {
  id: string;
  date: string;
  stock: {
    produit: string;
    quantite: number;
    conso: number;
    appro: number;
    balance: number;
    prix: number;
  }[];
}
