import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import municipalidadData from './data/municipalidad.json';

interface Noticia {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class App {
  menuAbierto = false;
  correo = '';
  errorCorreo = '';
  mensajeExito = '';
  readonly noticias: Noticia[] = municipalidadData.noticias;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  registrarCorreo(formulario: NgForm): void {
    this.errorCorreo = '';
    this.mensajeExito = '';

    if (!this.correo.trim()) {
      this.errorCorreo = 'El correo electrónico es obligatorio.';
      return;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
    if (!correoValido) {
      this.errorCorreo = 'Ingresa un correo electrónico válido.';
      return;
    }

    const datosFormulario = {
      correo: this.correo.trim(),
    };

    console.log('Datos del formulario:', datosFormulario);
    this.mensajeExito = '¡Gracias! Tu correo fue registrado correctamente.';
    formulario.resetForm();
  }
}
