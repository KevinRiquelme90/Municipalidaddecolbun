import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  selector: 'app-home',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './pages/home.html',
  styleUrl: './css/home.css',
})
export class Home {
  menuAbierto = false;
  correo = '';
  errorCorreo = '';
  mensajeExito = '';
  isSubmittingCorreo = false;
  readonly noticias: Noticia[] = municipalidadData.noticias;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }

  private validarCorreo(correo: string): string {
    const correoLimpio = correo.trim();

    if (!correoLimpio) {
      return 'El correo electrónico es obligatorio.';
    }

    if (correoLimpio.length < 5) {
      return 'El correo electrónico es demasiado corto.';
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio);
    if (!correoValido) {
      return 'Ingresa un correo electrónico válido.';
    }

    return '';
  }

  registrarCorreo(formulario: NgForm): void {
    this.errorCorreo = '';
    this.mensajeExito = '';
    this.isSubmittingCorreo = true;

    const error = this.validarCorreo(this.correo);
    if (error) {
      this.errorCorreo = error;
      this.isSubmittingCorreo = false;
      return;
    }

    const datosFormulario = { correo: this.correo.trim() };
    console.log('Datos del formulario:', datosFormulario);
    this.mensajeExito = '¡Gracias! Tu correo fue registrado correctamente.';
    this.isSubmittingCorreo = false;
    formulario.resetForm();
    this.correo = '';
  }
}
