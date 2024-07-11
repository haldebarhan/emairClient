import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();
  setData(
    data: {
      produit: string;
      quantite: number;
      conso: number;
      appro: number;
      balance: number;
      prix: number;
    }[]
  ) {
    this.dataSubject.next(data);
  }
}
