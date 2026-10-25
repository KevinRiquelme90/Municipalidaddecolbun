import { Injectable } from '@angular/core';

import {
  type PagoTransaccion,
  type PermisoCirculacion,
  type PermisoResultado,
} from '../models/permiso-circulacion';

interface EstadoPersistido {
  permisos: PermisoCirculacion[];
  historial: PagoTransaccion[];
  secuencia: number;
}

@Injectable({ providedIn: 'root' })
export class PermisoCirculacionService {
  private readonly STORAGE_KEY = 'municipalidad-colbun-permisos-state-demo';
  private readonly LEGACY_PERMISOS_KEY = 'municipalidad-colbun-permisos-demo';
  private readonly LEGACY_HISTORIAL_KEY = 'municipalidad-colbun-pagos-demo';
  private readonly LEGACY_SEQUENCE_KEY = 'municipalidad-colbun-sequence-demo';

  private readonly permisosDemo: PermisoCirculacion[] = [
    {
      patente: 'ABCD12',
      propietario: 'María Elena Ruiz',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2021,
      tipoVehiculo: 'Sedan',
      municipio: 'Colbún',
      monto: 42000,
      estado: 'pendiente',
      periodo: '2026-10',
      fechaEmision: '2026-10-01',
      fechaVencimiento: '2026-10-31',
      datosCompletos: true,
      observaciones: 'Permiso vigente para circulación anual en comuna de Colbún.',
    },
    {
      patente: 'EFGH34',
      propietario: 'Javier Soto',
      marca: 'Hyundai',
      modelo: 'Accent',
      anio: 2019,
      tipoVehiculo: 'Sedan',
      municipio: 'Colbún',
      monto: 42000,
      estado: 'pagado',
      periodo: '2026-04',
      fechaEmision: '2026-04-10',
      fechaVencimiento: '2027-04-09',
      datosCompletos: true,
      observaciones: 'Pago registrado y permiso habilitado para circulación.',
    },
    {
      patente: 'MNOP78',
      propietario: '',
      marca: 'Ford',
      modelo: 'Ranger',
      anio: 2022,
      tipoVehiculo: 'Pickup',
      municipio: 'Colbún',
      monto: 44000,
      estado: 'pendiente',
      periodo: '2026-11',
      fechaEmision: '2026-11-01',
      fechaVencimiento: '2026-11-30',
      datosCompletos: false,
      observaciones: 'Faltan datos básicos del titular para completar la revisión.',
    },
    {
      patente: 'QRST90',
      propietario: 'Camila Vega',
      marca: 'Kia',
      modelo: 'Sportage',
      anio: 2023,
      tipoVehiculo: 'SUV',
      municipio: 'Colbún',
      monto: 47000,
      estado: 'pendiente',
      periodo: '2026-12',
      fechaEmision: '2026-12-01',
      fechaVencimiento: '2026-12-31',
      datosCompletos: true,
      observaciones: 'Solicitado y pendiente de pago en la municipalidad de Colbún.',
    },
  ];

  public inicializarDatosDemo(): void {
    this.guardarEstado({
      permisos: this.clonarPermisos(this.permisosDemo),
      historial: [],
      secuencia: 0,
    });
  }

  public resetearDatosDemo(): void {
    this.inicializarDatosDemo();
  }

  public getPermisos(): PermisoCirculacion[] {
    return this.clonarPermisos(this.cargarEstado().permisos);
  }

  public getHistorialPagos(): PagoTransaccion[] {
    return this.cargarEstado().historial.map((transaccion) => ({ ...transaccion }));
  }

  public normalizarPatente(patente: string): string {
    return patente.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  }

  public buscarPermiso(patente: string): PermisoResultado {
    const licencia = this.normalizarPatente(patente);
    const permiso = this.cargarEstado().permisos.find((item) => item.patente === licencia);

    if (!permiso) {
      return {
        status: 'not_found',
        mensaje: 'La patente consultada no registra un permiso vigente en la municipalidad.',
      };
    }

    if (!permiso.datosCompletos) {
      return {
        status: 'incompleto',
        mensaje: 'El vehículo presenta información incompleta y requiere revisión documental antes de continuar.',
        permiso: { ...permiso },
      };
    }

    if (permiso.estado === 'pagado') {
      return {
        status: 'pagado',
        mensaje: 'El permiso ya fue pagado y se encuentra vigente.',
        permiso: { ...permiso },
      };
    }

    return {
      status: 'pendiente',
      mensaje: 'El permiso está pendiente de pago y puede gestionarse desde esta pantalla.',
      permiso: { ...permiso },
    };
  }

  public getTransaccionPorId(id: string): PagoTransaccion | undefined {
    const transaccion = this.cargarEstado().historial.find((item) => item.id === id);
    return transaccion ? { ...transaccion } : undefined;
  }

  public getUltimaTransaccionPorPatente(patente: string): PagoTransaccion | undefined {
    const normalizada = this.normalizarPatente(patente);
    const transaccion = this.cargarEstado().historial
      .filter((item) => item.patente === normalizada)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];

    return transaccion ? { ...transaccion } : undefined;
  }

  public confirmarPago(patente: string): {
    ok: boolean;
    mensaje: string;
    transaccion?: PagoTransaccion;
  } {
    const estado = this.cargarEstado();
    const patenteNormalizada = this.normalizarPatente(patente);
    const indice = estado.permisos.findIndex((item) => item.patente === patenteNormalizada);
    const permiso = estado.permisos[indice];

    if (!permiso) {
      return {
        ok: false,
        mensaje: 'No es posible confirmar un pago para una patente inexistente.',
      };
    }

    if (!permiso.datosCompletos) {
      return {
        ok: false,
        mensaje: 'No se puede pagar un permiso con información incompleta.',
      };
    }

    if (permiso.estado === 'pagado') {
      return {
        ok: false,
        mensaje: 'Este permiso ya fue pagado previamente y no puede duplicarse.',
      };
    }

    const fecha = new Date().toISOString();
    const secuencia = estado.secuencia + 1;
    const year = new Date().getFullYear();
    const transaccion: PagoTransaccion = {
      id: `PC-${year}-${String(secuencia).padStart(4, '0')}`,
      patente: permiso.patente,
      municipio: permiso.municipio,
      monto: permiso.monto,
      fecha,
      estado: 'pagado',
      periodo: permiso.periodo,
      tipoPermiso: 'Permiso de Circulación',
    };

    const nuevoEstado: EstadoPersistido = {
      permisos: estado.permisos.map((item, itemIndice) =>
        itemIndice === indice
          ? {
              ...item,
              estado: 'pagado',
              fechaEmision: fecha.slice(0, 10),
              observaciones: 'Pago registrado y comprobante emitido correctamente.',
            }
          : item,
      ),
      historial: [transaccion, ...estado.historial],
      secuencia,
    };

    this.guardarEstado(nuevoEstado);

    return {
      ok: true,
      mensaje: 'Pago realizado con éxito. El comprobante ha sido emitido.',
      transaccion,
    };
  }

  private cargarEstado(): EstadoPersistido {
    const raw = this.leerStorage(this.STORAGE_KEY);

    if (raw !== null) {
      const parsed: unknown = this.parsearJson(raw, 'estado de permisos');
      if (!this.esEstadoPersistido(parsed)) {
        throw new Error('Los datos guardados del permiso no tienen un formato válido. No se modificaron.');
      }

      return parsed;
    }

    const estadoMigrado = this.cargarEstadoAnterior();
    this.guardarEstado(estadoMigrado);
    return estadoMigrado;
  }

  private cargarEstadoAnterior(): EstadoPersistido {
    const permisosRaw = this.leerStorage(this.LEGACY_PERMISOS_KEY);
    const historialRaw = this.leerStorage(this.LEGACY_HISTORIAL_KEY);
    const secuenciaRaw = this.leerStorage(this.LEGACY_SEQUENCE_KEY);
    const permisos = permisosRaw === null
      ? this.clonarPermisos(this.permisosDemo)
      : this.parsearJson(permisosRaw, 'permisos anteriores');
    const historial = historialRaw === null
      ? []
      : this.parsearJson(historialRaw, 'historial anterior');
    const secuencia = secuenciaRaw === null ? 0 : Number(secuenciaRaw);
    const estado: unknown = { permisos, historial, secuencia };

    if (!this.esEstadoPersistido(estado)) {
      throw new Error('Los datos anteriores del permiso no tienen un formato válido. No se modificaron.');
    }

    return estado;
  }

  private guardarEstado(estado: EstadoPersistido): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(estado));
    } catch (error) {
      throw new Error(
        `No fue posible guardar los datos del permiso en este navegador: ${this.mensajeError(error)}`,
      );
    }
  }

  private leerStorage(clave: string): string | null {
    try {
      return localStorage.getItem(clave);
    } catch (error) {
      throw new Error(
        `No fue posible leer los datos del permiso en este navegador: ${this.mensajeError(error)}`,
      );
    }
  }

  private parsearJson(raw: string, descripcion: string): unknown {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      throw new Error(`El ${descripcion} guardado está dañado. No se modificaron los datos.`);
    }
  }

  private esEstadoPersistido(valor: unknown): valor is EstadoPersistido {
    if (!valor || typeof valor !== 'object') {
      return false;
    }

    const estado = valor as Record<string, unknown>;
    if (!(
      Array.isArray(estado['permisos']) &&
      estado['permisos'].every((permiso) => this.esPermiso(permiso)) &&
      Array.isArray(estado['historial']) &&
      estado['historial'].every((transaccion) => this.esTransaccion(transaccion)) &&
      Number.isSafeInteger(estado['secuencia']) &&
      Number(estado['secuencia']) >= 0
    )) {
      return false;
    }

    const permisos = estado['permisos'] as PermisoCirculacion[];
    const historial = estado['historial'] as PagoTransaccion[];
    const patenteSet = new Set(permisos.map((permiso) => permiso.patente));
    const idSet = new Set(historial.map((transaccion) => transaccion.id));
    if (patenteSet.size !== permisos.length || idSet.size !== historial.length) {
      return false;
    }

    return historial.every((transaccion) => {
      const permiso = permisos.find((item) => item.patente === transaccion.patente);
      return (
        permiso?.estado === 'pagado' &&
        permiso.municipio === transaccion.municipio &&
        permiso.monto === transaccion.monto &&
        permiso.periodo === transaccion.periodo
      );
    });
  }

  private esPermiso(valor: unknown): valor is PermisoCirculacion {
    if (!valor || typeof valor !== 'object') {
      return false;
    }

    const permiso = valor as Record<string, unknown>;
    return (
      typeof permiso['patente'] === 'string' &&
      typeof permiso['propietario'] === 'string' &&
      typeof permiso['marca'] === 'string' &&
      typeof permiso['modelo'] === 'string' &&
      Number.isInteger(permiso['anio']) &&
      typeof permiso['tipoVehiculo'] === 'string' &&
      typeof permiso['municipio'] === 'string' &&
      typeof permiso['monto'] === 'number' &&
      Number.isFinite(permiso['monto']) &&
      permiso['monto'] > 0 &&
      ['pendiente', 'pagado', 'vencido'].includes(String(permiso['estado'])) &&
      typeof permiso['periodo'] === 'string' &&
      typeof permiso['fechaEmision'] === 'string' &&
      typeof permiso['fechaVencimiento'] === 'string' &&
      typeof permiso['datosCompletos'] === 'boolean'
    );
  }

  private esTransaccion(valor: unknown): valor is PagoTransaccion {
    if (!valor || typeof valor !== 'object') {
      return false;
    }

    const transaccion = valor as Record<string, unknown>;
    return (
      typeof transaccion['id'] === 'string' &&
      typeof transaccion['patente'] === 'string' &&
      typeof transaccion['municipio'] === 'string' &&
      typeof transaccion['monto'] === 'number' &&
      Number.isFinite(transaccion['monto']) &&
      transaccion['monto'] > 0 &&
      typeof transaccion['fecha'] === 'string' &&
      transaccion['estado'] === 'pagado' &&
      typeof transaccion['periodo'] === 'string' &&
      typeof transaccion['tipoPermiso'] === 'string'
    );
  }

  private clonarPermisos(permisos: PermisoCirculacion[]): PermisoCirculacion[] {
    return permisos.map((permiso) => ({ ...permiso }));
  }

  private mensajeError(error: unknown): string {
    return error instanceof Error ? error.message : 'error desconocido';
  }
}
