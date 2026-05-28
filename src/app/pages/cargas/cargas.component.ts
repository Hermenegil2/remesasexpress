import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Carga } from '../../core/interfaces';

@Component({
  selector: 'app-cargas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-5 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Gestión de Cargas</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ cargas().length }} cargas registradas</p>
        </div>
        <button class="btn-premium-primary">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Carga
        </button>
      </div>

      <div class="card-premium overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Tracking</th>
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Cliente</th>
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Descripción</th>
                <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Origen → Destino</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Peso</th>
                <th class="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Costo</th>
                <th class="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
                <th class="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Pago</th>
              </tr>
            </thead>
            <tbody>
              @for (carga of cargas(); track carga.id) {
                <tr class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors cursor-pointer" (click)="selectedCarga.set(carga)">
                  <td class="px-4 py-3.5">
                    <span class="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">{{ carga.trackingNumber }}</span>
                  </td>
                  <td class="px-4 py-3.5">
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ carga.clienteNombre }}</span>
                  </td>
                  <td class="px-4 py-3.5">
                    <p class="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[180px]">{{ carga.descripcion }}</p>
                  </td>
                  <td class="px-4 py-3.5">
                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ carga.origen }} → {{ carga.destino }}</p>
                  </td>
                  <td class="px-4 py-3.5 text-right text-sm text-gray-700 dark:text-gray-300">{{ carga.peso }} kg</td>
                  <td class="px-4 py-3.5 text-right text-sm font-medium text-gray-900 dark:text-gray-100">{{ carga.costo | currency:'USD':'symbol':'1.0-0' }}</td>
                  <td class="px-4 py-3.5 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" [class]="getEstadoBadge(carga.estado)">
                      <span class="w-1.5 h-1.5 rounded-full" [class]="getEstadoDot(carga.estado)"></span>
                      {{ getEstadoLabel(carga.estado) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" [class]="getPagoBadge(carga.estadoPago)">
                      {{ getPagoLabel(carga.estadoPago) }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (selectedCarga(); as carga) {
        <div class="card-premium p-6 animate-fade-in">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ carga.trackingNumber }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ carga.descripcion }}</p>
              </div>
            </div>
            <button class="btn-premium-ghost text-sm" (click)="selectedCarga.set(null)">Cerrar</button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Cliente</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ carga.clienteNombre }}</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Ruta</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ carga.origen }} → {{ carga.destino }}</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Peso</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ carga.peso }} kg</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Costo</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ carga.costo | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Timeline de la Carga</h4>
            <div class="relative">
              <div class="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 z-10">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Recibido en origen</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ carga.fechaRecepcion | date:'dd MMM yyyy' }}</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                       [class]="carga.estado === 'recibido' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-emerald-500'">
                    @if (carga.estado !== 'recibido') {
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    } @else {
                      <div class="w-3 h-3 rounded-full bg-white"></div>
                    }
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">En tránsito</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Salida desde {{ carga.origen }}</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                       [class]="carga.estado === 'recibido' || carga.estado === 'en_transito' ? 'bg-gray-300 dark:bg-gray-600' : 'bg-emerald-500'">
                    @if (!(carga.estado === 'recibido' || carga.estado === 'en_transito')) {
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    } @else {
                      <div class="w-3 h-3 rounded-full bg-white"></div>
                    }
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Proceso de aduana</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Llegada estimada: {{ carga.fechaLlegadaEstimada | date:'dd MMM yyyy' }}</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                       [class]="carga.estado === 'entregado' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'">
                    @if (carga.estado === 'entregado') {
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    } @else {
                      <div class="w-3 h-3 rounded-full bg-white"></div>
                    }
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Entregado</p>
                    @if (carga.fechaEntrega) {
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ carga.fechaEntrega | date:'dd MMM yyyy' }}</p>
                    } @else {
                      <p class="text-xs text-gray-400 dark:text-gray-500">Pendiente</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CargasComponent implements OnInit {
  private dataService = inject(DataService);
  cargas = signal<Carga[]>([]);
  selectedCarga = signal<Carga | null>(null);

  ngOnInit() {
    this.dataService.getCargas().subscribe(c => this.cargas.set(c));
  }

  getEstadoBadge(estado: string): string {
    const map: Record<string, string> = {
      recibido: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      en_transito: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      aduana: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      en_entrega: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      entregado: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      retenido: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[estado] || 'bg-gray-100 text-gray-600';
  }

  getEstadoDot(estado: string): string {
    const map: Record<string, string> = {
      recibido: 'bg-blue-500', en_transito: 'bg-amber-500', aduana: 'bg-purple-500',
      en_entrega: 'bg-cyan-500', entregado: 'bg-emerald-500', retenido: 'bg-red-500',
    };
    return map[estado] || 'bg-gray-400';
  }

  getEstadoLabel(estado: string): string {
    const map: Record<string, string> = {
      recibido: 'Recibido', en_transito: 'En Tránsito', aduana: 'En Aduana',
      en_entrega: 'En Entrega', entregado: 'Entregado', retenido: 'Retenido',
    };
    return map[estado] || estado;
  }

  getPagoBadge(estado: string): string {
    const map: Record<string, string> = {
      pagado: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      parcial: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      pendiente: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[estado] || 'bg-gray-100 text-gray-600';
  }

  getPagoLabel(estado: string): string {
    const map: Record<string, string> = { pagado: 'Pagado', parcial: 'Parcial', pendiente: 'Pendiente' };
    return map[estado] || estado;
  }
}
