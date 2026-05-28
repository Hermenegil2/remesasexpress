import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Cliente, Carga, PlanillaCobro, DeudaForwarder,
  Transaccion, DashboardData, Usuario
} from '../interfaces';
import {
  MOCK_DASHBOARD, MOCK_CLIENTES, MOCK_CARGAS,
  MOCK_PLANILLAS, MOCK_DEUDAS_FORWARDERS,
  MOCK_TRANSACCIONES, MOCK_USUARIOS,
  MOCK_REPORTES_SEMANALES, MOCK_REPORTES_MENSUALES
} from '../mocks/data';

@Injectable({ providedIn: 'root' })
export class DataService {
  private delay = 200;

  getDashboard(): Observable<DashboardData> {
    return of(MOCK_DASHBOARD).pipe(delay(this.delay));
  }

  getClientes(): Observable<Cliente[]> {
    return of(MOCK_CLIENTES).pipe(delay(this.delay));
  }

  getCliente(id: string): Observable<Cliente | undefined> {
    return of(MOCK_CLIENTES.find(c => c.id === id)).pipe(delay(this.delay));
  }

  getCargas(): Observable<Carga[]> {
    return of(MOCK_CARGAS).pipe(delay(this.delay));
  }

  getCargasByCliente(clienteId: string): Observable<Carga[]> {
    return of(MOCK_CARGAS.filter(c => c.clienteId === clienteId)).pipe(delay(this.delay));
  }

  getPlanillas(): Observable<PlanillaCobro[]> {
    return of(MOCK_PLANILLAS).pipe(delay(this.delay));
  }

  getPlanillasByCliente(clienteId: string): Observable<PlanillaCobro[]> {
    return of(MOCK_PLANILLAS.filter(p => p.clienteId === clienteId)).pipe(delay(this.delay));
  }

  getDeudasForwarders(): Observable<DeudaForwarder[]> {
    return of(MOCK_DEUDAS_FORWARDERS).pipe(delay(this.delay));
  }

  getTransacciones(): Observable<Transaccion[]> {
    return of(MOCK_TRANSACCIONES).pipe(delay(this.delay));
  }

  getTransaccionesRecientes(limit: number = 5): Observable<Transaccion[]> {
    const sorted = [...MOCK_TRANSACCIONES].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    return of(sorted.slice(0, limit)).pipe(delay(this.delay));
  }

  getUsuarios(): Observable<Usuario[]> {
    return of(MOCK_USUARIOS).pipe(delay(this.delay));
  }

  getReportesSemanales(): Observable<any[]> {
    return of(MOCK_REPORTES_SEMANALES).pipe(delay(this.delay));
  }

  getReportesMensuales(): Observable<any[]> {
    return of(MOCK_REPORTES_MENSUALES).pipe(delay(this.delay));
  }
}
