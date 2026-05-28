import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  register(data: any) {
    return this.http.post<any>(`${API}/auth/register`, data).pipe(
      tap(res => this.saveSession(res)),
    );
  }

  login(login: string, password: string) {
    return this.http.post<any>(`${API}/auth/login`, { login, password }).pipe(
      tap(res => this.saveSession(res)),
    );
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAdmin() { return this.currentUser()?.is_admin === true; }
  isLoggedIn() { return !!localStorage.getItem('token'); }

  private saveSession(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }
}
