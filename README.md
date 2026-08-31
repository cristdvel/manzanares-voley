# Manzanares Voley — web oficial

Sitio web del Club Voleibol Manzanares (Madrid, desde 2016). Astro estático,
sin framework de CSS, desplegado en Cloudflare Pages.

## Stack

- **Astro** (build estático, sin adaptador)
- CSS propio con custom properties (`src/styles/global.css`)
- JS vanilla en línea (`src/layouts/Base.astro`): menú móvil, tabs, acordeón FAQ,
  validación del formulario y cálculo de categoría por fecha de nacimiento
- `@astrojs/sitemap`

## Estructura

```
src/
├── data/            # Contenido editable (equipos, historia, FAQ, textos, imágenes)
├── components/       # Una pieza por sección de la home
├── layouts/Base.astro  # <head>, fuentes, SEO y el <script> de interacción
├── styles/global.css
└── pages/index.astro   # Compone todas las secciones
public/
├── favicon.svg      # Icono manzana-corazón del club
├── _headers         # Cabeceras de seguridad (Cloudflare Pages)
└── _redirects       # www → dominio principal (Cloudflare Pages)
```

Para cambiar textos, equipos, horarios, hitos o preguntas frecuentes se editan
los ficheros de `src/data/`. No hace falta tocar el HTML.

## Comandos

| Comando           | Acción                                    |
| :---------------- | :---------------------------------------- |
| `npm install`     | Instala dependencias                      |
| `npm run dev`     | Servidor local en `localhost:4321`        |
| `npm run build`   | Genera el sitio en `./dist/`              |
| `npm run preview` | Sirve el build para revisarlo             |

## Despliegue

Cada `push` a `main` dispara un build y deploy automático en Cloudflare Pages.
Pasos de configuración y DNS en [`DEPLOY.md`](./DEPLOY.md).

## Pendiente antes del lanzamiento

- Sustituir las imágenes de Unsplash por fotos reales del club
- Logo: sustituir la reconstrucción SVG (`src/components/LogoSprite.astro` y
  `public/favicon.svg`) por los archivos oficiales cuando estén disponibles
- Completar datos entre `[corchetes]`: nombres del staff, teléfono, rivales
- Página y contenido real de **Política de privacidad**
- Conectar el formulario de inscripción a un backend real (email o Cloudflare
  Pages Functions)
- Confirmar horarios y divisiones de los equipos (`src/data/equipos.ts`)
