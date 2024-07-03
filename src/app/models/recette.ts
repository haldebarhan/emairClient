export interface recette {
  nomRecette: string;
  ingredients: {
    denree: string;
    ration: number;
    unite: string;
  }[];
}
