export interface Curso {
  code: string;
  /** Duración/modalidad. Opcional: se quitó (era placeholder). Si CEIC confirma
   *  datos reales, se llena aquí y vuelve a aparecer solo en la tarjeta. */
  meta?: string;
  titulo: string;
  desc: string;
}

/**
 * NOTA: los 4 cursos son CORRECTOS (confirmado por el cliente). Duración y
 * modalidad se quitaron (eran placeholder). Las descripciones son genéricas y
 * pueden refinarse con el temario real cuando lo dé CEIC. El badge "Datos por
 * confirmar" se quitó por decisión del cliente.
 */
export const cursos: Curso[] = [
  {
    code: 'C—01',
    titulo: 'Diplomado en Realización Cinematográfica',
    desc: 'Del desarrollo de idea al cortometraje terminado. Dirección, fotografía, sonido y edición.',
  },
  {
    code: 'C—02',
    titulo: 'Guion Cinematográfico',
    desc: 'Estructura, personaje y voz propia. Termina con un guion de cortometraje listo para rodar.',
  },
  {
    code: 'C—03',
    titulo: 'Dirección de Fotografía',
    desc: 'Luz, lente y composición. Del guion técnico al lookbook, con práctica en set real.',
  },
  {
    code: 'C—04',
    titulo: 'Producción y Casa Productora',
    desc: 'Presupuesto, plan de rodaje y distribución. Cómo llevar un proyecto de la idea al estreno.',
  },
];

/** Opciones del selector "Curso de interés" del formulario. */
export const cursosOpciones: string[] = [
  'Realización Cinematográfica',
  'Guion Cinematográfico',
  'Dirección de Fotografía',
  'Producción y Casa Productora',
  'Aún no lo sé',
];
