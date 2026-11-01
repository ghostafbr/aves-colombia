# Guía Aves de Colombia

Guía de campo y fotografía de aves con datos en vivo de iNaturalist.

## Publicar en GitHub Pages

1. Crea un repositorio (por ejemplo `aves-colombia`) y sube todos estos archivos a la raíz.
2. En el repo: Settings → Pages → Source: `Deploy from a branch` → rama `main`, carpeta `/ (root)`.
3. Abre `https://TU_USUARIO.github.io/aves-colombia/` en Chrome del celular → menú ⋮ → **Instalar app**.

Subdominio propio: agrega un archivo `CNAME` con el dominio (ej. `aves.tudominio.dev`) y un registro CNAME en tu DNS apuntando a `TU_USUARIO.github.io`.

## Actualizar

Reemplaza `index.html` y haz push. Si cambias archivos del paquete, sube la versión en `sw.js` (`aves-shell-v2` → `v3`) para que los celulares tomen la versión nueva.

## Archivos

- `index.html` — la app completa (también funciona abriéndola directo como archivo)
- `sw.js` — modo sin conexión e instalación
- `manifest.webmanifest`, `icon-*.png` — datos de la app instalable
