import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  type PagoTransaccion,
  type PermisoCirculacion,
  type PermisoResultadoTipo,
} from '../models/permiso-circulacion';
import { PermisoCirculacionService } from '../services/permiso-circulacion.service';

@Component({
  selector: 'app-permiso-detalle',
  imports: [RouterLink],
  templateUrl: './permiso-detalle.html',
  styleUrl: '../css/permiso-flow.css',
})
export class PermisoDetalle implements OnInit {
  patente = '';
  status: PermisoResultadoTipo = 'not_found';
  mensaje = '';
  error = '';
  permiso?: PermisoCirculacion;
  ultimaTransaccion?: PagoTransaccion;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly permisoService: PermisoCirculacionService,
  ) {}

  ngOnInit(): void {
    const patenteParam = this.route.snapshot.paramMap.get('patente');
    this.patente = patenteParam ? this.permisoService.normalizarPatente(patenteParam) : '';
    this.cargarPermiso();
  }

  private cargarPermiso(): void {
    if (!this.patente) {
      this.status = 'not_found';
      this.mensaje = 'No se ha indicado una patente válida.';
      return;
    }

    try {
      const resultado = this.permisoService.buscarPermiso(this.patente);
      this.status = resultado.status;
      this.mensaje = resultado.mensaje;
      this.permiso = resultado.permiso;

      if (this.permiso) {
        this.ultimaTransaccion = this.permisoService.getUltimaTransaccionPorPatente(this.permiso.patente);
      }
    } catch (error) {
      this.error = error instanceof Error
        ? error.message
        : 'No fue posible consultar los datos guardados.';
    }
  }

  get statusClass(): string {
    return `status-${this.status}`;
  }

  get montoFormato(): string {
    if (!this.permiso) {
      return '$0';
    }

    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(this.permiso.monto);
  }

  iniciarPago(): void {
    if (!this.permiso) {
      return;
    }

    this.router.navigate(['/permiso-pago', this.permiso.patente]);
  }
}
