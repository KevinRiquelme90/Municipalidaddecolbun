import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { type PagoTransaccion } from '../models/permiso-circulacion';
import { PermisoCirculacionService } from '../services/permiso-circulacion.service';

@Component({
  selector: 'app-permiso-historial',
  imports: [RouterLink, DatePipe],
  templateUrl: './permiso-historial.html',
  styleUrl: '../css/permiso-flow.css',
})
export class PermisoHistorial {
  historial: PagoTransaccion[] = [];
  error = '';

  constructor(private readonly permisoService: PermisoCirculacionService) {
    this.cargarHistorial();
  }

  reiniciarDatos(): void {
    const confirmar = window.confirm('¿Deseas borrar el historial y volver a los permisos de prueba iniciales?');
    if (!confirmar) {
      return;
    }

    try {
      this.permisoService.resetearDatosDemo();
      this.cargarHistorial();
    } catch (error) {
      this.error = error instanceof Error
        ? error.message
        : 'No fue posible restablecer los datos de prueba.';
    }
  }

  private cargarHistorial(): void {
    try {
      this.historial = this.permisoService.getHistorialPagos();
      this.error = '';
    } catch (error) {
      this.error = error instanceof Error
        ? error.message
        : 'No fue posible consultar el historial guardado.';
    }
  }

  get formatoMonto(): (monto: number) => string {
    return (monto: number) =>
      new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
      }).format(monto);
  }
}
