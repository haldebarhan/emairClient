import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';
import { recette } from '../models/recette';
import { catchError } from 'rxjs';
import { handleError } from '../../helpers/handle-error.helper';

@Injectable({
  providedIn: 'root',
})
export class RecetteService {
  constructor(private http: HttpClient) {}

  getAllDenrees() {
    return this.http.get(`${API_URL}/denree`).pipe(catchError(handleError));
  }

  createRecette(data: recette) {
    return this.http
      .post(`${API_URL}/recette`, data)
      .pipe(catchError(handleError));
  }

  getAllRecette() {
    return this.http.get(`${API_URL}/recette`).pipe(catchError(handleError));
  }

  getOneRecette(id: string) {
    return this.http
      .get(`${API_URL}/recette/${id}`)
      .pipe(catchError(handleError));
  }

  updateRecette(id: string, data: recette) {
    return this.http
      .patch(`${API_URL}/recette/${id}`, data)
      .pipe(catchError(handleError));
  }

  deleteRecette(id: string) {
    return this.http
      .delete(`${API_URL}/recette/${id}`)
      .pipe(catchError(handleError));
  }
}
