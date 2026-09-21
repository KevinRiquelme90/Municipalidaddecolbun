import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tramites',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './pages/tramites.html',
  styleUrl: './css/contact.css',
})
export class Tramites {
  menuAbierto = false;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}
