import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../helpers/api.url';
import { Menu } from './models/menu';
import { catchError } from 'rxjs';
import { handleError } from '../../../helpers/handle-error.helper';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}

  createMenu(data: Menu) {
    return this.http
      .post(`${API_URL}/menu`, data)
      .pipe(catchError(handleError));
  }

  getMenus() {
    return this.http.get(`${API_URL}/menu`).pipe(catchError(handleError));
  }
  getOne(id: string) {
    return this.http.get(`${API_URL}/menu/${id}`).pipe(catchError(handleError));
  }
  updateMenu(id: string, data: Menu) {
    return this.http
      .patch(`${API_URL}/menu/${id}`, data)
      .pipe(catchError(handleError));
  }

  deleteMenu(id: string) {
    return this.http
      .delete(`${API_URL}/menu/${id}`)
      .pipe(catchError(handleError));
  }
}
