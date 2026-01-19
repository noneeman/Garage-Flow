import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-page.component').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'work-orders',
        loadComponent: () => import('./features/work-orders/work-orders-page.component').then((m) => m.WorkOrdersPageComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customers-page.component').then((m) => m.CustomersPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
