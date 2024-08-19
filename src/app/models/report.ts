export interface Report {
  date: Date;
  pdej: string;
  dej: string;
  hd: string;
  des: string;
  din: string;
  magasin: string;
  pdej_effect: number;
  dej_effect: number;
  din_effect: number;
  reportId: string;
  sorties: {
    produit: string;
    matin: number;
    soir: number;
    unite: string;
  }[];
}
