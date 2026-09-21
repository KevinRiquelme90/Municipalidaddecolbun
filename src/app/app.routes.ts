import { Routes } from '@angular/router';
import { Contact } from './contact';
import { Home } from './home';
import { Municipalidad } from './municipalidad';
import { Noticias } from './noticias';
import { Tramites } from './tramites';
import { Turismo } from './turismo';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'municipalidad', component: Municipalidad },
  { path: 'tramites', component: Tramites },
  { path: 'servicios', redirectTo: 'tramites', pathMatch: 'full' },
  { path: 'noticias', component: Noticias },
  { path: 'turismo', component: Turismo },
  { path: 'contacto', component: Contact },
  { path: '**', redirectTo: '' },
];
