import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../helpers/api.url';
import { handleError } from '../../../helpers/handle-error.helper';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniteService {
  constructor(private readonly http: HttpClient) {}

  getUnites() {
    return this.http.get(`${API_URL}/unite`).pipe(catchError(handleError));
  }
  createUnite(data: { nom: string }) {
    return this.http
      .post(`${API_URL}/unite`, data)
      .pipe(catchError(handleError));
  }

  getone(unitId: string) {
    return this.http
      .get(`${API_URL}/unite/${unitId}`)
      .pipe(catchError(handleError));
  }

  updateUnite(uniteId: string, data: { nom: string }) {
    return this.http
      .patch(`${API_URL}/unite/${uniteId}`, data)
      .pipe(catchError(handleError));
  }

  delete(unitId: string) {
    return this.http
      .delete(`${API_URL}/unite/${unitId}`)
      .pipe(catchError(handleError));
  }
}
