import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../helpers/api.url';

@Injectable({
  providedIn: 'root',
})
export class UniteService {
  constructor(private readonly http: HttpClient) {}

  getUnites() {
    return this.http.get(`${API_URL}/unite`);
  }
  createUnite(data: { nom: string }) {
    return this.http.post(`${API_URL}/unite`, data);
  }

  getone(unitId: string) {
    return this.http.get(`${API_URL}/unite/${unitId}`);
  }

  updateUnite(uniteId: string, data: { nom: string }) {
    return this.http.patch(`${API_URL}/unite/${uniteId}`, data);
  }

  delete(unitId: string) {
    return this.http.delete(`${API_URL}/unite/${unitId}`);
  }
}
