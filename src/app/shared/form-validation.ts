import { NgForm } from '@angular/forms';

export interface ErrorFormulario {
  nombre: string;
  correo: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const chileanPhonePattern = /^9\d{8}$/;

export function crearErroresFormulario(): ErrorFormulario {
  return {
    nombre: '',
    correo: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  };
}

export function validarFormulario(formulario: NgForm): {
  errores: ErrorFormulario;
  valido: boolean;
} {
  const errores = crearErroresFormulario();
  const valores = formulario.value;

  const nombre = String(valores.nombre ?? '').trim();
  const correo = String(valores.correo ?? '').trim();
  const telefono = String(valores.telefono ?? '').trim();
  const asunto = String(valores.asunto ?? '').trim();
  const mensaje = String(valores.mensaje ?? '').trim();

  if (!nombre) errores.nombre = 'El nombre completo es obligatorio.';
  else if (nombre.length < 2) errores.nombre = 'El nombre debe tener al menos 2 caracteres.';

  if (!correo) errores.correo = 'El correo electrónico es obligatorio.';
  else if (!emailPattern.test(correo)) errores.correo = 'Ingresa un correo electrónico válido.';

  if (telefono && !chileanPhonePattern.test(telefono)) {
    errores.telefono = 'El teléfono debe tener 9 dígitos y comenzar con 9. Ejemplo: 912345678.';
  }

  if (!asunto) errores.asunto = 'El asunto es obligatorio.';
  else if (asunto.length < 5) errores.asunto = 'El asunto debe tener al menos 5 caracteres.';

  if (!mensaje) errores.mensaje = 'El mensaje es obligatorio.';
  else if (mensaje.length < 20) errores.mensaje = 'El mensaje debe tener al menos 20 caracteres.';

  return {
    errores,
    valido: Object.values(errores).every((error) => !error),
  };
}
