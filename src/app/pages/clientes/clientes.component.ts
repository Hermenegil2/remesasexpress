import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Cliente } from '../../core/interfaces';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="space-y-5 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Clientes</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ filteredClientes().length }} clientes registrados</p>
        </div>
        <button class="btn-premium-primary">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
          Nuevo Cliente
        </button>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div class="flex gap-2 flex-wrap">
          @for (f of filters; track f.key) {
            <button class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                    [class]="activeFilter === f.key ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
                    (click)="activeFilter = f.key; applyFilter()">
              {{ f.label }}
            </button>
          }
        </div>
        <div class="relative w-full sm:w-72">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" placeholder="Buscar clientes..." class="input-search" [(ngModel)]="searchTerm" (input)="applyFilter()"/>
        </div>
      </div>

      <div class="card-premium overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Cliente</th>
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Contacto</th>
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Total Cargas</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Total Pagado</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Deuda Pendiente</th>
                <th class="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Acción</th>
              </tr>
            </thead>
            <tbody>
              @for (cliente of filteredClientes(); track cliente.id) {
                <tr class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer" (click)="selectedCliente.set(cliente)">
                  <td class="px-4 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold"
                           [class]="cliente.tipo === 'empresarial' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'">
                        {{ cliente.nombre.charAt(0) }}{{ cliente.nombre.split(' ')[1]?.charAt(0) || '' }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ cliente.nombre }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ cliente.tipo === 'empresarial' ? 'Empresarial' : 'Individual' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3.5">
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ cliente.email }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ cliente.telefono }}</p>
                  </td>
                  <td class="px-4 py-3.5">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          [class]="getEstadoBadge(cliente.estado)">
                      <span class="w-1.5 h-1.5 rounded-full" [class]="getEstadoDot(cliente.estado)"></span>
                      {{ getEstadoLabel(cliente.estado) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-right text-sm font-medium text-gray-900 dark:text-gray-100">{{ cliente.totalCargas }}</td>
                  <td class="px-4 py-3.5 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{{ cliente.totalPagado | currency:'USD':'symbol':'1.0-0' }}</td>
                  <td class="px-4 py-3.5 text-right">
                    @if (cliente.deudaPendiente > 0) {
                      <span class="text-sm font-medium text-red-500">{{ cliente.deudaPendiente | currency:'USD':'symbol':'1.0-0' }}</span>
                    } @else {
                      <span class="text-sm text-gray-400">—</span>
                    }
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <button class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (selectedCliente(); as cliente) {
        <div class="card-premium p-6 animate-fade-in">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                   [class]="cliente.tipo === 'empresarial' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'">
                {{ cliente.nombre.charAt(0) }}{{ cliente.nombre.split(' ')[1]?.charAt(0) || '' }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ cliente.nombre }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Cliente desde {{ cliente.fechaRegistro | date:'MMMM yyyy' }}</p>
              </div>
            </div>
            <button class="btn-premium-ghost text-sm" (click)="selectedCliente.set(null)">Cerrar</button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Cargas</p>
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ cliente.totalCargas }}</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Pagado</p>
              <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ cliente.totalPagado | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Deuda Pendiente</p>
              <p class="text-xl font-bold text-red-500">{{ cliente.deudaPendiente | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Última Actividad</p>
              <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ cliente.ultimaActividad | date:'dd/MM/yy' }}</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button class="btn-premium-primary text-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Ver Estado de Cuenta
            </button>
            <button class="btn-premium-ghost text-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Historial de Cargas
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ClientesComponent implements OnInit {
  private dataService = inject(DataService);
  clientes = signal<Cliente[]>([]);
  filteredClientes = signal<Cliente[]>([]);
  selectedCliente = signal<Cliente | null>(null);
  searchTerm = '';
  activeFilter = 'todos';

  filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'activo', label: 'Activos' },
    { key: 'inactivo', label: 'Inactivos' },
    { key: 'empresarial', label: 'Empresarial' },
    { key: 'individual', label: 'Individual' },
    { key: 'deuda', label: 'Con Deuda' },
  ];

  ngOnInit() {
    this.dataService.getClientes().subscribe(c => {
      this.clientes.set(c);
      this.applyFilter();
    });
  }

  applyFilter() {
    let result = this.clientes();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(c =>
        c.nombre.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term)
      );
    }

    switch (this.activeFilter) {
      case 'activo': result = result.filter(c => c.estado === 'activo'); break;
      case 'inactivo': result = result.filter(c => c.estado === 'inactivo'); break;
      case 'empresarial': result = result.filter(c => c.tipo === 'empresarial'); break;
      case 'individual': result = result.filter(c => c.tipo === 'individual'); break;
      case 'deuda': result = result.filter(c => c.deudaPendiente > 0); break;
    }

    this.filteredClientes.set(result);
  }

  getEstadoBadge(estado: string): string {
    switch (estado) {
      case 'activo': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'inactivo': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      case 'suspendido': return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getEstadoDot(estado: string): string {
    switch (estado) {
      case 'activo': return 'bg-emerald-500';
      case 'inactivo': return 'bg-gray-400';
      case 'suspendido': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'suspendido': return 'Suspendido';
      default: return estado;
    }
  }
}
