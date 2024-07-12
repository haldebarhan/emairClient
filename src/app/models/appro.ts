export interface Appro {
  date: string;
  magasin: string;
  produits: { denreeId: string; quantite: number, denreeName: string }[];
}
