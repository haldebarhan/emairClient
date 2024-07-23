import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appro } from '../models/appro';
import { API_URL } from '../../helpers/api.url';

@Injectable({
  providedIn: 'root',
})
export class ApproService {
  constructor(private http: HttpClient) {}

  makeAppro(data: Appro) {
    return this.http.post(`${API_URL}/appro`, data);
  }

  filterSupplies(month: number, year: number) {
    return this.http.get(`${API_URL}/appro/data/${year}/${month}`);
  }

  filterByMagId(magasinId: string){
    return this.http.get(`${API_URL}/appro/${magasinId}`);
  }
}
