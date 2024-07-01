import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';

@Injectable({
  providedIn: 'root',
})
export class RecetteService {
  constructor(private http: HttpClient) {}

  getAllDenrees() {
    return this.http.get(`${API_URL}/denree`);
  }
}
