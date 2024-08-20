import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';
import { Observable } from 'rxjs';
import { Magasin } from '../models/magasin';

@Injectable({
  providedIn: 'root',
})
export class MagasinService {
  constructor(private http: HttpClient) {}

  create(data: { year: string; month: string }) {
    return this.http.post(`${API_URL}/magasin`, data);
  }

  findAll(): Observable<Magasin | null> {
    return this.http.get<Magasin | null>(`${API_URL}/magasin`);
  }

  findOne(id: string): Observable<Magasin> {
    return this.http.get<Magasin>(`${API_URL}/magasin/${id}`);
  }

  finOneByDate(dateStr: string): Observable<Magasin> {
    return this.http.get<Magasin>(`${API_URL}/magasin/find/${dateStr}`);
  }

  nextMonth(data: {magasin: string}) {
    return this.http.post(`${API_URL}/magasin/next-month`, data);
  }

  monthluStatus() {
    return this.http.get(`${API_URL}/monthly-status`);
  }
}
