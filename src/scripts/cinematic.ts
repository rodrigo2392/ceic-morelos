/* ===========================================================================
   Runtime cinematográfico del sitio CEIC.
   Portado del componentDidMount de index.html (Claude Design) a funciones
   vanilla. Se ejecuta una sola vez tras cargar el DOM.
   =========================================================================== */

const ACCENT = '#d8a24a';

function el<T extends HTMLElement = HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

/* ---------- Lightbox (galería y pósters) ---------- */
interface LbItem {
  src: string;
  title: string;
}
let lbItems: LbItem[] = [];
let lbIndex = 0;

function lbRender() {
  const img = el<HTMLImageElement>('ceic-modalimg');
  const title = el('ceic-modaltitle');
  const count = el('ceic-lb-count');
  const prev = el('ceic-lb-prev');
  const next = el('ceic-lb-next');
  const it = lbItems[lbIndex];
  if (!it || !img) return;
  img.src = it.src;
  img.alt = it.title;
  if (title) title.textContent = it.title;
  const multi = lbItems.length > 1;
  if (count) count.textContent = multi ? `${lbIndex + 1} / ${lbItems.length}` : '';
  if (prev) prev.hidden = !multi;
  if (next) next.hidden = !multi;
}

function openLightbox(items: LbItem[], index: number) {
  const m = el('ceic-modal');
  if (!m || !items.length) return;
  lbItems = items;
  lbIndex = index;
  lbRender();
  m.classList.add('is-open');
  requestAnimationFrame(() => {
    m.style.opacity = '1';
  });
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const m = el('ceic-modal');
  if (!m || !m.classList.contains('is-open')) return;
  m.style.opacity = '0';
  document.body.style.overflow = '';
  setTimeout(() => m.classList.remove('is-open'), 400);
}

function lbStep(d: number) {
  if (lbItems.length < 2) return;
  lbIndex = (lbIndex + d + lbItems.length) % lbItems.length;
  lbRender();
}

let started = false;

export function initCinematic() {
  if (started) return;
  started = true;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Fallback de imágenes rotas (antes onError={{imgError}}) ---------- */
  document.querySelectorAll<HTMLElement>('[data-fallback]').forEach((fb) => {
    const img = fb.parentElement?.querySelector<HTMLImageElement>('img');
    if (!img) return;
    img.addEventListener('error', () => {
      img.style.display = 'none';
      fb.style.display = 'flex';
    });
  });

  /* ---------- Lightbox: controles, click en fondo y teclado ---------- */
  const modal = el('ceic-modal');
  if (modal) {
    // cerrar solo al hacer clic en el fondo (no sobre la imagen ni los controles)
    modal.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t === modal || t.classList.contains('ceic-lb-grain')) closeLightbox();
    });
    el('ceic-lb-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
    el('ceic-lb-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      lbStep(-1);
    });
    el('ceic-lb-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      lbStep(1);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (!modal || !modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'ArrowLeft') lbStep(-1);
  });

  /* ---------- Bloqueo de scroll (durante intro + video, hasta el reveal) ---------- */
  const preventScroll = (e: Event) => e.preventDefault();
  const blockedKeys = new Set([
    ' ',
    'Spacebar',
    'PageDown',
    'PageUp',
    'ArrowDown',
    'ArrowUp',
    'Home',
    'End',
  ]);
  const keyBlocker = (e: KeyboardEvent) => {
    if (blockedKeys.has(e.key)) e.preventDefault();
  };
  let scrollLocked = false;
  const lockScroll = () => {
    if (scrollLocked) return;
    scrollLocked = true;
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', keyBlocker);
  };
  const unlockScroll = () => {
    if (!scrollLocked) return;
    scrollLocked = false;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('keydown', keyBlocker);
  };

  /* ---------- Reveal del hero (texto + velo) ----------
     Ocurre cuando el video termina. NO toca el scroll: el bloqueo se libera
     al terminar el conteo 3-2-1, no aquí. */
  const veil = el('ceic-hero-veil');
  let heroShown = false;
  const revealHeroText = () => {
    if (heroShown) return;
    heroShown = true;
    if (veil) veil.style.opacity = '1';
    document.querySelectorAll<HTMLElement>('[data-hero]').forEach((n) => {
      n.style.opacity = '1';
      n.style.transform = 'none';
      n.style.filter = 'blur(0)';
    });
  };

  /* ---------- Video del hero ----------
     Se reproduce UNA sola vez (sin loop) y siempre muteado. El texto del hero
     aparece SOLO cuando el video termina. El sonido solo se activa con un clic
     explícito en el botón. */
  const vid = el<HTMLVideoElement>('ceic-herovideo');
  let videoStarted = false;
  const startVideo = () => {
    if (videoStarted) return;
    videoStarted = true;
    if (!vid) {
      revealHeroText();
      return;
    }
    const poster = vid.getAttribute('poster');
    let hasPlayed = false; // el video llegó a avanzar de verdad (currentTime subió)
    const fallback = () => {
      if (poster && vid.parentElement) {
        vid.parentElement.style.backgroundImage = `url("${poster}")`;
        vid.parentElement.style.backgroundSize = 'cover';
        vid.parentElement.style.backgroundPosition = 'center';
        vid.style.display = 'none';
      }
    };
    // Póster SOLO cuando el video de verdad no puede reproducirse. Si ya reprodujo
    // y luego se pausa (iOS), NO lo cambiamos por póster (ver el chequeo de abajo).
    const failReveal = () => {
      fallback();
      revealHeroText();
    };

    // iOS PAUSA un autoplay muteado por su cuenta (Modo Bajo Consumo, salir de
    // vista o un stall de decodificación). Marcamos si el video avanzó y, si se
    // pausa antes de terminar, reintentamos reproducir (best-effort) en vez de
    // tirarlo al póster. El presupuesto de reintentos se reinicia cuando el video
    // avanza, así un stall se recupera pero un bloqueo duro no hace churn infinito.
    let lastT = 0;
    let resumeTries = 0;
    vid.addEventListener('timeupdate', () => {
      if (vid.currentTime > 0.2) hasPlayed = true;
      if (vid.currentTime > lastT + 0.5) {
        lastT = vid.currentTime;
        resumeTries = 0;
      }
    });
    vid.addEventListener('pause', () => {
      if (vid.ended || resumeTries >= 3) return;
      resumeTries++;
      vid.play().catch(() => {});
    });

    // el texto aparece cuando el video termina
    vid.addEventListener(
      'ended',
      () => {
        vid.pause();
        revealHeroText();
      },
      { once: true }
    );
    // error real (ninguna fuente reproducible) → póster + revelar. Solo el 'error'
    // del <video>; NO el de cada <source> (en iOS el webm siempre falla y pasa al mp4).
    vid.addEventListener('error', failReveal, { once: true });

    // reproducir desde el inicio
    try {
      vid.currentTime = 0;
    } catch {
      /* noop */
    }
    const p = vid.play();
    // autoplay rechazado Y el video nunca reprodujo → póster + revelar
    if (p && p.catch)
      p.catch(() => {
        if (!hasPlayed) failReveal();
      });

    // A los ~3s: caemos al póster SOLO si el video NUNCA reprodujo (no decodificó
    // o el autoplay se bloqueó del todo). Si ya reprodujo y ahora está pausado
    // (iOS), NO lo cambiamos por póster: revelamos el texto para no bloquear el
    // scroll y dejamos el video (el reintento de 'pause' puede reanudarlo).
    setTimeout(() => {
      if (heroShown) return;
      const neverPlayed = !vid.videoWidth || !hasPlayed;
      if (neverPlayed) failReveal();
      else revealHeroText();
    }, 3000);

    // Red de seguridad ligada a la duración (por si 'ended' nunca llega).
    const scheduleSafety = () => {
      const dur = isFinite(vid.duration) && vid.duration > 0 ? Math.min(vid.duration, 40) : 12;
      setTimeout(revealHeroText, (dur + 3) * 1000);
    };
    if (isFinite(vid.duration) && vid.duration > 0) scheduleSafety();
    else vid.addEventListener('loadedmetadata', scheduleSafety, { once: true });
  };

  if (vid) {
    vid.muted = true;
    vid.setAttribute('muted', '');
    vid.loop = false; // sin loop: se reproduce una sola vez
    vid.playsInline = true;

    // Botón de sonido: SOLO un clic explícito activa/silencia el audio.
    const soundBtn = el('ceic-sound');
    const setMuted = (m: boolean) => {
      vid.muted = m;
      if (m) vid.setAttribute('muted', '');
      else vid.removeAttribute('muted');
      if (soundBtn) {
        soundBtn
          .querySelectorAll<HTMLElement>('[data-son-on]')
          .forEach((n) => (n.style.display = m ? 'none' : 'inline'));
        soundBtn
          .querySelectorAll<HTMLElement>('[data-son-off]')
          .forEach((n) => (n.style.display = m ? 'inline' : 'none'));
      }
    };
    if (soundBtn)
      soundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setMuted(!vid.muted);
        const p = vid.play();
        if (p && p.catch) p.catch(() => {});
      });

    // Autoactivar el audio en el PRIMER gesto del usuario (scroll o clic),
    // como en Claude Design. Solo actúa una vez que el video ya arrancó
    // (después del conteo). Salvaguarda: si el navegador no permite activar el
    // audio con ese gesto (p. ej. un scroll en Chrome no cuenta como
    // "activación de usuario"), el video sigue reproduciéndose EN MUDO en lugar
    // de pausarse/buguearse, y un gesto posterior (un clic) puede reintentarlo.
    let audioOn = false;
    let audioBusy = false;
    const audioGestures = ['pointerdown', 'click', 'keydown', 'touchstart', 'wheel', 'scroll'];
    const engageAudio = () => {
      if (audioOn || audioBusy || !videoStarted || !vid.muted) return;
      audioBusy = true;
      setMuted(false);
      Promise.resolve(vid.play())
        .then(() => {
          if (!vid.muted && !vid.paused) {
            audioOn = true;
            audioGestures.forEach((ev) => window.removeEventListener(ev, engageAudio));
          } else {
            setMuted(true);
            vid.play().catch(() => {});
          }
        })
        .catch(() => {
          setMuted(true);
          vid.play().catch(() => {});
        })
        .finally(() => {
          audioBusy = false;
        });
    };
    // iOS solo permite desmutear un autoplay con un TAP real; intentarlo en el
    // primer scroll/touch hace que iOS PAUSE el video, y luego el chequeo de
    // progreso lo manda al póster (bug: el video arranca y a ~1s cae al fallback).
    // En iOS el audio se activa SOLO con el botón de sonido (que sí es tap válido).
    const isIOS =
      /iP(hone|ad|od)/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isIOS) {
      audioGestures.forEach((ev) => window.addEventListener(ev, engageAudio, { passive: true }));
    }
  }

  /* ---------- Intro / film leader (con bloqueo de scroll) ---------- */
  const intro = el('ceic-intro');
  const lbTop = el('ceic-lbtop');
  const lbBot = el('ceic-lbbot');
  const runHero = () => {
    // el letterbox del hero se abre hasta EXACTAMENTE el alto de las barras de
    // la página, para que el encuadre sea continuo y no dé un brinco al salir
    if (lbTop) lbTop.style.height = 'var(--ceic-bar-h)';
    if (lbBot) lbBot.style.height = 'var(--ceic-bar-h)';
  };
  if (reduce) {
    // sin animación: mostrar todo de una y no bloquear scroll
    if (intro) intro.style.display = 'none';
    runHero();
    revealHeroText();
  } else {
    lockScroll(); // bloquear scroll durante el 3-2-1 y el video, hasta el reveal
    let n = 3;
    const num = el('ceic-leadernum');
    const tc = el('ceic-leadertc');
    const tick = () => {
      n--;
      if (n > 0) {
        if (num) num.textContent = String(n);
        if (tc) tc.textContent = '00:00:0' + n + ':00';
        setTimeout(tick, 800);
      } else {
        if (intro) {
          intro.style.transition = 'opacity .7s, transform .9s';
          intro.style.opacity = '0';
          intro.style.transform = 'scale(1.05)';
          setTimeout(() => {
            if (intro) intro.style.display = 'none';
          }, 700);
        }
        runHero();
        unlockScroll(); // el bloqueo dura SOLO el conteo 3-2-1
        // el video arranca aquí; el texto del hero saldrá cuando el video termine
        startVideo();
      }
    };
    setTimeout(tick, 800);
  }

  /* ---------- Encuadre letterbox: nav (arriba) + barra (abajo) ----------
     Ambas se solidifican al salir del hero. La de abajo además se funde con
     el footer al llegar al final del documento. */
  const bottomBar = el('ceic-bottombar');
  const onNavScroll = () => {
    const pastHero = window.scrollY > window.innerHeight * 0.75;
    // una sola clase gobierna ambas barras: así nunca se desincronizan
    document.documentElement.classList.toggle('ceic-scrolled', pastHero);
    if (bottomBar) {
      // sólida en cuanto hay contenido detrás (no espera al umbral del nav)
      bottomBar.classList.toggle('is-solid', window.scrollY > 10);
      // fundir con el footer cuando ya casi tocamos el final
      const restante =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      bottomBar.classList.toggle('is-merged', restante < 140);
    }
  };
  window.addEventListener('scroll', onNavScroll, { passive: true });
  window.addEventListener('resize', onNavScroll, { passive: true });
  onNavScroll();

  /* ---------- Títulos de sección: reveal con máscara (clip-path) ----------
     Usamos un listener de scroll y NO un IntersectionObserver: el h2 se
     auto-recorta a área cero con clip-path, que es justo el caso donde IO
     puede no disparar y dejaría el título invisible para siempre. */
  const titles = [...document.querySelectorAll<HTMLElement>('#ceic-root section h2')];
  // los sacamos del reveal genérico para que no se peleen los dos efectos
  titles.forEach((h) => h.removeAttribute('data-reveal'));
  if (!reduce && titles.length) {
    titles.forEach((h) => h.classList.add('ceic-mask'));
    let pending = titles.slice();
    const checkTitles = () => {
      const limit = window.innerHeight * 0.88;
      pending = pending.filter((h) => {
        if (h.getBoundingClientRect().top < limit) {
          h.classList.add('is-in');
          return false;
        }
        return true;
      });
      if (!pending.length) window.removeEventListener('scroll', checkTitles);
    };
    window.addEventListener('scroll', checkTitles, { passive: true });
    window.addEventListener('resize', checkTitles, { passive: true });
    // recalcular cuando terminen de cargar imágenes (cambian las posiciones)
    window.addEventListener('load', checkTitles, { once: true });
    checkTitles();
  }

  /* ---------- Modo blanco y negro ---------- */
  const bwBtn = el<HTMLButtonElement>('ceic-bw-toggle');
  if (bwBtn) {
    const label = bwBtn.querySelector('.ceic-bw-label');
    const paint = () => {
      const on = document.documentElement.classList.contains('ceic-bw');
      bwBtn.setAttribute('aria-pressed', String(on));
      // el botón anuncia a qué modo te lleva
      if (label) label.textContent = on ? 'Color' : 'B/N';
      bwBtn.title = on ? 'Volver a color' : 'Ver en blanco y negro';
    };
    bwBtn.addEventListener('click', () => {
      const on = document.documentElement.classList.toggle('ceic-bw');
      try {
        localStorage.setItem('ceic-bw', on ? '1' : '0');
      } catch {
        /* modo privado: no persistimos, pero el toggle sigue funcionando */
      }
      paint();
    });
    paint(); // refleja lo que ya aplicó el script anti-parpadeo del <head>
  }

  /* ---------- Barra de progreso tipo tira de película ---------- */
  const prog = document.createElement('div');
  prog.className = 'ceic-progress';
  prog.innerHTML = '<span></span>';
  document.body.appendChild(prog);
  const progBar = prog.firstElementChild as HTMLElement;
  const onProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progBar.style.transform = `scaleX(${p})`;
    prog.style.opacity = window.scrollY > window.innerHeight * 0.5 ? '1' : '0';
  };
  window.addEventListener('scroll', onProgress, { passive: true });
  onProgress();

  /* ---------- Claqueta viva: sección actual + timecode ----------
     La etiqueta de cada sección se deduce del propio DOM (el número grande y
     su kicker), así no hay que mantener una lista aparte. */
  const bbTag = el('ceic-bb-tag');
  const bbTc = el('ceic-bb-tc');
  const TAG_DEFAULT = 'CEIC · Cuernavaca, Morelos';
  if (bbTag || bbTc) {
    const slates = [...document.querySelectorAll<HTMLElement>('#ceic-root > section')]
      .map((sec) => {
        const head = sec.querySelector('div[data-reveal]');
        const spans = head ? [...head.children].filter((c) => c.tagName === 'SPAN') : [];
        const num = spans[0]?.textContent?.trim();
        const kicker = spans[1]?.textContent?.trim();
        return num && kicker ? { sec, slate: `${num} / ${kicker}` } : null;
      })
      .filter((x): x is { sec: HTMLElement; slate: string } => x !== null);

    const FPS = 24;
    const TOTAL_FRAMES = FPS * 60 * 8; // el sitio "dura" 8 minutos de rollo
    const pad = (n: number) => String(n).padStart(2, '0');
    const toTimecode = (frames: number) => {
      const secs = Math.floor(frames / FPS);
      return `${pad(Math.floor(secs / 3600))}:${pad(Math.floor(secs / 60) % 60)}:${pad(
        secs % 60
      )}:${pad(frames % FPS)}`;
    };

    let currentSlate = TAG_DEFAULT;
    const updateSlate = () => {
      if (bbTc) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
        bbTc.textContent = toTimecode(Math.round(p * TOTAL_FRAMES));
      }
      if (!bbTag) return;
      const mid = window.scrollY + window.innerHeight / 2;
      let next = TAG_DEFAULT;
      for (const { sec, slate } of slates) {
        if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
          next = slate;
          break;
        }
      }
      if (next === currentSlate) return;
      currentSlate = next;
      bbTag.style.opacity = '0';
      setTimeout(() => {
        bbTag.textContent = next;
        bbTag.style.opacity = '1';
      }, 180);
    };
    window.addEventListener('scroll', updateSlate, { passive: true });
    window.addEventListener('resize', updateSlate, { passive: true });
    updateSlate();
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
  reveals.forEach((n) => {
    n.style.opacity = '0';
    n.style.transform = 'translateY(34px)';
    n.style.transition =
      'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)';
  });
  if (reduce) {
    reveals.forEach((n) => {
      n.style.opacity = '1';
      n.style.transform = 'none';
    });
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            const n = en.target as HTMLElement;
            n.style.transitionDelay = Math.min(i, 3) * 0.06 + 's';
            n.style.opacity = '1';
            n.style.transform = 'none';
            io.unobserve(n);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((n) => io.observe(n));
  }

  /* ---------- Contadores ---------- */
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const n = en.target as HTMLElement;
        const to = parseInt(n.getAttribute('data-count') || '0', 10) || 0;
        if (reduce) {
          n.textContent = String(to);
          cio.unobserve(n);
          return;
        }
        const dur = 1400;
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - start) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          n.textContent = String(Math.round(to * e));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(n);
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => cio.observe(n));

  /* ---------- Pósters: tilt + hover + lightbox ---------- */
  const posterEls = [...document.querySelectorAll<HTMLElement>('.ceic-poster')];
  const posterItems: LbItem[] = posterEls.map((p) => {
    const im = p.querySelector<HTMLImageElement>('.ceic-poster-img');
    return { src: im?.src || '', title: p.getAttribute('data-title') || '' };
  });
  posterEls.forEach((p, pi) => {
    const img = p.querySelector<HTMLImageElement>('.ceic-poster-img');
    const info = p.querySelector<HTMLElement>('.ceic-poster-info');
    const scan = p.querySelector<HTMLElement>('.ceic-poster-scan');
    if (!reduce) {
      p.addEventListener('mousemove', (e) => {
        const r = p.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
        if (img) img.style.transform = `scale(1.06) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    }
    p.addEventListener('mouseenter', () => {
      if (img) img.style.filter = 'brightness(1.02) contrast(1.08) saturate(1.02) sepia(.04)';
      if (info) info.style.opacity = '1';
      if (scan) scan.style.opacity = '.5';
    });
    p.addEventListener('mouseleave', () => {
      if (img) {
        img.style.filter = 'brightness(.8) contrast(1.16) saturate(.85) sepia(.12)';
        img.style.transform = 'none';
      }
      if (info) info.style.opacity = '0';
      if (scan) scan.style.opacity = '0';
    });
    const open = () => {
      if (img && img.style.display !== 'none') openLightbox(posterItems, pi);
    };
    p.addEventListener('click', open);
    p.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  /* ---------- Maestros: color-in al hover ---------- */
  document.querySelectorAll<HTMLElement>('.ceic-master').forEach((m) => {
    const img = m.querySelector<HTMLImageElement>('.ceic-master-img');
    m.addEventListener('mouseenter', () => {
      if (img) {
        img.style.filter = 'grayscale(.12) contrast(1.12) brightness(1.02) sepia(.05)';
        img.style.transform = 'scale(1.04)';
      }
    });
    m.addEventListener('mouseleave', () => {
      if (img) {
        img.style.filter = 'grayscale(1) contrast(1.35) brightness(.85) sepia(.25)';
        img.style.transform = 'none';
      }
    });
  });

  /* ---------- Drawer editorial con la biografía completa ---------- */
  const drawer = el('ceic-bio-drawer');
  const scrim = el('ceic-drawer-scrim');
  const drawerClose = el<HTMLButtonElement>('ceic-drawer-close');
  if (drawer && scrim) {
    const panels = drawer.querySelectorAll<HTMLElement>('[data-bio-panel]');
    let lastFocused: HTMLElement | null = null;

    const openDrawer = (idx: string, trigger: HTMLElement) => {
      lastFocused = trigger;
      panels.forEach((p) => {
        p.hidden = p.getAttribute('data-bio-panel') !== idx;
      });
      drawer.scrollTop = 0;
      drawer.classList.add('is-open');
      scrim.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      drawerClose?.focus();
    };
    const closeDrawer = () => {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      scrim.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lastFocused?.focus();
    };

    document.querySelectorAll<HTMLElement>('[data-bio-open]').forEach((card) => {
      const idx = card.getAttribute('data-bio-open') || '0';
      card.addEventListener('click', () => openDrawer(idx, card));
      card.addEventListener('keydown', (e) => {
        const k = (e as KeyboardEvent).key;
        if (k === 'Enter' || k === ' ') {
          e.preventDefault();
          openDrawer(idx, card);
        }
      });
    });
    drawerClose?.addEventListener('click', closeDrawer);
    scrim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ---------- Galería: lightbox (el zoom del hover es CSS) ---------- */
  const galEls = [...document.querySelectorAll<HTMLElement>('.ceic-gal-item')];
  const galItems: LbItem[] = galEls.map((f) => {
    const im = f.querySelector<HTMLImageElement>('img');
    return {
      src: im?.getAttribute('src') || '',
      title: f.getAttribute('data-caption') || im?.alt || '',
    };
  });
  galEls.forEach((f, gi) => {
    const open = () => {
      const im = f.querySelector<HTMLImageElement>('img');
      if (im && im.style.display !== 'none') openLightbox(galItems, gi);
    };
    f.addEventListener('click', open);
    f.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === 'Enter' || k === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  /* ---------- Cursos: hover ----------
     (Las tarjetas de servicios usan :hover en CSS, no necesitan JS.) */
  document.querySelectorAll<HTMLElement>('.ceic-course').forEach((c) => {
    c.addEventListener('mouseenter', () => (c.style.background = '#e7dfd0'));
    c.addEventListener('mouseleave', () => (c.style.background = '#efe9de'));
  });

  /* ---------- Parallax del hero ---------- */
  const heroContent = el('ceic-herocontent');
  if (!reduce && heroContent) {
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight) heroContent.style.transform = `translateY(${y * 0.22}px)`;
      },
      { passive: true }
    );
  }

  /* ---------- Menú móvil ----------
     El panel vive por debajo del nav, así que la propia hamburguesa hace de
     cerrar y no hace falta atrapar el foco: cerrado, el panel está en
     `visibility:hidden` y sus enlaces salen solos del orden de tabulación. */
  const burger = el<HTMLButtonElement>('ceic-burger');
  const menu = el('ceic-menu');
  if (burger && menu) {
    const mqMovil = window.matchMedia('(max-width: 720px)');

    const setMenu = (abrir: boolean) => {
      menu.classList.toggle('is-open', abrir);
      document.documentElement.classList.toggle('ceic-menu-open', abrir);
      menu.setAttribute('aria-hidden', abrir ? 'false' : 'true');
      burger.setAttribute('aria-expanded', abrir ? 'true' : 'false');
      burger.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = abrir ? 'hidden' : '';
    };
    const abrirMenu = () => {
      setMenu(true);
      menu.scrollTop = 0;
    };
    const cerrarMenu = () => {
      if (!menu.classList.contains('is-open')) return;
      setMenu(false);
      burger.focus();
    };

    burger.addEventListener('click', () => {
      if (menu.classList.contains('is-open')) cerrarMenu();
      else abrirMenu();
    });

    // Al elegir sección: cerrar y devolver el scroll ANTES del salto al ancla,
    // o el navegador no puede desplazarse con el body bloqueado.
    menu.querySelectorAll<HTMLElement>('[data-menu-link]').forEach((a) => {
      a.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrarMenu();
    });

    // Si se pasa a escritorio con el menú abierto, el panel se oculta por CSS
    // pero el scroll quedaría bloqueado y la hamburguesa en X. Se cierra.
    // Solo si estaba abierto: `setMenu(false)` suelta el scroll, y el intro lo
    // tiene bloqueado con su propio candado durante el conteo 3-2-1.
    const alCambiarAncho = () => {
      if (!mqMovil.matches && menu.classList.contains('is-open')) setMenu(false);
    };
    if (mqMovil.addEventListener) mqMovil.addEventListener('change', alCambiarAncho);
    else mqMovil.addListener(alCambiarAncho); // Safari < 14
  }

  void ACCENT;
}
