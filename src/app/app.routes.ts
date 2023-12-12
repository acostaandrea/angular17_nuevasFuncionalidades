import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '', loadComponent: () => import('./login/login.component')
  },
  {
    path: 'logout', loadComponent: () => import('./logout/logout.component')
  }
];
