import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private http: HttpClient) {}

  create(data: { application_id: number; review_text: string }) {
    return this.http.post(`${API}/reviews`, data);
  }
}
