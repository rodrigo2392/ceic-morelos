const UPLOADS = '/img/portafolio';

export interface Pelicula {
  titulo: string;
  poster: string;
  /** Enlace al tráiler (YouTube/Vimeo). Pendiente de recibir de CEIC. */
  trailer?: string;
}

export const portafolio: Pelicula[] = [
  { titulo: 'Desayuno', poster: `${UPLOADS}/Desayuno-Poster-Oficial-683x1024.jpg` },
  { titulo: 'El Chinelo Mayor', poster: `${UPLOADS}/El-Chinelo-Mayor-Poster-768x1024.jpg` },
  { titulo: 'Inmarcesible', poster: `${UPLOADS}/inmarcesible-Poster-Oficial-683x1024.jpg` },
  { titulo: 'Las Escaleras', poster: `${UPLOADS}/Las-Escaleras-Poster-Oficial-683x1024.jpg` },
  { titulo: 'Marzo', poster: `${UPLOADS}/MARZO-POSTER-683x1024.jpg` },
  { titulo: 'El Prado', poster: `${UPLOADS}/Poster-El-Prado-665x1024.jpg` },
];
