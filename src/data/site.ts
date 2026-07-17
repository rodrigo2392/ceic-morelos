/**
 * Datos centrales del sitio CEIC (constantes reales, no diseño).
 * Se usarán al migrar las secciones para no repetir strings.
 */
export const site = {
  name: 'Centro de Estudios e Investigación Cinematográfica',
  shortName: 'CEIC',
  city: 'Cuernavaca, Morelos, México',
  address: 'Cuauhtemotzín #25, Cuernavaca Centro, C.P. 62000, Morelos, México',
  whatsapp: {
    display: '+52 777 631 0187',
    link: 'https://wa.me/5217776310187',
  },
  instagram: {
    handle: '@ceic_morelos',
    link: 'https://www.instagram.com/ceic_morelos/',
  },
  facebook: {
    label: 'CEIC Morelos',
    link: 'https://www.facebook.com/profile.php?id=100089750092661',
  },
  colors: {
    ink: '#0d0c0b',
    cream: '#f4efe6',
    accent: '#d8a24a',
    accentDark: '#b07d2a',
  },
} as const;

export type Site = typeof site;
