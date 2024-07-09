import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../helpers/api.url';
import { Denree } from '../../models/denree';
import { handleError } from '../../../helpers/handle-error.helper';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DenreeService {
  constructor(private http: HttpClient) {}

  getAllDenree() {
    return this.http.get(`${API_URL}/denree`).pipe(catchError(handleError));
  }

  getMesures() {
    return this.http.get(`${API_URL}/mesure`).pipe(catchError(handleError));
  }

  getConversionUnit() {
    return this.http.get(`${API_URL}/conversion`).pipe(catchError(handleError));
  }

  createDenree(data: Denree) {
    return this.http
      .post(`${API_URL}/denree`, data)
      .pipe(catchError(handleError));
  }

  deleteDenree(id: string) {
    return this.http
      .delete(`${API_URL}/denree/${id}`)
      .pipe(catchError(handleError));
  }

  getOneDenree(id: string) {
    return this.http
      .get(`${API_URL}/denree/${id}`)
      .pipe(catchError(handleError));
  }

  updateDenree(id: string, data: Denree) {
    return this.http
      .put(`${API_URL}/denree/${id}`, data)
      .pipe(catchError(handleError));
  }
}
