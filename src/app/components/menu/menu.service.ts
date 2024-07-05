import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../helpers/api.url';
import { Menu } from './models/menu';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private http: HttpClient) {}

  createMenu(data: Menu) {
    return this.http.post(`${API_URL}/menu`, data);
  }

  getMenus() {
    return this.http.get(`${API_URL}/menu`);
  }
  getOne(id: string) {
    return this.http.get(`${API_URL}/menu/${id}`);
  }
  updateMenu(id: string, data: Menu) {
    return this.http.patch(`${API_URL}/menu/${id}`, data);
  }

  deleteMenu(id: string) {
    return this.http.delete(`${API_URL}/menu/${id}`);
  }
}
