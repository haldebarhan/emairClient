import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';

@Injectable({
  providedIn: 'root',
})
export class DiversService {
  constructor(private http: HttpClient) {}

  create(data: { date: Date; libelle: string; montant: number }) {
    return this.http.post(`${API_URL}/divers`, data);
  }

  findAll() {
    return this.http.get(`${API_URL}/divers`);
  }

  update(id: string, data: { date: Date; libelle: string; montant: number }) {
    return this.http.patch(`${API_URL}/divers/${id}`, data);
  }

  findOne(id: string) {
    return this.http.get(`${API_URL}/divers/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`${API_URL}/divers/${id}`);
  }

  filter(year: number, month: number) {
    return this.http.get(`${API_URL}/divers/filter/${year}/${month}`);
  }
}
