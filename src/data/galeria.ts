const UPLOADS = '/img/set';

export interface Foto {
  src: string;
  alt: string;
  /** Columnas que ocupa en el mosaico (retícula de 6). */
  span: number;
  /** Filas que ocupa (2 para verticales, así no se recortan). */
  rowSpan?: number;
  /** Texto que se muestra en el lightbox. */
  caption?: string;
}

/**
 * "Vida en la escuela".
 * Las 6 fotos de /img/escuela/ vienen del Instagram de CEIC (@ceic_morelos),
 * descargadas y optimizadas a WebP; los captions salen del texto real de cada
 * publicación. Las 4 de UPLOADS son las que ya estaban en su sitio.
 *
 * El orden está pensado para que el mosaico embone sin huecos en la retícula
 * de 6 columnas (ver comentarios de fila).
 */
export const galeria: Foto[] = [
  // fila 1
  {
    src: '/img/escuela/clase-muestra-cine-morelos.webp',
    alt: 'Clase muestra del CEIC en el Cine Morelos',
    span: 4,
    caption: 'Clase muestra en el Cine Morelos',
  },
  {
    src: '/img/escuela/rodaje-no-salgas.webp',
    alt: 'Rodaje nocturno del cortometraje No salgas',
    span: 2,
    rowSpan: 2,
    caption: 'Rodaje de «No salgas»',
  },
  // fila 2
  { src: `${UPLOADS}/CEIC5-1024x576.jpg`, alt: 'Set del CEIC', span: 2, caption: 'En el set' },
  {
    src: '/img/escuela/hija-enferma-madre-medico.webp',
    alt: 'Rodaje del cortometraje Hija enferma, madre médico',
    span: 2,
    caption: 'Rodaje de «Hija enferma, madre médico»',
  },
  // fila 3
  {
    src: '/img/escuela/clase-reconocimiento-equipo.webp',
    alt: 'Alumnas en clase de reconocimiento de equipo',
    span: 2,
    rowSpan: 2,
    caption: 'Clase de reconocimiento de equipo',
  },
  {
    src: '/img/escuela/diplomado-sabatino-rodaje.webp',
    alt: 'Alumnos del Diplomado Sabatino en rodaje de exteriores',
    span: 4,
    caption: 'Rodaje del Diplomado Sabatino',
  },
  // fila 4
  { src: `${UPLOADS}/CEIC2-1024x576.jpg`, alt: 'Rodaje del CEIC', span: 2, caption: 'Rodaje' },
  { src: `${UPLOADS}/CEIC4-1024x576.jpg`, alt: 'Clase en el CEIC', span: 2, caption: 'En clase' },
  // fila 5
  {
    src: '/img/escuela/rodaje-ansiedad.webp',
    alt: 'Rodaje del cortometraje Ansiedad en Comedor 89',
    span: 3,
    caption: 'Rodaje de «Ansiedad»',
  },
  {
    src: `${UPLOADS}/CEIC9-1024x683.jpg`,
    alt: 'Comunidad del CEIC',
    span: 3,
    caption: 'Comunidad CEIC',
  },
];
