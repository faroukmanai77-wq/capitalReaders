// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://capitalreaders.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/search'),
    }),
  ],
});
