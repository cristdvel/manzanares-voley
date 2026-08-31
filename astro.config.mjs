// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cambia esto por el dominio real cuando esté confirmado.
  site: 'https://manzanaresvoley.com',
  integrations: [sitemap()],
});
