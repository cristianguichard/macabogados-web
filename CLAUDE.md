# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repositorio

Sitio web estático de **macabogados.cl**. Migración desde Noodl/React a HTML/CSS/JS plano. Sin build step, sin dependencias, sin `package.json`. Hosteado en **Cloudflare Pages**.

Repo hermano (NO este): `cristianguichard/macabogados` — contiene el proyecto fuente Noodl original. Este repo es el artefacto que se publica.

## Comandos

### Dev local

Cualquier servidor estático funciona. No hay build, no hay tests, no hay linter configurado.

```bash
# Python (recomendado, sin instalar nada)
python3 -m http.server 8000

# Node
npx serve .

# PHP
php -S localhost:8000
```

Abrir `http://localhost:8000`.

### Deploy

Drag & drop carpeta completa a Cloudflare Pages, o conectar este repo GitHub con:
- Framework preset: **None**
- Build command: *(vacío)*
- Build output directory: `/`

### Git

Repo nuevo, branch único `master`. Conventional commits (sin `Co-Authored-By`).

## Arquitectura

**Single-page estática, 3 archivos:**

| Archivo | Líneas | Responsabilidad |
|---------|--------|-----------------|
| `index.html` | 313 | Markup semántico, 8 secciones in-page |
| `styles.css` | 613 | Mobile-first, variables CSS en `:root` |
| `script.js` | 63 | Nav móvil, FAQ categorías, carousel — IIFE con `'use strict'` |

**Assets:** `imagenes/`, `avatars/`, `icon/logo_mac.png`. Tipografía Poppins/Roboto desde Google Fonts CDN (NO bundled — los `.ttf` originales fueron borrados del repo).

### Secciones HTML (en orden)

1. `<header class="nav">` — sticky, hamburguesa en mobile
2. `<section class="hero">` — imagen de fondo + título + CTA
3. `<section class="section--areas">` — grid 4 cards (Civil/Penal/Laboral/Familia)
4. `<section class="section--about">` — texto + 2 fotos abogadas
5. `<section class="section--faq">` — 3 categorías + acordeones `<details>`
6. `<section class="section--testimonials">` — carousel horizontal `scroll-snap`
7. `<section class="section--contact">` — form mailto + info contacto
8. `<footer class="footer">` — contacto + copyright

### Convenciones del código

- **CSS naming:** BEM-ish (`block__element--modifier`)
- **CSS variables:** siempre en `:root`, no scattered
- **JS:** IIFE clásica, no módulos ES6 (mantener simple)
- **Accesibilidad:** `aria-label` en iconos, `<details>/<summary>` para acordeón, `prefers-reduced-motion` respetado
- **Responsive:** mobile-first, breakpoints `768px` y `1024px`
- **No frameworks.** No agregar React/Vue/Tailwind sin discusión previa.

### Paleta de colores

Variables CSS en `styles.css`:

```
--bordeaux: #7d343f      /* principal: títulos, botones */
--bordeaux-dark: #4f2027 /* hover, footer */
--aliceblue: #f0f8ff     /* backgrounds suaves */
```

Cambiar paleta = editar `:root` una sola vez.

## Editar contenido

| Querés cambiar | Archivo a tocar |
|----------------|-----------------|
| Textos, agregar sección, links | `index.html` |
| Colores, fuentes, espaciado | `styles.css` (`:root`) |
| Comportamiento FAQ/carousel/nav | `script.js` |
| Imágenes | Reemplazar archivo en `imagenes/` o `avatars/` |

## Form de contacto

Usa `mailto:mac@macabogados.cl` con `enctype="text/plain"` — abre cliente email del usuario. **No hay backend.** Si querés notificaciones reales: Formspree, Cloudflare Workers, o EmailJS (decidir antes de implementar, no después).

## Out of scope (no hacer sin discutir)

- Agregar build step / bundler / TypeScript
- Agregar frameworks JS (React/Vue/Astro)
- Migrar a Tailwind
- Optimización de imágenes automática (WebP, srcset)
- CMS / backend / base de datos
- Tests automatizados (no hay infra, sitio trivial)

## Specs del proyecto

Diseño original documentado en:
- `../docs/superpowers/specs/2026-06-23-macabogados-static-design.md` (path relativo desde este repo)

## Verificación manual

Después de cambios grandes:

1. `python3 -m http.server 8000`
2. Abrir en browser
3. Verificar: nav, scroll suave, FAQ expande, carousel scrollea, form abre cliente email
4. Test responsive: 375px (mobile), 768px (tablet), 1280px (desktop)
5. Validar consola: 0 errors

No hay CI ni tests automatizados. La verificación es manual.