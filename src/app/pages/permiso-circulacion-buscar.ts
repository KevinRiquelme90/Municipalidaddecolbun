import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PermisoCirculacionService } from '../services/permiso-circulacion.service';

function validarFormatoPatente(control: AbstractControl): ValidationErrors | null {
  const valor = String(control.value ?? '');
  if (!valor.trim()) {
    return null;
  }

  if (!/^[A-Z0-9\s-]+$/i.test(valor)) {
    return { pattern: true };
  }

  const normalizada = valor.replace(/[^A-Z0-9]/gi, '');
  return normalizada.length >= 5 && normalizada.length <= 8 ? null : { pattern: true };
}

@Component({
  selector: 'app-permiso-circulacion-buscar',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './permiso-circulacion-buscar.html',
  styleUrl: '../css/permiso-flow.css',
})
export class PermisoCirculacionBuscar {
  readonly placasDemo = ['ABCD12', 'EFGH34', 'MNOP78', 'QRST90', 'ZZZZ99'];

  readonly form = new FormGroup({
    patente: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validarFormatoPatente],
    }),
  });

  errorBusqueda = '';
  tipoMensaje: 'error' | 'success' = 'error';
  isLoading = false;

  constructor(
    private readonly permisoService: PermisoCirculacionService,
    private readonly router: Router,
  ) {}

  buscar(): void {
    const patente = this.permisoService.normalizarPatente(this.form.value.patente ?? '');
    this.errorBusqueda = '';
    this.tipoMensaje = 'error';

    if (!this.form.valid || !patente) {
      this.form.markAllAsTouched();
      this.errorBusqueda = 'Ingresa una patente válida para consultar el permiso.';
      return;
    }

    this.isLoading = true;
    try {
      this.permisoService.buscarPermiso(patente);
      this.router.navigate(['/permiso-detalle', patente]);
    } catch (error) {
      this.errorBusqueda = error instanceof Error
        ? error.message
        : 'No fue posible consultar los datos guardados.';
    } finally {
      this.isLoading = false;
    }
  }

  cargarPatente(patente: string): void {
    this.form.controls.patente.setValue(patente);
    this.buscar();
  }

  reiniciarDatos(): void {
    const confirmar = window.confirm('¿Deseas restablecer los datos demo y borrar los pagos registrados?');
    if (!confirmar) {
      return;
    }

    try {
      this.permisoService.resetearDatosDemo();
      this.errorBusqueda = 'Los datos de prueba fueron restablecidos correctamente.';
      this.tipoMensaje = 'success';
      this.form.reset();
    } catch (error) {
      this.errorBusqueda = error instanceof Error
        ? error.message
        : 'No fue posible restablecer los datos de prueba.';
      this.tipoMensaje = 'error';
    }
  }
}
