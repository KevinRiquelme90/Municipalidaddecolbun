import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  crearErroresFormulario,
  validarFormulario,
  type ErrorFormulario,
} from './shared/form-validation';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './pages/contact.html',
  styleUrl: './css/contact.css',
})
export class Contact {
  menuAbierto = false;
  mensajeEnviado = false;
  errorFormulario = '';
  isSubmitting = false;
  fieldErrors: ErrorFormulario = crearErroresFormulario();

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  private limpiarErroresCampos(): void {
    this.fieldErrors = crearErroresFormulario();
  }

  enviarFormulario(formulario: NgForm): void {
    this.errorFormulario = '';
    this.mensajeEnviado = false;
    this.isSubmitting = true;

    const resultado = validarFormulario(formulario);
    this.fieldErrors = resultado.errores;
    const formularioValido = resultado.valido;
    this.errorFormulario = formularioValido ? '' : 'Completa correctamente los campos obligatorios.';

    if (!formularioValido) {
      this.isSubmitting = false;
      return;
    }

    const datosFormulario = {
      nombre: String(formulario.value.nombre ?? '').trim(),
      correo: String(formulario.value.correo ?? '').trim(),
      telefono: String(formulario.value.telefono ?? '').trim(),
      asunto: String(formulario.value.asunto ?? '').trim(),
      mensaje: String(formulario.value.mensaje ?? '').trim(),
    };

    console.log('Datos del formulario de contacto:', datosFormulario);
    this.mensajeEnviado = true;
    this.isSubmitting = false;
    formulario.resetForm();
    this.limpiarErroresCampos();
  }
}
