import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink],
  templateUrl: './pages/contact.html',
  styleUrl: './css/contact.css',
})
export class Contact {
  menuAbierto = false;
  mensajeEnviado = false;
  errorFormulario = '';

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  enviarFormulario(formulario: NgForm): void {
    this.errorFormulario = '';
    this.mensajeEnviado = false;

    const telefono = String(formulario.value.telefono ?? '').trim();
    const telefonoValido = /^9[0-9]{8}$/.test(telefono);

    if (telefono && !telefonoValido) {
      this.errorFormulario = 'El teléfono debe tener 9 dígitos y comenzar con 9. Ejemplo: 912345678.';
      return;
    }

    if (formulario.invalid) {
      this.errorFormulario = 'Completa correctamente los campos obligatorios.';
      return;
    }

    const datosFormulario = {
      nombre: formulario.value.nombre,
      correo: formulario.value.correo,
      telefono: formulario.value.telefono,
      asunto: formulario.value.asunto,
      mensaje: formulario.value.mensaje,
    };

    console.log('Datos del formulario de contacto:', datosFormulario);
    this.mensajeEnviado = true;
    formulario.resetForm();
  }
}
