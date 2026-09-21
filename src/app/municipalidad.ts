import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-municipalidad',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './pages/municipalidad.html',
  styleUrl: './css/contact.css',
})
export class Municipalidad {
  menuAbierto = false;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}
