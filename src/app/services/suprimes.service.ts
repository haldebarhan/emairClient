import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';

@Injectable({
  providedIn: 'root',
})
export class SuprimesService {
  constructor(private http: HttpClient) {}

  create(data: { date: Date; nom: string; montant: number }) {
    return this.http.post(`${API_URL}/surprime`, data);
  }

  update(id: string, data: { date: Date; nom: string; montant: number }) {
    return this.http.patch(`${API_URL}/surprime/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${API_URL}/surprime/${id}`);
  }

  getOne(id: string) {
    return this.http.get(`${API_URL}/surprime/${id}`);
  }

  filter(year: number, month: number) {
    return this.http.get(`${API_URL}/surprime/${year}/${month}`);
  }
}
