export interface Servicio {
  code: string;
  titulo: string;
  desc: string;
  img: string;
  alt: string;
}

/**
 * Servicios de la casa productora.
 *
 * Imágenes: son las del sitio original de CEIC, recortadas para quitarles el
 * degradado dorado con el título incrustado (ahora el título va con nuestra
 * tipografía) y optimizadas a WebP.
 *
 * Textos: reescritos a partir de los originales del sitio, que eran de una
 * sola línea. Se mantiene el mismo alcance de cada servicio, sin inventar
 * capacidades nuevas.
 */
export const servicios: Servicio[] = [
  {
    code: 'S—01',
    titulo: 'Guion',
    desc: 'Guiamos tus ideas hasta convertirlas en un guion sólido y filmable. Trabajamos estructura, personajes y voz para que la historia se sostenga en la página antes de llegar al set.',
    img: '/img/servicios/guion.webp',
    alt: 'Guion cinematográfico sobre un escritorio',
  },
  {
    code: 'S—02',
    titulo: 'Producción',
    desc: 'Preparamos el rodaje de principio a fin: scouting de locaciones, permisos y toda la documentación que el proyecto necesita. Llegas a filmar con el camino despejado.',
    img: '/img/servicios/produccion.webp',
    alt: 'Set de rodaje con cámara y equipo de producción',
  },
  {
    code: 'S—03',
    titulo: 'Realización',
    desc: 'Ponemos equipo humano y técnico profesional a disposición de tu proyecto para llevarlo al set: dirección, cámara, luz y sonido rodando con estándar cinematográfico.',
    img: '/img/servicios/realizacion.webp',
    alt: 'Rodaje con cámara en trípode e iluminación de set',
  },
  {
    code: 'S—04',
    titulo: 'Post-producción',
    desc: 'Editamos, montamos y damos el acabado final a tu material. Te entregamos la película terminada y lista para proyectarse.',
    img: '/img/servicios/post-produccion.webp',
    alt: 'Sala de edición y post-producción',
  },
  {
    code: 'S—05',
    titulo: 'Distribución',
    desc: 'Trabajamos la exposición de tu material para que la película encuentre pantalla y público: estrategia de festivales, muestras y acompañamiento de estreno.',
    img: '/img/servicios/distribucion.webp',
    alt: 'Pared de carteles de cine',
  },
];
