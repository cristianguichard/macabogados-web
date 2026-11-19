# macabogados.cl — sitio estático

Sitio estático, sin build y sin dependencias. Listo para deploy en Cloudflare Pages.

## Estructura

```
macabogados-web/
├── index.html          # home (single-page)
├── cae.html            # guía CAE: embargos bancarios
├── karime.html         # landing de contacto directo (WhatsApp) — para compartir
├── 404.html            # página de error (Cloudflare Pages la sirve automáticamente)
├── styles.css          # estilos mobile-first (variables en :root)
├── script.js           # nav móvil + tabs FAQ + carousel (todo opcional)
├── robots.txt
├── sitemap.xml
├── imagenes/           # fotos y tarjetas sociales (og-home, og-cae, og-karime)
├── icon/               # logo
└── docs/               # material de origen del cliente (no se versiona)
```

## Desarrollo local

```bash
node serve.mjs          # → http://localhost:8000
node serve.mjs 8080     # otro puerto
```

`serve.mjs` no tiene dependencias y reproduce las **URLs limpias** de Cloudflare
Pages, para que los links funcionen igual en local que en producción:

| Producción | Local |
|------------|-------|
| `https://macabogados.cl/` | `http://localhost:8000/` |
| `https://macabogados.cl/cae` | `http://localhost:8000/cae` |
| `https://macabogados.cl/karime` | `http://localhost:8000/karime` |
| ruta inexistente → 404 | igual (sirve `404.html`) |

Si usás otro servidor estático (`python3 -m http.server`, `npx serve`), las URLs
limpias **no** existen: hay que abrir `karime.html` en vez de `karime`.

## Editar contenido

| Querés cambiar | Archivo |
|----------------|---------|
| Textos, secciones, links | `index.html` / `cae.html` / `karime.html` |
| Colores, fuentes, espaciado | `styles.css` (variables en `:root`) |
| Comportamiento nav/FAQ/carousel | `script.js` |
| Tarjetas para redes (1200×630) | `imagenes/og-home.png`, `imagenes/og-cae.png`, `imagenes/og-karime.png` |

## Tipografía

Se cargan desde Google Fonts (no hay carpeta `fonts/` local):

- **Cormorant Garamond** — títulos editoriales y hero
- **Inter** — cuerpo y navegación
- **Cinzel** — sello y microtipografía
- **Material Symbols Outlined** — íconos

## Deploy en Cloudflare Pages

### Opción 1 — Drag & drop

1. https://dash.cloudflare.com → Pages → "Upload assets"
2. Arrastrar la carpeta `macabogados-web/` completa
3. Project name: `macabogados` → Deploy

### Opción 2 — Conectar repo Git

Framework preset **None**, build command vacío, output `/` (raíz del repo).

### Qué configurar una vez desplegado

- **URLs limpias:** Pages publica `/cae.html` como `/cae` y redirige 308 la versión con `.html`.
  El canonical de la página apunta a `https://macabogados.cl/cae`.
- **`404.html`:** Pages la usa para cualquier ruta inexistente (status 404 real, sin soft-404).
- **`robots.txt` / `sitemap.xml`:** Cloudflare añade su bloque de *content signals* al robots;
  el `Sitemap:` apunta a `https://macabogados.cl/sitemap.xml`. Recordar correr
  `git status` antes de desplegar: Pages publica el árbol de trabajo.
- **Formulario:** Formspree (`https://formspree.io/f/xqagvnjz`). El envío se hace por `fetch`
  y muestra feedback ok/error sin salir de la página.

## Paleta

Definida en `styles.css` `:root`:

- `--bordeaux: #7d343f` (principal)
- `--bordeaux-dark: #4f2027` (hover/footer)
- `--cream: #f7f1e8` (fondo hero)
- `--gold: #b8935a` (decorativo)
- `--gold-ink: #8a6631` (variante AA para texto pequeño)
- `--aliceblue: #f0f8ff` (backgrounds suaves)

## Landing de contacto directo (`karime.html`)

Página pensada para compartir (bio de Instagram, WhatsApp, campañas): un solo
objetivo, que la persona escriba a Karime.

- URL pública: **https://macabogados.cl/karime**
- CTA principal: `https://wa.me/56973767165` con mensaje precargado.
- CTA secundario: `tel:+56973767165`.
- `noindex, follow`: no compite con el home en Google pero la tarjeta social
  (`og-karime.png`) se ve completa al compartir el link. Para indexarla, cambiar
  el meta `robots` a `index, follow` y agregarla a `sitemap.xml`.
- El número, el texto precargado y los datos de la tarjeta se editan en
  `karime.html` (buscar `wa.me`).

## Accesibilidad

- El hero se muestra completo sin JavaScript (`html:not(.js)` en `styles.css`).
- FAQ: tabs con `role="tab"`/`aria-selected` + acordeones `<details>` nativos.
- Carousel: región con `tabindex` y navegación por flechas.
- Sin violaciones en axe-core 4.10 (home, CAE y 404).

## Pendientes sugeridos

- Reemplazar las imágenes de `imagenes/` que ya no se usan (`cae.png`, `macabogado.png`).
- Optimizar `imagenes/balanza.webp` (fondo del hero, 344 KB) a AVIF/WebP responsive.
- Evaluar `srcset` para las fotos del equipo.
- Analítica (Cloudflare Web Analytics, gratis) y datos estructurados `LegalService`.
- Actualizar el monto de UF citado en `cae.html` (contenido con fecha).
