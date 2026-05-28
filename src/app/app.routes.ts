import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'applications',
    loadComponent: () => import('./pages/applications/applications.component').then(m => m.ApplicationsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'applications/new',
    loadComponent: () => import('./pages/create-application/create-application.component').then(m => m.CreateApplicationComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard],
  },
  { path: '**', redirectTo: '/login' },
];
