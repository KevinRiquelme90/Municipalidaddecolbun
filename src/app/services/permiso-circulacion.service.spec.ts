// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PermisoCirculacionService } from './permiso-circulacion.service';

describe('PermisoCirculacionService', () => {
  const service = new PermisoCirculacionService();

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    service.resetearDatosDemo();
  });

  it('carga los escenarios base del flujo de permisos', () => {
    expect(service.getPermisos()).toHaveLength(4);
    expect(service.buscarPermiso('ABCD12').status).toBe('pendiente');
    expect(service.buscarPermiso('EFGH34').status).toBe('pagado');
    expect(service.buscarPermiso('MNOP78').status).toBe('incompleto');
    expect(service.buscarPermiso('ZZZZ99').status).toBe('not_found');
  });

  it('normaliza las patentes antes de buscarlas', () => {
    expect(service.buscarPermiso(' ab-cd12 ').status).toBe('pendiente');
  });

  it('confirma el pago, actualiza el permiso y persiste el comprobante', () => {
    const resultado = service.confirmarPago('ABCD12');

    expect(resultado.ok).toBe(true);
    expect(resultado.transaccion).toBeDefined();
    expect(service.buscarPermiso('ABCD12').status).toBe('pagado');
    expect(service.getHistorialPagos()).toHaveLength(1);
    const transaccion = resultado.transaccion;
    if (!transaccion) {
      throw new Error('El pago confirmado debe incluir una transacción.');
    }
    expect(service.getHistorialPagos()[0].id).toContain('PC-');
    expect(new PermisoCirculacionService().getTransaccionPorId(transaccion.id)).toEqual(transaccion);
  });

  it('evita pagar patentes inexistentes, incompletas o ya pagadas', () => {
    expect(service.confirmarPago('ZZZZ99').ok).toBe(false);
    expect(service.confirmarPago('MNOP78').ok).toBe(false);
    expect(service.confirmarPago('EFGH34').ok).toBe(false);
    expect(service.getHistorialPagos()).toHaveLength(0);
  });

  it('evita duplicar un pago ya registrado', () => {
    service.confirmarPago('ABCD12');
    const segundoPago = service.confirmarPago('ABCD12');

    expect(segundoPago.ok).toBe(false);
    expect(service.getHistorialPagos()).toHaveLength(1);
  });

  it('conserva el estado anterior si falla la escritura completa del pago', () => {
    const estadoAnterior = localStorage.getItem('municipalidad-colbun-permisos-state-demo');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });

    expect(() => service.confirmarPago('ABCD12')).toThrow(/No fue posible guardar/);
    expect(localStorage.getItem('municipalidad-colbun-permisos-state-demo')).toBe(estadoAnterior);
    expect(service.buscarPermiso('ABCD12').status).toBe('pendiente');
    expect(service.getHistorialPagos()).toHaveLength(0);
  });

  it('no sobrescribe JSON dañado de forma silenciosa', () => {
    localStorage.setItem('municipalidad-colbun-permisos-state-demo', '{invalid');

    expect(() => service.getPermisos()).toThrow(/está dañado/);
    expect(localStorage.getItem('municipalidad-colbun-permisos-state-demo')).toBe('{invalid');
  });

  it('rechaza y conserva transacciones que no coinciden con un permiso pagado', () => {
    const raw = localStorage.getItem('municipalidad-colbun-permisos-state-demo');
    if (!raw) {
      throw new Error('Se esperaban datos de prueba inicializados.');
    }

    const state = JSON.parse(raw) as {
      permisos: unknown[];
      historial: unknown[];
      secuencia: number;
    };
    state.historial.push({
      id: 'PC-2026-9999',
      patente: 'ZZZZ99',
      municipio: 'Colbún',
      monto: 42000,
      fecha: new Date().toISOString(),
      estado: 'pagado',
      periodo: '2026-10',
      tipoPermiso: 'Permiso de Circulación',
    });
    const inconsistentRaw = JSON.stringify(state);
    localStorage.setItem('municipalidad-colbun-permisos-state-demo', inconsistentRaw);

    expect(() => service.getPermisos()).toThrow(/formato válido/);
    expect(localStorage.getItem('municipalidad-colbun-permisos-state-demo')).toBe(inconsistentRaw);
  });

  it('migra los datos existentes de las claves anteriores', () => {
    const permisos = service.getPermisos();
    localStorage.removeItem('municipalidad-colbun-permisos-state-demo');
    localStorage.setItem('municipalidad-colbun-permisos-demo', JSON.stringify(permisos));
    localStorage.setItem('municipalidad-colbun-pagos-demo', JSON.stringify([]));
    localStorage.setItem('municipalidad-colbun-sequence-demo', '7');

    expect(service.buscarPermiso('ABCD12').status).toBe('pendiente');
    const migrado = JSON.parse(
      localStorage.getItem('municipalidad-colbun-permisos-state-demo') ?? '{}',
    ) as { secuencia?: number };
    expect(migrado.secuencia).toBe(7);
  });

  it('restablece permisos e historial a los datos demo', () => {
    service.confirmarPago('ABCD12');
    service.resetearDatosDemo();

    expect(service.buscarPermiso('ABCD12').status).toBe('pendiente');
    expect(service.getHistorialPagos()).toHaveLength(0);
  });
});
