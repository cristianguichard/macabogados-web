# macabogados.cl — sitio estático

Versión estática del sitio, sin build, sin dependencias. Lista para deploy en Cloudflare Pages.

## Estructura

```
macabogados-web/
├── index.html          # toda la página (single-page)
├── styles.css          # estilos mobile-first
├── script.js           # nav móvil + FAQ + carousel
├── imagenes/           # assets
├── avatars/            # fotos testimonios
├── icon/               # logo
├── fonts/              # Poppins + Roboto
└── README.md
```

## Desarrollo local

Cualquier servidor estático sirve. Ejemplos:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8000
```

Abrí `http://localhost:8000` en el browser.

## Editar contenido

| Querés cambiar | Archivo |
|----------------|---------|
| Textos, secciones, links | `index.html` |
| Colores, fuentes, espaciado | `styles.css` (variables en `:root`) |
| Comportamiento FAQ/carousel | `script.js` |

## Deploy en Cloudflare Pages

### Opción 1 — Drag & drop (más rápida)

1. Ir a https://dash.cloudflare.com → Pages
2. "Create application" → "Upload assets" → "Drag and drop"
3. Arrastrar la carpeta `macabogados-web/` completa
4. Project name: `macabogados`
5. Click "Deploy site"
6. Cloudflare asigna URL `macabogados.pages.dev`
7. Para usar `macabogados.cl`: Custom domains → Set up → apuntar DNS

### Opción 2 — Conectar repo Git

1. Subir `macabogados-web/` a un repo GitHub
2. Pages → "Connect to Git" → seleccionar repo
3. Build settings:
   - Framework preset: **None**
   - Build command: *(vacío)*
   - Build output: `/` (raíz del repo)
4. Save and Deploy

### DNS para dominio custom

Si `macabogados.cl` ya está en Cloudflare:

1. Pages → Custom domains → `macabogados.cl`
2. Cloudflare configura DNS automático
3. Esperar propagación (~5 min)

Si está en otro registrar:

1. Crear CNAME `macabogados.cl` → `macabogados.pages.dev`
2. O registros A según指示 de Cloudflare

## Paleta de colores

Definida en `styles.css` `:root`:

- `--bordeaux: #7d343f` (color principal)
- `--bordeaux-dark: #4f2027` (hover/footer)
- `--aliceblue: #f0f8ff` (backgrounds suaves)

## Próximos pasos (no incluidos)

- Migrar formulario a Formspree o Workers para notificaciones reales
- Agregar página `/nosotras` individual
- Optimizar imágenes (WebP, srcset responsive)
- Analytics (Cloudflare Web Analytics, gratis)