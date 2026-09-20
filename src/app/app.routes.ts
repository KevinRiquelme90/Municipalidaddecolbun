import { Routes } from '@angular/router';
import { Contact } from './contact';
import { Home } from './home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'contacto', component: Contact },
  { path: '**', redirectTo: '' },
];
