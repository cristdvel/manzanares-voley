## Proyecto

Web oficial del Club Voleibol Manzanares. Astro estático → Cloudflare Pages.
Detalles de despliegue y DNS en `DEPLOY.md`.

- Identidad de marca (no romper): naranja `#DC3C14` = acción, verde `#A0C828` =
  decorativo, nunca verde sobre blanco. Fuentes: Anton + Inter (+ Pacifico solo
  para el lettering "voley" del logo). Variables CSS `--mzv-*` en `global.css`.
- El contenido editable vive en `src/data/`. Los componentes de `src/components/`
  son una sección cada uno y no llevan lógica.
- Sin frameworks de CSS ni librerías JS. El JS de interacción está en un único
  `<script is:inline>` en `src/layouts/Base.astro`.
- Datos entre `[corchetes]` = pendientes de confirmar por el club.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
