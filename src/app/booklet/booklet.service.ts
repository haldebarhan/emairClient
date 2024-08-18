import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../helpers/api.url';
import { Observable } from 'rxjs';
import { Booklet } from '../models/booklet';

@Injectable({
  providedIn: 'root',
})
export class BookletService {
  constructor(private http: HttpClient) {}

  findOneByMagId(magasinId: string): Observable<Booklet | null> {
    return this.http.get<Booklet>(`${API_URL}/booklet/${magasinId}`);
  }
}
