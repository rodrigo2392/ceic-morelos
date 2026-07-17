// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Sitio estático (SSG). Cambiaremos a 'server'/'hybrid' si el formulario
  // de leads necesita una API route en el mismo dominio.
  output: 'static',

  site: 'https://ceicmorelos.com',
  integrations: [react(), sitemap()],
  adapter: cloudflare(),
});