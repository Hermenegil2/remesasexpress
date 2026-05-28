import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { DashboardData, Transaccion } from '../../core/interfaces';

interface KpiCard {
  label: string;
  value: number;
  prefix: string;
  icon: string;
  variant: 'primary' | 'green' | 'orange' | 'red';
  trend: number;
  trendLabel: string;
}

interface AlertItem {
  type: 'warning' | 'danger' | 'info' | 'success';
  message: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, DecimalPipe],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ currentDate | date:"EEEE, d 'de' MMMM 'de' yyyy" }}
          </p>
        </div>
        <div class="flex gap-3">
          <button class="btn-premium-ghost">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Exportar
          </button>
          <button class="btn-premium-primary">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Reporte
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        @for (kpi of kpis; track kpi.label) {
          <div class="card-premium p-5 card-hover">
            <div class="flex items-start justify-between mb-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                   [class]="getKpiIconBg(kpi.variant)">
                <span [innerHTML]="kpi.icon" class="w-5 h-5"></span>
              </div>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    [class]="kpi.trend >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  @if (kpi.trend >= 0) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  }
                </svg>
                {{ kpi.trend >= 0 ? '+' : '' }}{{ kpi.trend }}%
              </span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ kpi.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ kpi.prefix }}{{ kpi.value | number:'1.0-0' }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ kpi.trendLabel }}</p>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="card-premium p-5 lg:col-span-2">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Ingresos vs Gastos - Mayo 2026</h3>
            <div class="flex gap-2">
              <button class="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Semanal</button>
              <button class="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">Mensual</button>
            </div>
          </div>
          <div class="relative h-64">
            <svg class="w-full h-full" viewBox="0 0 600 240">
              <defs>
                <linearGradient id="areaIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#059669" stop-opacity="0.2"/>
                  <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
                </linearGradient>
                <linearGradient id="areaGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#dc2626" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,200 L30,180 L60,160 L90,170 L120,140 L150,120 L180,130 L210,100 L240,110 L270,90 L300,80 L330,60 L360,70 L390,50 L420,55 L450,40 L480,45 L510,30 L540,35 L570,20 L600,25 L600,240 L0,240 Z" fill="url(#areaIngresos)"/>
              <path d="M0,220 L30,210 L60,190 L90,200 L120,185 L150,175 L180,195 L210,160 L240,170 L270,155 L300,145 L330,130 L360,140 L390,125 L420,135 L450,115 L480,120 L510,105 L540,110 L570,95 L600,100 L600,240 L0,240 Z" fill="url(#areaGastos)"/>
              <path d="M0,200 L30,180 L60,160 L90,170 L120,140 L150,120 L180,130 L210,100 L240,110 L270,90 L300,80 L330,60 L360,70 L390,50 L420,55 L450,40 L480,45 L510,30 L540,35 L570,20 L600,25" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M0,220 L30,210 L60,190 L90,200 L120,185 L150,175 L180,195 L210,160 L240,170 L270,155 L300,145 L330,130 L360,140 L390,125 L420,135 L450,115 L480,120 L510,105 L540,110 L570,95 L600,100" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 2"/>
            </svg>
            <div class="absolute top-2 right-4 space-y-1.5">
              <div class="flex items-center gap-2 text-xs">
                <span class="w-3 h-0.5 bg-emerald-500 rounded"></span>
                <span class="text-gray-500">Ingresos</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="w-3 h-0.5 bg-red-400 rounded"></span>
                <span class="text-gray-500">Gastos</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-premium p-5">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Alertas</h3>
          <div class="space-y-3">
            @for (alert of alerts; track alert.message) {
              <div class="flex items-start gap-3 p-3 rounded-xl"
                   [class]="getAlertBg(alert.type)">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                     [class]="getAlertIconBg(alert.type)"
                     [innerHTML]="getAlertIcon(alert.type)">
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ alert.message }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ alert.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="card-premium p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Últimos Movimientos</h3>
            <a class="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Ver todos</a>
          </div>
          <div class="space-y-1">
            @for (trx of transacciones; track trx.id) {
              <div class="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                       [class]="trx.tipo === 'ingreso' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'">
                    <svg class="w-4 h-4" [class]="trx.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      @if (trx.tipo === 'ingreso') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                      } @else {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                      }
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ trx.descripcion }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ trx.fecha | date:'dd/MM/yyyy' }} · {{ trx.clienteNombre || trx.categoria }}</p>
                  </div>
                </div>
                <span class="text-sm font-semibold whitespace-nowrap ml-4"
                      [class]="trx.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-500'">
                  {{ trx.tipo === 'ingreso' ? '+' : '-' }}{{ trx.monto | currency:'USD':'symbol':'1.0-0' }}
                </span>
              </div>
            }
          </div>
        </div>

        <div class="card-premium p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Cargas en Tránsito</h3>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs text-gray-500">{{ cargasActivas }} activas</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400">Por recibir</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">12</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400">En aduana</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">8</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400">En entrega</p>
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100">15</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400">Retenidas</p>
              <p class="text-lg font-bold text-red-500">3</p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Distribución por Forwarder</h4>
            </div>
            <div class="space-y-2.5">
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-600 dark:text-gray-400">CargoLink</span>
                  <span class="text-gray-900 dark:text-gray-100 font-medium">45%</span>
                </div>
                <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" style="width:45%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-600 dark:text-gray-400">Global Freight</span>
                  <span class="text-gray-900 dark:text-gray-100 font-medium">30%</span>
                </div>
                <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" style="width:30%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-gray-600 dark:text-gray-400">ShipPro</span>
                  <span class="text-gray-900 dark:text-gray-100 font-medium">25%</span>
                </div>
                <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full" style="width:25%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private dataService = inject(DataService);
  currentDate = new Date();
  kpis: KpiCard[] = [];
  alerts: AlertItem[] = [];
  transacciones: Transaccion[] = [];
  cargasActivas = 0;

  ngOnInit() {
    this.dataService.getDashboard().subscribe(data => {
      this.kpis = [
        {
          label: 'Total Cobrado',
          value: data.totalCobrado, prefix: '$', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
          variant: 'primary', trend: 12.5, trendLabel: 'vs. mes anterior'
        },
        {
          label: 'Pendiente de Cobro',
          value: data.totalPendiente, prefix: '$', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
          variant: 'orange', trend: -3.2, trendLabel: 'vs. mes anterior'
        },
        {
          label: 'Utilidad Semanal',
          value: data.utilidadSemanal, prefix: '$', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
          variant: 'green', trend: 8.1, trendLabel: 'vs. semana anterior'
        },
        {
          label: 'Utilidad Mensual',
          value: data.utilidadMensual, prefix: '$', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
          variant: 'primary', trend: 5.7, trendLabel: 'vs. mes anterior'
        },
      ];
      this.cargasActivas = data.cargasActivas;
    });

    this.dataService.getTransaccionesRecientes(5).subscribe(t => this.transacciones = t);

    this.alerts = [
      { type: 'danger', message: 'Deuda con ShipPro Logistics vencida desde hace 11 días', time: 'Hace 2 horas' },
      { type: 'warning', message: 'Carga CRG-006 retenida en aduana - Documentación pendiente', time: 'Hace 5 horas' },
      { type: 'info', message: '3 clientes con facturas por vencer en los próximos 3 días', time: 'Hace 8 horas' },
      { type: 'success', message: 'Pago de $18,500 a CargoLink procesado exitosamente', time: 'Ayer' },
      { type: 'warning', message: 'Límite de crédito cercano para Distribuidora Nacional SRL', time: 'Ayer' },
    ];
  }

  getKpiIconBg(variant: string): string {
    const map: Record<string, string> = {
      primary: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      orange: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[variant] || map['primary'];
  }

  getAlertBg(type: string): string {
    const map: Record<string, string> = {
      danger: 'bg-red-50 dark:bg-red-900/10',
      warning: 'bg-amber-50 dark:bg-amber-900/10',
      info: 'bg-blue-50 dark:bg-blue-900/10',
      success: 'bg-emerald-50 dark:bg-emerald-900/10',
    };
    return map[type] || map['info'];
  }

  getAlertIconBg(type: string): string {
    const map: Record<string, string> = {
      danger: 'bg-red-100 dark:bg-red-900/30',
      warning: 'bg-amber-100 dark:bg-amber-900/30',
      info: 'bg-blue-100 dark:bg-blue-900/30',
      success: 'bg-emerald-100 dark:bg-emerald-900/30',
    };
    return map[type] || map['info'];
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'danger': return '<svg class="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';
      case 'warning': return '<svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      case 'info': return '<svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      case 'success': return '<svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
      default: return '';
    }
  }
}
