# Wajira Land

Sitio oficial del servidor de Minecraft **Wajira Land** (modpack All The Mods 10).
Construido con [Astro](https://astro.build) + islas de [React](https://react.dev) + [Tailwind CSS v4](https://tailwindcss.com), pensado para desplegarse como sitio 100% estático en GitHub Pages.

## Stack y arquitectura

- **Astro** genera HTML estático por defecto — máximo rendimiento y mejor Lighthouse posible.
- **Islas de React** (`src/components/islands/`) se hidratan solo donde hace falta interactividad real: botón de descarga, copiar IP, estado del servidor, badge de versión.
- **Tailwind v4** (config "CSS-first" en `src/styles/global.css`, sección `@theme`) define toda la identidad visual: paleta, tipografías, sombras de glow y animaciones.
- Sin dependencias de UI de terceros: iconos, partículas y microinteracciones (scroll reveal, ripple) son código propio y ligero.

```text
src/
├── assets/            Imágenes optimizadas por Astro (logo)
├── components/
│   ├── islands/        Componentes React interactivos (client:*)
│   ├── sections/        Secciones de página (Astro, estáticas)
│   └── ui/               Piezas reutilizables (Icon, tarjetas, encabezados de sección)
├── config/site.ts      Config central: repo de GitHub, IP del servidor, redes
├── data/                Contenido de features, pasos de instalación, nav
├── layouts/Layout.astro Layout base + SEO/OG
├── lib/                  Lógica de datos: GitHub Releases API, estado del servidor
├── scripts/              JS vanilla global (scroll reveal, ripple)
└── styles/global.css   Theme de Tailwind + estilos base
```

## Comandos

| Comando           | Acción                                      |
| ------------------ | -------------------------------------------- |
| `npm install`       | Instala dependencias                         |
| `npm run dev`       | Servidor de desarrollo en `localhost:4321`   |
| `npm run build`     | Build de producción en `./dist/`            |
| `npm run preview`   | Sirve el build de producción localmente      |

## Cómo se publica una nueva versión del modpack

El botón **"Descargar Modpack"**, el badge de versión del footer y el estado de la descarga **nunca** apuntan a un archivo fijo: en tiempo de ejecución consultan la API pública de GitHub

```
GET https://api.github.com/repos/TheWiche/WajiraLand-ATM10/releases/latest
```

(ver `src/lib/github-release.ts`) y usan el asset (`.mrpack`/`.zip`) del último release publicado. Esto significa que **para actualizar el modpack no hay que tocar ni una línea de código ni redesplegar el sitio**:

1. Sube el nuevo `.mrpack` (o `.zip`) como asset de un nuevo [GitHub Release](https://github.com/TheWiche/WajiraLand-ATM10/releases/new) del repo.
2. Usa una etiqueta de versión clara (por ejemplo `v1.1.0`) y, si quieres, un changelog en la descripción.
3. Listo. La próxima vez que alguien visite la web, el botón de descarga, la versión mostrada y el changelog se actualizan solos.

> El modpack **no** vive dentro del repositorio del sitio (pesa demasiado y no tiene sentido versionarlo junto al código). Solo se distribuye vía Releases.

## Conectar el estado real del servidor

`src/lib/server-status.ts` expone `fetchServerStatus()` con datos simulados. El componente `ServerStatus.tsx` ya está listo para consumir datos reales — solo hay que reemplazar el cuerpo de esa función por una llamada a una API pública (por ejemplo [mcsrvstat.us](https://api.mcsrvstat.us/)), tal como se explica en el comentario del propio archivo. Ningún otro archivo necesita cambios.

## Despliegue (GitHub Pages)

El workflow `.github/workflows/deploy.yml` construye el sitio y lo publica en GitHub Pages en cada push a `main`.

Configuración única en el repositorio (una sola vez):

1. **Settings → Pages → Source** → selecciona **GitHub Actions**.
2. Confirma que `astro.config.mjs` tiene `site` y `base` apuntando al usuario/repo correctos (ya configurado para `TheWiche/WajiraLand-ATM10`).

A partir de ahí, cada `git push` a `main` despliega automáticamente.

## Personalización

Toda la configuración editable vive en `src/config/site.ts`: IP del servidor, owner/repo de GitHub, enlace de Discord, versión de Minecraft, etc. No hay valores de este tipo repartidos por los componentes.
