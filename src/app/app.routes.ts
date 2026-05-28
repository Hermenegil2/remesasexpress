import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes.component').then(m => m.ClientesComponent) },
      { path: 'cargas', loadComponent: () => import('./pages/cargas/cargas.component').then(m => m.CargasComponent) },
      { path: 'planillas', loadComponent: () => import('./pages/planillas/planillas.component').then(m => m.PlanillasComponent) },
      { path: 'deudas', loadComponent: () => import('./pages/deudas/deudas.component').then(m => m.DeudasComponent) },
      { path: 'reportes', loadComponent: () => import('./pages/reports/reportes.component').then(m => m.ReportesComponent) },
      { path: 'configuracion', loadComponent: () => import('./pages/settings/configuracion.component').then(m => m.ConfiguracionComponent) },
    ],
  },
];
