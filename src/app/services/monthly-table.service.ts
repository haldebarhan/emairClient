import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';
import { catchError, Observable, throwError } from 'rxjs';
import { MonthlTable } from '../models/monthly-table';

@Injectable({
  providedIn: 'root',
})
export class MonthlyTableService {
  constructor(private http: HttpClient) {}

  getMonthlyTable(magasinId: string): Observable<MonthlTable> {
    return this.http.get<MonthlTable>(
      `${API_URL}/monthly-table/magasin/${magasinId}`
    );
  }

  updateMonthlyTable(tableId: string, data: any) {
    return this.http
      .put(`${API_URL}/monthly-table/${tableId}`, data)
      .pipe(catchError(handleError));
  }
}

const handleError = (error: HttpErrorResponse) => {
  let errorMessages: string[] = [];

  if (error.error instanceof ErrorEvent) {
    // Erreur côté client
    errorMessages.push(`Erreur: ${error.error.message}`);
  } else {
    // Erreur côté serveur
    if (Array.isArray(error.error.message)) {
      // Si le backend renvoie un tableau de messages
      errorMessages = error.error.message;
    } else if (typeof error.error.message === 'string') {
      // Si le backend renvoie un seul message
      errorMessages.push(error.error.message);
    } else {
      errorMessages.push('Erreur inconnue survenue.');
    }
  }

  // Renvoie les messages d'erreur sous forme de tableau
  return throwError(() => errorMessages);
};
