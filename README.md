# López & Asociados — Sitio web

Sitio estático (HTML/CSS/JS, sin frameworks ni build step) recreado a partir
del diseño, contenido, colores, tipografía y logo de López & Asociados.

## Estructura

```
index.html            → Inicio
servicios.html         → Servicios
nuestro-equipo.html    → Nuestro Equipo
contacto.html          → Contacto
css/styles.css         → Estilos (un solo archivo)
js/main.js             → Menú móvil, buscador del equipo, tabs
assets/img/            → Fotos e imágenes (extraídas de los PDF originales)
```

No requiere instalación ni build: son archivos estáticos puros.

## Publicar en GitHub Pages (repo: upwyse/lopez-asociados)

Desde una terminal, dentro de esta carpeta:

```bash
git init
git remote add origin https://github.com/upwyse/lopez-asociados.git
git add .
git commit -m "Sitio López & Asociados"
git branch -M main
git push -u origin main
```

Si el repositorio ya tiene contenido (por ejemplo un README inicial),
usa en su lugar:

```bash
git clone https://github.com/upwyse/lopez-asociados.git
# copia todo el contenido de esta carpeta dentro de esa carpeta clonada
cd lopez-asociados
git add .
git commit -m "Sitio López & Asociados"
git push
```

### Activar GitHub Pages

1. Entra a `https://github.com/upwyse/lopez-asociados`
2. Ve a **Settings → Pages**
3. En "Build and deployment" → **Source**: elige **Deploy from a branch**
4. **Branch**: `main` / carpeta `/ (root)` → **Save**
5. Espera 1–2 minutos. El sitio quedará publicado en:

   **https://upwyse.github.io/lopez-asociados/**

## Notas

- El logo se recreó como SVG vectorial (mismos colores exactos: navy `#181E49`
  y naranja `#F26021`), ya que el original venía incrustado como texto/vector
  dentro del PDF y no como imagen exportable.
- Las fotos del equipo, fotos hero y los 4 sellos de reconocimiento
  (Chambers & Partners, Legal 500, LatinLawyer 250, Leaders League) se
  extrajeron directamente de los PDF originales.
- Los mapas de Bogotá y Medellín en `contacto.html` usan el embed público de
  Google Maps (sin API key). Si prefieres un mapa oficial con tu propia
  cuenta, reemplaza el `src` del `<iframe>` por el código de "Compartir →
  Insertar un mapa" de Google Maps.
- Los enlaces "Quiénes somos" e "Insights" del menú apuntan a las secciones
  correspondientes dentro de Inicio, ya que esas páginas no se incluyeron en
  el material fuente. Si más adelante quieres páginas propias para ellas, la
  estructura de las otras páginas sirve de plantilla directa.
