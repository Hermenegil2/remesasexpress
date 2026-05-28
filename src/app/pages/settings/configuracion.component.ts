import { Component, OnInit, inject, signal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Usuario } from '../../core/interfaces';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Configuración</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Administración del sistema</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1 space-y-2">
          @for (tab of tabs; track tab.key) {
            <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    [class]="activeTab === tab.key ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'"
                    (click)="activeTab = tab.key">
              <span [innerHTML]="tab.icon" class="w-5 h-5"></span>
              {{ tab.label }}
            </button>
          }
        </div>

        <div class="lg:col-span-3">
          @if (activeTab === 'usuarios') {
            <div class="card-premium p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Usuarios del Sistema</h3>
                <button class="btn-premium-primary text-sm">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Nuevo Usuario
                </button>
              </div>
              <div class="space-y-2">
                @for (user of usuarios(); track user.id) {
                  <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {{ getInitials(user.nombre) }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.nombre }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }} · {{ getRolLabel(user.rol) }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                            [class]="user.activo ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'">
                        <span class="w-1.5 h-1.5 rounded-full" [class]="user.activo ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                        {{ user.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                      <button class="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-400">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (activeTab === 'roles') {
            <div class="card-premium p-6">
              <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">Roles y Permisos</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (rol of roles; track rol.nombre) {
                  <div class="p-5 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                           [class]="rol.color">
                        <span [innerHTML]="rol.icon" class="w-5 h-5"></span>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ rol.nombre }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ rol.descripcion }}</p>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      @for (perm of rol.permisos; track perm) {
                        <span class="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{{ perm }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          @if (activeTab === 'preferencias') {
            <div class="card-premium p-6 space-y-6">
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferencias del Sistema</h3>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Moneda principal</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Moneda por defecto para reportes financieros</p>
                  </div>
                  <select class="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100">
                    <option>USD - Dólar Americano</option>
                    <option>DOP - Peso Dominicano</option>
                    <option>EUR - Euro</option>
                  </select>
                </div>
                <div class="h-px bg-gray-100 dark:bg-gray-800"></div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Formato de fecha</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Formato para mostrar fechas en el sistema</p>
                  </div>
                  <select class="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div class="h-px bg-gray-100 dark:bg-gray-800"></div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Notificaciones</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Recibir alertas de pagos vencidos y cargas retenidas</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" checked>
                    <div class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <div class="h-px bg-gray-100 dark:bg-gray-800"></div>
                <div class="flex items-center justify-between py-3">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Modo oscuro</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Alternar entre tema claro y oscuro</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          }

          @if (activeTab === 'empresa') {
            <div class="card-premium p-6">
              <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">Información de la Empresa</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre de la empresa</label>
                  <input type="text" class="input-search" value="RemesasExpress SRL" readonly>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">RNC / Identificación fiscal</label>
                  <input type="text" class="input-search" value="1-01-23456-7" readonly>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Teléfono</label>
                  <input type="text" class="input-search" value="+1 (809) 555-0000" readonly>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input type="text" class="input-search" value="info@remesasexpress.com" readonly>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dirección</label>
                  <input type="text" class="input-search" value="Av. Abraham Lincoln #123, Santo Domingo, República Dominicana" readonly>
                </div>
              </div>
              <div class="flex justify-end mt-6">
                <button class="btn-premium-primary">Guardar Cambios</button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ConfiguracionComponent implements OnInit {
  private dataService = inject(DataService);
  usuarios = signal<Usuario[]>([]);
  activeTab = 'usuarios';

  tabs = [
    { key: 'usuarios', label: 'Usuarios', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>' },
    { key: 'roles', label: 'Roles y Permisos', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>' },
    { key: 'preferencias', label: 'Preferencias', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
    { key: 'empresa', label: 'Empresa', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' },
  ];

  roles = [
    { nombre: 'Administrador', descripcion: 'Acceso completo al sistema', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>', permisos: ['Todo acceso', 'Usuarios', 'Reportes', 'Configuración'] },
    { nombre: 'Operador', descripcion: 'Gestión de cargas y clientes', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>', permisos: ['Clientes', 'Cargas', 'Planillas', 'Tracking'] },
    { nombre: 'Contador', descripcion: 'Módulos financieros y reportes', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>', permisos: ['Planillas', 'Deudas', 'Reportes', 'Dashboard'] },
    { nombre: 'Supervisor', descripcion: 'Visión general y auditoría', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', icon: '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>', permisos: ['Dashboard', 'Reportes', 'Clientes', 'Auditoría'] },
  ];

  ngOnInit() {
    this.dataService.getUsuarios().subscribe(u => this.usuarios.set(u));
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  getRolLabel(rol: string): string {
    const map: Record<string, string> = { admin: 'Administrador', operador: 'Operador', contador: 'Contador', supervisor: 'Supervisor' };
    return map[rol] || rol;
  }
}
