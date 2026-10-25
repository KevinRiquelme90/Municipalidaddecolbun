import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { type PermisoCirculacion } from '../models/permiso-circulacion';
import { PermisoCirculacionService } from '../services/permiso-circulacion.service';

@Component({
  selector: 'app-permiso-pago',
  imports: [RouterLink],
  templateUrl: './permiso-pago.html',
  styleUrl: '../css/permiso-flow.css',
})
export class PermisoPago implements OnInit {
  permiso?: PermisoCirculacion;
  errorFormulario = '';
  isSubmitting = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly permisoService: PermisoCirculacionService,
  ) {}

  ngOnInit(): void {
    const patente = this.route.snapshot.paramMap.get('patente') ?? '';
    try {
      const resultado = this.permisoService.buscarPermiso(patente);
      if (!resultado.permiso || resultado.status !== 'pendiente') {
        this.router.navigate(['/permiso-detalle', this.permisoService.normalizarPatente(patente)]);
        return;
      }

      this.permiso = resultado.permiso;
    } catch (error) {
      this.errorFormulario = error instanceof Error
        ? error.message
        : 'No fue posible cargar los datos del permiso.';
    }
  }

  confirmarPago(): void {
    if (!this.permiso) {
      return;
    }

    this.isSubmitting = true;
    try {
      const resultado = this.permisoService.confirmarPago(this.permiso.patente);
      if (!resultado.ok || !resultado.transaccion) {
        this.errorFormulario = resultado.mensaje;
        return;
      }

      this.router.navigate(['/permiso-comprobante', resultado.transaccion.id]);
    } catch (error) {
      this.errorFormulario = error instanceof Error
        ? error.message
        : 'No fue posible registrar el pago simulado.';
    } finally {
      this.isSubmitting = false;
    }
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
}
