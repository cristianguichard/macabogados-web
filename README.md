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

## Cache de assets (importante al editar CSS/JS)

Cloudflare sirve los assets con `max-age=14400` (4 horas) y el proyecto no usa
build con hash en los nombres, así que un cambio de `styles.css` puede tardar en
verse. Por eso los HTML cargan:

```html
<link rel="stylesheet" href="styles.css?v=20261119b" />
<script src="script.js?v=20261119b"></script>
<script src="analytics.js?v=20261119b"></script>
```

**Al tocar `styles.css`, `script.js` o `analytics.js`, subí el `?v=` en los cuatro
HTML** (`index.html`, `cae.html`, `karime.html`, `404.html`). El HTML revalida
siempre, así que el visitante baja la versión nueva de inmediato.

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

## Medición (GA4)

El sitio usa **Google Analytics 4** con el ID `G-81PFMCP4B4`.

- **Tag base:** en el `<head>` de `index.html`, `cae.html` y `karime.html`.
- **Eventos propios:** `analytics.js`, cargado al final de esas tres páginas.

| Evento | Cuándo | Parámetros |
|--------|--------|------------|
| `page_view` | automático de GA4 | `page_location` |
| `whatsapp_click` | clic en cualquier enlace `wa.me` | `page_name`, `placement`, `link_text` |
| `tel_click` | clic en `tel:` | `page_name`, `placement`, `link_text` |
| `email_click` | clic en `mailto:` | `page_name`, `placement`, `link_text` |
| `contacto_enviado` | envío válido del formulario (home y CAE) | `page_name` |

`page_name` sale de `<body data-page="home|cae|karime">`. El `placement` sale del
atributo `data-track` de cada enlace (`float`, `contacto`, `footer`, `landing-cta`,
`landing-tel`, `landing-email`). Para sumar una variante nueva alcanza con agregar
`data-track="mi-etiqueta"` al enlace.

Sin datos personales: `analytics.js` nunca lee los campos del formulario. Si un
adblocker impide cargar `gtag`, el script se desactiva sin romper nada.

**Para ver el embudo en GA4:** Registrar los eventos como *key events*
(Admin → Key events) para `whatsapp_click` y `contacto_enviado`, y usar
*Realtime* para verificar que llegan.

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
