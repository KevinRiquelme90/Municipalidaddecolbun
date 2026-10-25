import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { type PagoTransaccion } from '../models/permiso-circulacion';
import { PermisoCirculacionService } from '../services/permiso-circulacion.service';

@Component({
  selector: 'app-permiso-comprobante',
  imports: [RouterLink],
  templateUrl: './permiso-comprobante.html',
  styleUrl: '../css/permiso-flow.css',
})
export class PermisoComprobante implements OnInit {
  transaccion?: PagoTransaccion;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly permisoService: PermisoCirculacionService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    try {
      this.transaccion = this.permisoService.getTransaccionPorId(id);

      if (!this.transaccion) {
        this.error = 'No existe un comprobante asociado a esta operación.';
      }
    } catch (error) {
      this.error = error instanceof Error
        ? error.message
        : 'No fue posible consultar el comprobante guardado.';
    }
  }

  get fechaFormateada(): string {
    if (!this.transaccion) {
      return '';
    }

    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(this.transaccion.fecha));
  }

  get montoFormateado(): string {
    if (!this.transaccion) {
      return '$0';
    }

    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(this.transaccion.monto);
  }
}
