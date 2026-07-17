const UPLOADS = '/img/maestros';

export interface Maestro {
  nombre: string;
  /** Rol según lo que declara el sitio real (no inventar cargos). */
  rol: string;
  categoria: string;
  img: string;
  /** Resumen visible en la tarjeta, reescrito a longitud uniforme (~200 car.)
   *  a partir de hechos reales; no verbatim. No inventar ni añadir premios/
   *  selecciones no confirmados (ver notas de datos verificados del CEIC). */
  lead: string;
  /** Resto de la biografía real, dentro de "Ver biografía completa". */
  resto: string[];
}

/**
 * Biografías de los 4 maestros del CEIC.
 * - `resto`: TEXTO REAL, verbatim de la página /maestros/ (solo saltos de párrafo).
 * - `lead`: resumen visible en la tarjeta, REESCRITO a longitud uniforme (~200 car.)
 *   a partir de esos hechos reales, para que las 4 tarjetas queden parejas.
 *   No se inventó nada ni se incluyeron premios/selecciones no confirmados.
 */
export const maestros: Maestro[] = [
  {
    nombre: 'Fernando Ganem',
    rol: 'Cineasta · Docente',
    categoria: '01 / DIRECCIÓN',
    img: `${UPLOADS}/WhatsApp-Image-2025-04-07-at-2.00.25-p.m.jpeg`,
    lead: 'Cineasta egresado de la Escuela Veracruzana de Cine, con posgrado en cine documental en la Escuela de Altos Estudios (Observatorio, Buenos Aires). Dirige y ejerce la docencia en el CEIC de Cuernavaca.',
    resto: [
      'Entre sus palmares destacan el premio «Marcel Sisniega» del festival mundial de cine extremo y su nominación a mejor largometraje en los festivales «Fidba» de Argentina y «Madriff» de España.',
      'Actualmente produce el más reciente filme del director Morelense Francesco Taboada; además dirige proyectos para diversas «Productoras Iberoamericanas»; asimismo es docente en la «Escuela libre de cine de Querétaro» y en el «Centro de Estudios e Investigación Cinematográfica» de Cuernavaca.',
      'Nota: Su trayectoria le valió ser jurado IMCINE.',
    ],
  },
  {
    nombre: 'Milton Guisa',
    rol: 'Subdirector · Docente',
    categoria: '02 / SUBDIRECCIÓN',
    img: `${UPLOADS}/IMG-20250327-WA0009.jpg`,
    lead: 'Cineasta morelense en dirección, guion y fotografía, con el Premio del Público del Festival José Rovirosa (UNAM). Egresado de Cinematografía y Producción Audiovisual, hoy subdirector y docente del CEIC.',
    resto: [
      'Su trabajo ha sido reconocido con el Premio del Público en el XXV Festival de Cine Documental José Rovirosa (UNAM) y el galardón a Mejor Cortometraje Internacional en el Festival de Cine El Cóndor Andino (2021). Además, fue beneficiario del Programa de Estímulo a la Creación y Desarrollo Artístico (PECDA) 2023.',
      'Sus producciones han participado en más de 50 festivales nacionales e internacionales en países como España, Perú, Argentina, Colombia y Brasil, obteniendo nominaciones en las categorías de Mejor Documental, Mejor Dirección y Mejor Guion.',
      'Actualmente, es Subdirector y docente en el Centro de Estudios e Investigación Cinematográfica (CEIC), institución en la que forma nuevas generaciones de cineastas. Asimismo, ha sido jurado en el Festival de Cine El Cóndor Andino 2022.',
      'Su trabajo continúa explorando nuevas formas narrativas y visuales, consolidándolo como una de las voces emergentes dentro del cine independiente en México.',
    ],
  },
  {
    nombre: 'Erick García',
    rol: 'Dirección y producción',
    categoria: '03 / REALIZACIÓN',
    img: `${UPLOADS}/Erick-Perfil-2019.png`,
    lead: 'Egresado de realización por el Centro de Capacitación Cinematográfica de México, con un máster en documental social por la Escola Superior de Cinema i Audiovisuals de Catalunya (ESCAC, de Barcelona).',
    resto: [
      'Se especializa en dirección y producción, sus trabajos han sido seleccionados en diversos festivales nacionales e internacionales como; Cannes, Toulouse, Plus Camerimage, Raindance, New York Independent, Festival de Cine de la Habana y Guanajuato International Film Festival.',
      'Ha sido beneficiario del IMCINE para el desarrollo y producción de los proyectos; “Inmune”, “La Isla Perdida” y “Hasta los Dientes”, que han participado en foros de desarrollo y coproducción como Sunny Side of the Docs, Foro de Coproducción FICG y Docu Lab, por mencionar algunos.',
      '“Hasta los Dientes” su más reciente producción, se estrenó la gira Ambulante 2018 y fue merecedora al premio «Camara Justicia» en Movie Thats Matters, posteriormente ganó una mención honorífica en el GIFF y el Ariel a mejor largometraje documental en 2019.',
      'Recientemente concluyó un documental en la comunidad de El Quemado, Gro en colaboración con la Comisión Ejecutiva de Atención a Víctimas (CEAV) y el proyecto transmedia “Reconstrucciones” para Ambulante A.C. Actualmente desarrolla un proyecto documental de prevención del delito y reinserción social en conjunto con Nosotrikas Tik Tank.',
    ],
  },
  {
    nombre: 'Huitzi Catalán',
    rol: 'Guion · Diseño de producción',
    categoria: '04 / GUION · ARTE',
    img: `${UPLOADS}/Huitzi-Catalan.jpg`,
    lead: 'Guionista y diseñador de producción. Estudió economía en la UNAM y el Diplomado en Creación Literaria de la SOGEM; ha sido jurado de poesía y cuento y coordina talleres de creación y cine para jóvenes.',
    resto: [
      'Ha sido jurado en concursos de poesía y cuento organizados por la UNAM y El Péndulo, y ha coordinado talleres de creación literaria. Escribe guion de cine y poesía.',
      'Además, hace Diseño de producción y Dirección de arte para cine y medios audiovisuales y multimedia; y coordina talleres de cine para jóvenes.',
      'Películas escritas por él y con su diseño de producción se han proyectado en festivales internacionales como Cannes, La Habana, Toronto, Madrid, Buenos Aires, entre otros.',
    ],
  },
];
