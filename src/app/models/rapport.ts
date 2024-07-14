export interface Rapport {
  _id?: string
  date: Date;
  magasin: string;
  menu: string;
  report: { unite: string; petit_dejeuner: number; dejeuner: number; diner: number, _id?: string }[];
  transmit: boolean;
}
