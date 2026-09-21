import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ErrorFormularioContacto {
  nombre: string;
  correo: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

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
  fieldErrors: ErrorFormularioContacto = {
    nombre: '',
    correo: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  };

  readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  readonly chileanPhonePattern = /^9\d{8}$/;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  private limpiarErroresCampos(): void {
    this.fieldErrors = {
      nombre: '',
      correo: '',
      telefono: '',
      asunto: '',
      mensaje: '',
    };
  }

  private validarCampo(formulario: NgForm, nombreCampo: keyof ErrorFormularioContacto): string {
    const valor = String(formulario.value[nombreCampo] ?? '').trim();

    switch (nombreCampo) {
      case 'nombre':
        if (!valor) return 'El nombre completo es obligatorio.';
        if (valor.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        return '';
      case 'correo':
        if (!valor) return 'El correo electrónico es obligatorio.';
        if (!this.emailPattern.test(valor)) return 'Ingresa un correo electrónico válido.';
        return '';
      case 'telefono':
        if (!valor) return '';
        if (!this.chileanPhonePattern.test(valor)) {
          return 'El teléfono debe tener 9 dígitos y comenzar con 9. Ejemplo: 912345678.';
        }
        return '';
      case 'asunto':
        if (!valor) return 'El asunto es obligatorio.';
        if (valor.length < 5) return 'El asunto debe tener al menos 5 caracteres.';
        return '';
      case 'mensaje':
        if (!valor) return 'El mensaje es obligatorio.';
        if (valor.length < 20) return 'El mensaje debe tener al menos 20 caracteres.';
        return '';
      default:
        return '';
    }
  }

  private validarFormulario(formulario: NgForm): boolean {
    this.limpiarErroresCampos();

    const campos: (keyof ErrorFormularioContacto)[] = ['nombre', 'correo', 'telefono', 'asunto', 'mensaje'];
    let formularioValido = true;

    campos.forEach((campo) => {
      const error = this.validarCampo(formulario, campo);
      this.fieldErrors[campo] = error;
      if (error) {
        formularioValido = false;
      }
    });

    this.errorFormulario = formularioValido ? '' : 'Completa correctamente los campos obligatorios.';
    return formularioValido;
  }

  enviarFormulario(formulario: NgForm): void {
    this.errorFormulario = '';
    this.mensajeEnviado = false;
    this.isSubmitting = true;

    const formularioValido = this.validarFormulario(formulario);

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
