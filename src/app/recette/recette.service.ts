import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';
import { recette } from '../models/recette';

@Injectable({
  providedIn: 'root',
})
export class RecetteService {
  constructor(private http: HttpClient) {}

  getAllDenrees() {
    return this.http.get(`${API_URL}/denree`);
  }


  createRecette(data: recette){
    return this.http.post(`${API_URL}/recette`, data)
  }

  getAllRecette(){
    return this.http.get(`${API_URL}/recette`)
  }
}
