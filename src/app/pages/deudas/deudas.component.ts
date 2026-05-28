import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { DeudaForwarder } from '../../core/interfaces';

@Component({
  selector: 'app-deudas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <div class="space-y-5 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Deudas con Forwarders</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Control de cuentas por pagar</p>
        </div>
        <button class="btn-premium-green">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Registrar Pago
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card-premium p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Deuda Total</p>
          <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalDeuda | currency:'USD':'symbol':'1.0-0' }}</p>
        </div>
        <div class="card-premium p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Pagado</p>
          <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ totalPagado | currency:'USD':'symbol':'1.0-0' }}</p>
        </div>
        <div class="card-premium p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Pendiente</p>
          <p class="text-xl font-bold text-amber-600 dark:text-amber-400">{{ pendiente | currency:'USD':'symbol':'1.0-0' }}</p>
        </div>
        <div class="card-premium p-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Vencido</p>
          <p class="text-xl font-bold text-red-600 dark:text-red-400">{{ vencido | currency:'USD':'symbol':'1.0-0' }}</p>
        </div>
      </div>

      <div class="card-premium overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Forwarder</th>
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Concepto</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Monto Total</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Pagado</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Saldo</th>
                <th class="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Vencimiento</th>
                <th class="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                <th class="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              @for (deuda of deudas(); track deuda.id) {
                <tr class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td class="px-4 py-3.5">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ deuda.forwarderNombre }}</span>
                  </td>
                  <td class="px-4 py-3.5">
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ deuda.concepto }}</span>
                  </td>
                  <td class="px-4 py-3.5 text-right text-sm font-medium text-gray-900 dark:text-gray-100">{{ deuda.montoTotal | currency:'USD':'symbol':'1.0-0' }}</td>
                  <td class="px-4 py-3.5 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">{{ deuda.montoPagado | currency:'USD':'symbol':'1.0-0' }}</td>
                  <td class="px-4 py-3.5 text-right">
                    @if (deuda.montoTotal - deuda.montoPagado > 0) {
                      <span class="text-sm font-semibold text-red-500">{{ (deuda.montoTotal - deuda.montoPagado) | currency:'USD':'symbol':'1.0-0' }}</span>
                    } @else {
                      <span class="text-sm text-gray-400">—</span>
                    }
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <span class="text-sm" [class]="isVencida(deuda) ? 'text-red-500 font-medium' : 'text-gray-700 dark:text-gray-300'">
                      {{ deuda.fechaVencimiento | date:'dd/MM/yyyy' }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          [class]="getEstadoBadge(deuda.estado)">
                      <span class="w-1.5 h-1.5 rounded-full" [class]="getEstadoDot(deuda.estado)"></span>
                      {{ getEstadoLabel(deuda.estado) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                          [class]="getPrioridadBadge(deuda.prioridad)">
                      {{ deuda.prioridad | titlecase }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-premium p-5">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Indicadores de Riesgo</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-red-700 dark:text-red-400">Riesgo Crítico</p>
                <p class="text-xs text-red-600 dark:text-red-400/80">1 deuda vencida sin pago</p>
              </div>
            </div>
            <p class="text-2xl font-bold text-red-700 dark:text-red-400">$8,900</p>
            <p class="text-xs text-red-600 dark:text-red-400/60 mt-1">ShipPro Logistics - Vencido</p>
          </div>
          <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-amber-700 dark:text-amber-400">Atención Requerida</p>
                <p class="text-xs text-amber-600 dark:text-amber-400/80">2 deudas con pagos parciales</p>
              </div>
            </div>
            <p class="text-2xl font-bold text-amber-700 dark:text-amber-400">$17,200</p>
            <p class="text-xs text-amber-600 dark:text-amber-400/60 mt-1">Global Freight · Oceanic Express</p>
          </div>
          <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Al Día</p>
                <p class="text-xs text-emerald-600 dark:text-emerald-400/80">2 deudas completamente pagadas</p>
              </div>
            </div>
            <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-400">$24,100</p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400/60 mt-1">CargoLink International</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DeudasComponent implements OnInit {
  private dataService = inject(DataService);
  deudas = signal<DeudaForwarder[]>([]);
  totalDeuda = 0;
  totalPagado = 0;
  pendiente = 0;
  vencido = 0;

  ngOnInit() {
    this.dataService.getDeudasForwarders().subscribe(d => {
      this.deudas.set(d);
      this.totalDeuda = d.reduce((s, x) => s + x.montoTotal, 0);
      this.totalPagado = d.reduce((s, x) => s + x.montoPagado, 0);
      this.pendiente = d.filter(x => x.estado === 'pendiente' || x.estado === 'parcial').reduce((s, x) => s + (x.montoTotal - x.montoPagado), 0);
      this.vencido = d.filter(x => x.estado === 'vencido').reduce((s, x) => s + (x.montoTotal - x.montoPagado), 0);
    });
  }

  isVencida(deuda: DeudaForwarder): boolean {
    return new Date(deuda.fechaVencimiento) < new Date() && deuda.estado !== 'pagado';
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

  getPrioridadBadge(p: string): string {
    const map: Record<string, string> = {
      baja: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      media: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      alta: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      critica: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[p] || map['baja'];
  }
}
