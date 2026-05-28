import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  template: `
    <div class="space-y-5 animate-fade-in">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Reportes Financieros</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Resumen de ingresos, gastos y utilidades</p>
        </div>
        <div class="flex gap-2">
          <button class="px-4 py-2 text-sm font-medium rounded-xl transition-all"
                  [class]="viewType() === 'semanal' ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'btn-premium-ghost'"
                  (click)="viewType.set('semanal')">
            Semanal
          </button>
          <button class="px-4 py-2 text-sm font-medium rounded-xl transition-all"
                  [class]="viewType() === 'mensual' ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'btn-premium-ghost'"
                  (click)="viewType.set('mensual')">
            Mensual
          </button>
          <button class="btn-premium-ghost">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Exportar
          </button>
        </div>
      </div>

      @if (viewType() === 'semanal') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="card-premium p-5 lg:col-span-2">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Resumen Semanal</h3>
            <div class="flex items-end gap-3 h-64 pt-4">
              @for (d of reporteSemanal(); track d.dia) {
                <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">\${{ d.utilidad | number:'1.0-0' }}</span>
                  <div class="w-full rounded-lg transition-all duration-500"
                       [style.height.%]="(d.utilidad / maxUtilidad) * 85"
                       [class]="getBarColor(d.utilidad)">
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ d.dia }}</span>
                </div>
              }
            </div>
          </div>
          <div class="space-y-3">
            @for (d of reporteSemanal(); track d.dia) {
              <div class="card-premium p-3">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ d.dia }}</p>
                  <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">\${{ d.utilidad | number:'1.0-0' }}</span>
                </div>
                <div class="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>Ing: \${{ d.ingresos | number:'1.0-0' }}</span>
                  <span>Gas: \${{ d.gastos | number:'1.0-0' }}</span>
                </div>
                <div class="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div class="h-full bg-emerald-500 rounded-full" [style.width.%]="(d.utilidad / maxUtilidad) * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (viewType() === 'mensual') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div class="card-premium p-5 lg:col-span-2">
            <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">Resumen Mensual</h3>
            <div class="flex items-end gap-4 h-72 pt-4">
              @for (d of reporteMensual(); track d.mes) {
                <div class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">\${{ d.ingresos | number:'1.0-0' }}</span>
                  <div class="w-full bg-emerald-500/80 rounded-t-lg"
                       [style.height.%]="(d.ingresos / maxMensual) * 80">
                  </div>
                  <div class="w-full bg-red-400/60 rounded-t-lg"
                       [style.height.%]="(d.gastos / maxMensual) * 80">
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{{ d.mes }}</span>
                </div>
              }
            </div>
            <div class="flex gap-6 mt-4 justify-center">
              <div class="flex items-center gap-2 text-xs">
                <span class="w-3 h-3 rounded bg-emerald-500"></span>
                <span class="text-gray-500 dark:text-gray-400">Ingresos</span>
              </div>
              <div class="flex items-center gap-2 text-xs">
                <span class="w-3 h-3 rounded bg-red-400"></span>
                <span class="text-gray-500 dark:text-gray-400">Gastos</span>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="card-premium p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Ingresos</p>
              <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ totalIngresos | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="card-premium p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Gastos</p>
              <p class="text-2xl font-bold text-red-500">{{ totalGastos | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="card-gradient p-5">
              <p class="text-xs text-white/70 mb-1">Utilidad Total</p>
              <p class="text-3xl font-bold text-white">{{ totalUtilidad | currency:'USD':'symbol':'1.0-0' }}</p>
              <p class="text-xs text-white/50 mt-1">Enero - Mayo 2026</p>
            </div>
            <div class="card-premium p-4">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Cargas Procesadas</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ totalCargas }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ReportesComponent implements OnInit {
  private dataService = inject(DataService);
  viewType = signal<'semanal' | 'mensual'>('semanal');
  reporteSemanal = signal<any[]>([]);
  reporteMensual = signal<any[]>([]);
  totalIngresos = 0;
  totalGastos = 0;
  totalUtilidad = 0;
  totalCargas = 0;
  maxUtilidad = 1;
  maxMensual = 1;

  ngOnInit() {
    this.dataService.getReportesSemanales().subscribe(d => {
      this.reporteSemanal.set(d);
      this.maxUtilidad = Math.max(...d.map((x: any) => x.utilidad), 1);
    });
    this.dataService.getReportesMensuales().subscribe(d => {
      this.reporteMensual.set(d);
      this.totalIngresos = d.reduce((s: number, x: any) => s + x.ingresos, 0);
      this.totalGastos = d.reduce((s: number, x: any) => s + x.gastos, 0);
      this.totalUtilidad = d.reduce((s: number, x: any) => s + x.utilidad, 0);
      this.totalCargas = d.reduce((s: number, x: any) => s + x.cargas, 0);
      this.maxMensual = Math.max(...d.map((x: any) => Math.max(x.ingresos, x.gastos)), 1);
    });
  }

  getBarColor(utilidad: number): string {
    if (utilidad > 4000) return 'bg-emerald-500';
    if (utilidad > 2000) return 'bg-emerald-400';
    if (utilidad > 1000) return 'bg-amber-400';
    return 'bg-red-400';
  }
}
