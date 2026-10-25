export type PermisoEstado = 'pendiente' | 'pagado' | 'vencido';
export type PermisoResultadoTipo = 'pendiente' | 'pagado' | 'incompleto' | 'not_found';

export interface PermisoCirculacion {
  patente: string;
  propietario: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoVehiculo: string;
  municipio: string;
  monto: number;
  estado: PermisoEstado;
  periodo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  datosCompletos: boolean;
  observaciones?: string;
}

export interface PermisoResultado {
  status: PermisoResultadoTipo;
  mensaje: string;
  permiso?: PermisoCirculacion;
}

export interface PagoTransaccion {
  id: string;
  patente: string;
  municipio: string;
  monto: number;
  fecha: string;
  estado: 'pagado';
  periodo: string;
  tipoPermiso: string;
}
