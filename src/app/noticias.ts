import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-noticias',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './pages/noticias.html',
  styleUrl: './css/contact.css',
})
export class Noticias {
  menuAbierto = false;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}
