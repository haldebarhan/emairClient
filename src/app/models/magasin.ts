export interface Magasin {
  id: string;
  date: string;
  completed: boolean;
  stock: {
    produit: string;
    quantite: number;
    conso: number;
    appro: number;
    balance: number;
    prix: number;
    um: string;
  }[];
}
