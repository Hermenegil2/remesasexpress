export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo: 'individual' | 'empresarial';
  fechaRegistro: Date;
  estado: 'activo' | 'inactivo' | 'suspendido';
  totalCargas: number;
  totalPagado: number;
  deudaPendiente: number;
  ultimaActividad: Date;
  notas?: string;
}

export interface Carga {
  id: string;
  clienteId: string;
  clienteNombre: string;
  descripcion: string;
  origen: string;
  destino: string;
  peso: number;
  costo: number;
  montoPagado: number;
  estado: 'recibido' | 'en_transito' | 'aduana' | 'en_entrega' | 'entregado' | 'retenido';
  estadoPago: 'pendiente' | 'parcial' | 'pagado';
  fechaRecepcion: Date;
  fechaLlegadaEstimada: Date;
  fechaEntrega?: Date;
  trackingNumber: string;
  observaciones?: string;
}

export interface PlanillaCobro {
  id: string;
  clienteId: string;
  clienteNombre: string;
  numeroFactura: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  montoTotal: number;
  montoPagado: number;
  estado: 'pagado' | 'pendiente' | 'vencido' | 'parcial';
  items: PlanillaItem[];
  notas?: string;
}

export interface PlanillaItem {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface DeudaForwarder {
  id: string;
  forwarderNombre: string;
  concepto: string;
  montoTotal: number;
  montoPagado: number;
  fechaEmision: Date;
  fechaVencimiento: Date;
  estado: 'pendiente' | 'pagado' | 'parcial' | 'vencido';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  notas?: string;
}

export interface Transaccion {
  id: string;
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  descripcion: string;
  monto: number;
  fecha: Date;
  clienteId?: string;
  clienteNombre?: string;
  metodo: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';
  referencia?: string;
}

export interface ReporteFinanciero {
  periodo: string;
  tipo: 'semanal' | 'mensual';
  ingresos: number;
  gastos: number;
  utilidad: number;
  transacciones: number;
  fechaInicio: Date;
  fechaFin: Date;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'operador' | 'contador' | 'supervisor';
  activo: boolean;
  ultimoAcceso?: Date;
}

export interface DashboardData {
  totalCobrado: number;
  totalPendiente: number;
  utilidadSemanal: number;
  utilidadMensual: number;
  cargasActivas: number;
  clientesActivos: number;
  ingresosHoy: number;
  gastosHoy: number;
  variacionSemanal: number;
  variacionMensual: number;
}
