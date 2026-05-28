import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  constructor(private http: HttpClient) {}

  create(data: any)                        { return this.http.post(`${API}/applications`, data); }
  getMy()                                  { return this.http.get<any[]>(`${API}/applications/my`); }
  getAll()                                 { return this.http.get<any[]>(`${API}/applications`); }
  updateStatus(id: number, status: string) { return this.http.patch(`${API}/applications/${id}/status`, { status }); }
  delete(id: number)                       { return this.http.delete(`${API}/applications/${id}`); }
}
