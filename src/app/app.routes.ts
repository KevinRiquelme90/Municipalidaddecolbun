import { Routes } from '@angular/router';

import { Contact } from './contact';
import { Home } from './home';
import { Municipalidad } from './municipalidad';
import { Noticias } from './noticias';
import { PermisoCirculacionBuscar } from './pages/permiso-circulacion-buscar';
import { PermisoComprobante } from './pages/permiso-comprobante';
import { PermisoDetalle } from './pages/permiso-detalle';
import { PermisoHistorial } from './pages/permiso-historial';
import { PermisoPago } from './pages/permiso-pago';
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
  { path: 'permiso-circulacion', component: PermisoCirculacionBuscar },
  { path: 'permiso-detalle/:patente', component: PermisoDetalle },
  { path: 'permiso-pago/:patente', component: PermisoPago },
  { path: 'permiso-comprobante/:id', component: PermisoComprobante },
  { path: 'permiso-historial', component: PermisoHistorial },
  { path: '**', redirectTo: '' },
];
