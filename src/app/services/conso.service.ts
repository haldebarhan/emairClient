import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rapport } from '../models/rapport';
import { API_URL } from '../../helpers/api.url';
import { Observable } from 'rxjs';
import { Report } from '../models/report';

@Injectable({
  providedIn: 'root',
})
export class ConsoService {
  constructor(private readonly http: HttpClient) {}

  createConso(data: Rapport) {
    return this.http.post(`${API_URL}/consommation`, data);
  }

  findMonthlyConsumption(year: number, month: number) {
    return this.http.get<Rapport[]>(
      `${API_URL}/consommation/report/${year}/${month}`
    );
  }

  getConsoById(id: string) {
    return this.http.get<Rapport>(`${API_URL}/consommation/${id}`);
  }

  updateConsoById(id: string, data: Rapport) {
    return this.http.patch(`${API_URL}/consommation/${id}`, data);
  }

  deleteConso(id: string) {
    return this.http.delete(`${API_URL}/consommation/${id}`);
  }

  emitReport(id: string) {
    return this.http.get(`${API_URL}/consommation/emit/${id}`);
  }

  dailyReport(
    year: number,
    month: number,
    index: number
  ): Observable<Report | null> {
    return this.http.get<Report | null>(
      `${API_URL}/daily-report/${year}/${month}/${index}`
    );
  }
}
