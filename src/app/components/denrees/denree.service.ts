import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../helpers/api.url';
import { Denree } from '../../models/denree';

@Injectable({
  providedIn: 'root',
})
export class DenreeService {
  constructor(private http: HttpClient) {}

  getAllDenree() {
    return this.http.get(`${API_URL}/denree`);
  }

  getMesures() {
    return this.http.get(`${API_URL}/mesure`);
  }

  createDenree(data: Denree) {
    return this.http.post(`${API_URL}/denree`, data);
  }

  deleteDenree(id: string) {
    return this.http.delete(`${API_URL}/denree/${id}`);
  }

  getOneDenree(id: string) {
    return this.http.get(`${API_URL}/denree/${id}`);
  }

  updateDenree(id: string, data: Denree){
    return this.http.put(`${API_URL}/denree/${id}`, data)
  }
}
