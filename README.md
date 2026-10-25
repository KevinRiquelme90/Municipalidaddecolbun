# Municipalidad de Colbún — Permiso de Circulación

Aplicación Angular para consultar antecedentes de un permiso de circulación, simular el pago y revisar el comprobante y el historial de transacciones en la Municipalidad de Colbún.

## Objetivo

La aplicación conserva la identidad institucional de la municipalidad de Colbún y agrega un flujo funcional de trámites para:

- buscar una patente;
- consultar antecedentes del permiso;
- detectar casos de patente inexistente, datos incompletos y permisos ya pagados;
- generar un pago simulado;
- registrar la transacción en historial local;
- consultar comprobantes y reiniciar los datos de demostración.

## Tecnologías y versiones

- Angular: 21.2.22
- TypeScript: 5.9.3
- Node.js: 24.22.0
- npm: 11.19.1 (la propiedad `packageManager` declara npm 10.8.2)
- Bootstrap 5.3.8
- Bootstrap Icons 1.13.1

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- Git para clonar el repositorio

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm start
```

La aplicación queda disponible en el puerto 4200 por defecto de Angular.

## Compilación de producción

```bash
npm run build
```

## Estructura principal

```text
src/
  app/
    css/
      home.css
      permiso-flow.css
    data/
      municipalidad.json
    models/
      permiso-circulacion.ts
    pages/
      home.html
      permiso-circulacion-buscar.html
      permiso-detalle.html
      permiso-pago.html
      permiso-comprobante.html
      permiso-historial.html
    services/
      permiso-circulacion.service.ts
    app.routes.ts
    app.ts
    app.html
    home.ts
    contact.ts
    ...
  styles.css
```

## Páginas y rutas

- `/` — Inicio institucional de la Municipalidad de Colbún.
- `/municipalidad` — Información institucional.
- `/tramites` — Trámites y servicios municipales.
- `/noticias` — Agenda y noticias.
- `/turismo` — Turismo y cultura.
- `/contacto` — Formulario de contacto.
- `/permiso-circulacion` — Búsqueda de la patente.
- `/permiso-detalle/:patente` — Resultado del permiso y posibilidad de pago.
- `/permiso-pago/:patente` — Confirmación de pago simulado.
- `/permiso-comprobante/:id` — Comprobante visible con monto, patente, fecha y estado.
- `/permiso-historial` — Historial de pagos registrados.

## Servicio centralizado de localStorage

La lógica de persistencia está en `src/app/services/permiso-circulacion.service.ts`.

El servicio guarda el estado completo en una sola clave para que la actualización de un permiso y su transacción se persistan juntas:

- `municipalidad-colbun-permisos-state-demo`: permisos, historial de pagos y secuencia de comprobantes.

En la primera carga se migran las claves de demostración usadas por la versión anterior. La validación de JSON o de formato informa el error y conserva los datos dañados para revisión; no los reemplaza automáticamente. El uso de `localStorage` permite que la información persista al recargar la página sin backend real.

## Modelos de datos

Los tipos principales están en `src/app/models/permiso-circulacion.ts`:

- `PermisoCirculacion`: información del vehículo y del permiso.
- `PermisoResultado`: resultado de la búsqueda por patente.
- `PagoTransaccion`: estructura del comprobante de pago.

## Datos ficticios precargados

La base de prueba incluye cuatro escenarios:

- `ABCD12`: permiso pendiente de pago.
- `EFGH34`: permiso ya pagado.
- `MNOP78`: datos incompletos.
- `QRST90`: permiso pendiente adicional.
- `ZZZZ99`: patente inexistente.

Estos valores se cargan al primer acceso y pueden reiniciarse desde la interfaz.

## Flujo completo

1. Se ingresa la patente en la pantalla de consulta.
2. La aplicación normaliza la patente y busca el permiso en localStorage.
3. El sistema responde con uno de estos estados:
   - inexistente;
   - incompleto;
   - pagado;
   - pendiente.
4. Si el permiso está pendiente, se accede a una vista de confirmación.
5. El usuario revisa el resumen del permiso y confirma el pago simulado.
6. El servicio actualiza el estado del permiso y genera una transacción.
7. Se abre el comprobante con identificador, fecha, patente, municipalidad, monto y estado.
8. El historial guarda la operación para futuras consultas y recargas.

## Reinicio de datos

Desde la pantalla de consulta o historial existe la opción “Reiniciar datos demo”.

Esta acción:

- restablece los permisos iniciales;
- elimina transacciones generadas;
- vuelve los estados a sus valores de prueba original;
- permite repetir escenarios en un entorno limpio.

## Historial y comprobantes

- `/permiso-historial` lista todas las transacciones.
- `/permiso-comprobante/:id` muestra el comprobante asociado.
- El comprobante conserva un identificador estable, la fecha del pago y los datos del permiso.

## Pruebas disponibles

Se ejecutó la suite Angular/Vitest:

```bash
npm test -- --watch=false
```

La suite cubre escenarios de búsqueda, normalización de patente, pago, prevención de duplicados, persistencia, errores de escritura y reinicio.

También se validó la compilación de producción con:

```bash
npm run build
```

## Capturas de pantalla

Las capturas de la aplicación están en `docs/screenshots/`:

- `inicio.png`: página de inicio.
- `consulta-patente.png`: búsqueda de una patente.
- `detalle-pendiente.png`: permiso pendiente de pago.
- `pago-simulado.png`: resumen previo al pago simulado.
- `historial-vacio.png`: historial sin transacciones.
- `patente-inexistente.png`: patente sin permiso vigente.

## Limitaciones conocidas

- No se implementa backend ni pasarela bancaria real; el pago es simulado.
- No se incluye una captura del comprobante; el pago y el acceso al comprobante se validaron durante las pruebas del flujo.


