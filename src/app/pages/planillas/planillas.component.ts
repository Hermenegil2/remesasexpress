import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { PlanillaCobro } from '../../core/interfaces';

@Component({
  selector: 'app-planillas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-5 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Planillas de Cobro</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ planillas().length }} planillas emitidas</p>
        </div>
        <button class="btn-premium-primary">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Planilla
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-premium p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Pagadas</p>
            <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ planillas().filter(p => p.estado === 'pagado').length }}</p>
          </div>
        </div>
        <div class="card-premium p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Pendientes</p>
            <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ planillas().filter(p => p.estado === 'pendiente' || p.estado === 'parcial').length }}</p>
          </div>
        </div>
        <div class="card-premium p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Vencidas</p>
            <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ planillas().filter(p => p.estado === 'vencido').length }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        @for (planilla of planillas(); track planilla.id) {
          <div class="card-premium p-5 cursor-pointer hover:shadow-md transition-all" (click)="selectedPlanilla.set(planilla)">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ planilla.numeroFactura }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ planilla.clienteNombre }}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">Emisión: {{ planilla.fechaEmision | date:'dd/MM/yyyy' }} · Vence: {{ planilla.fechaVencimiento | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ planilla.montoTotal | currency:'USD':'symbol':'1.0-0' }}</p>
                </div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                      [class]="getEstadoBadge(planilla.estado)">
                  <span class="w-1.5 h-1.5 rounded-full" [class]="getEstadoDot(planilla.estado)"></span>
                  {{ getEstadoLabel(planilla.estado) }}
                </span>
                <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      @if (selectedPlanilla(); as planilla) {
        <div class="card-premium p-6 animate-fade-in">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ planilla.numeroFactura }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ planilla.clienteNombre }}</p>
            </div>
            <div class="flex gap-2">
              <button class="btn-premium-ghost text-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Imprimir
              </button>
              <button class="btn-premium-ghost text-sm" (click)="selectedPlanilla.set(null)">Cerrar</button>
            </div>
          </div>

          <div class="overflow-x-auto mb-6">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 dark:border-gray-800">
                  <th class="text-left px-3 py-2 text-xs font-semibold uppercase text-gray-500">Descripción</th>
                  <th class="text-center px-3 py-2 text-xs font-semibold uppercase text-gray-500">Cant.</th>
                  <th class="text-right px-3 py-2 text-xs font-semibold uppercase text-gray-500">Precio Unit.</th>
                  <th class="text-right px-3 py-2 text-xs font-semibold uppercase text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                @for (item of planilla.items; track item.descripcion) {
                  <tr class="border-b border-gray-50 dark:border-gray-800/50">
                    <td class="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">{{ item.descripcion }}</td>
                    <td class="px-3 py-3 text-sm text-center text-gray-700 dark:text-gray-300">{{ item.cantidad }}</td>
                    <td class="px-3 py-3 text-sm text-right text-gray-700 dark:text-gray-300">{{ item.precioUnitario | currency:'USD':'symbol':'1.0-0' }}</td>
                    <td class="px-3 py-3 text-sm text-right font-medium text-gray-900 dark:text-gray-100">{{ item.total | currency:'USD':'symbol':'1.0-0' }}</td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="px-3 py-3 text-sm font-semibold text-right text-gray-900 dark:text-gray-100">Total</td>
                  <td class="px-3 py-3 text-sm font-bold text-right text-gray-900 dark:text-gray-100">{{ planilla.montoTotal | currency:'USD':'symbol':'1.0-0' }}</td>
                </tr>
                <tr>
                  <td colspan="3" class="px-3 py-2 text-sm font-semibold text-right text-gray-500">Pagado</td>
                  <td class="px-3 py-2 text-sm font-bold text-right text-emerald-600">{{ planilla.montoPagado | currency:'USD':'symbol':'1.0-0' }}</td>
                </tr>
                <tr>
                  <td colspan="3" class="px-3 py-2 text-sm font-semibold text-right text-gray-500">Saldo Pendiente</td>
                  <td class="px-3 py-2 text-sm font-bold text-right text-red-500">{{ (planilla.montoTotal - planilla.montoPagado) | currency:'USD':'symbol':'1.0-0' }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class PlanillasComponent implements OnInit {
  private dataService = inject(DataService);
  planillas = signal<PlanillaCobro[]>([]);
  selectedPlanilla = signal<PlanillaCobro | null>(null);

  ngOnInit() {
    this.dataService.getPlanillas().subscribe(p => this.planillas.set(p));
  }

  getEstadoBadge(estado: string): string {
    const map: Record<string, string> = {
      pagado: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      pendiente: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      vencido: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      parcial: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return map[estado] || 'bg-gray-100 text-gray-600';
  }

  getEstadoDot(estado: string): string {
    const map: Record<string, string> = {
      pagado: 'bg-emerald-500', pendiente: 'bg-amber-500', vencido: 'bg-red-500', parcial: 'bg-blue-500',
    };
    return map[estado] || 'bg-gray-400';
  }

  getEstadoLabel(estado: string): string {
    const map: Record<string, string> = { pagado: 'Pagado', pendiente: 'Pendiente', vencido: 'Vencido', parcial: 'Parcial' };
    return map[estado] || estado;
  }
}
