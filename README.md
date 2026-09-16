# López & Asociados — Sitio web

Sitio web estático (HTML + CSS + JavaScript, sin frameworks ni paso de
build) construido a partir del diseño, contenido, colores, tipografía y
logo de López & Asociados.

Firma especializada en derecho laboral y seguridad social, con sedes en
Bogotá y Medellín.

---

## Estructura del proyecto

```
lopez-asociados/
├── index.html            → Inicio
├── servicios.html        → Servicios (portafolio de 10 servicios)
├── nuestro-equipo.html   → Nuestro Equipo (con buscador y pestañas)
├── contacto.html         → Contacto (sedes + mapas)
├── css/
│   └── styles.css        → TODOS los estilos del sitio
├── js/
│   └── main.js           → TODA la lógica (menú, buscador, pestañas, animaciones)
├── assets/
│   └── img/              → Imágenes: logo, fotos del equipo, hero, sellos, favicon
├── .nojekyll            → Indica a GitHub Pages que sirva el sitio tal cual
└── README.md
```

Principio de organización: **cada tipo de código vive en su propio
archivo.** No hay CSS ni JavaScript incrustado (inline) dentro del HTML.
El HTML solo describe la estructura y usa clases; la apariencia está en
`css/styles.css` y el comportamiento en `js/main.js`.

No requiere instalación ni compilación: son archivos estáticos puros.
Para verlo en local basta con abrir `index.html` en el navegador, o
levantar un servidor simple:

```bash
# Python 3
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

---

## Hoja de estilos (`css/styles.css`)

El archivo está dividido en secciones comentadas, en este orden:

1. **Design System** — variables `:root` (paleta, tipografías, radios,
   sombras) y estilos base (reset, tipografía, contenedor).
2. **Componentes** — botones, header/navegación, hero, tarjetas de
   servicio, sellos, insights, banner CTA, footer, y los bloques
   específicos de cada página (equipo, contacto).
3. **Motion** — animaciones de entrada, reveal al hacer scroll y acentos.
4. **Responsive** — breakpoints de tablet, móvil y pantallas grandes.
5. **Utilities & helpers** — clases pequeñas reutilizables (ver abajo).

### Variables de marca (design tokens)

Definidas en `:root`, se usan con `var(--nombre)`:

| Variable        | Valor       | Uso                             |
|-----------------|-------------|---------------------------------|
| `--navy`        | `#181e49`   | Color principal (fondos, texto) |
| `--navy-900`    | `#12163a`   | Footer, fondos más oscuros      |
| `--orange`      | `#f26021`   | Color de acento / marca         |
| `--orange-600`  | `#d9541c`   | Acento sobre fondo claro, hover |
| `--ink`         | `#181e49`   | Títulos                         |
| `--body`        | `#565c78`   | Texto de párrafo                |
| `--font-display`| Poppins     | Títulos                         |
| `--font-body`   | Inter       | Texto de cuerpo                 |

Para cambiar un color en todo el sitio, se edita una sola vez en `:root`.

### Clases utilitarias (helpers)

Reemplazan a los antiguos estilos inline. Se combinan con las clases de
componente:

| Clase             | Qué hace                                              |
|-------------------|-------------------------------------------------------|
| `.mt-14` … `.mt-32`| Margen superior (14, 16, 22, 32 px)                  |
| `.eyebrow.center` | Centra el texto del eyebrow                           |
| `.section.no-top` | Sección sin padding superior                          |
| `.em-plain`       | Énfasis en color naranja sin cursiva                  |
| `.measure-60`     | Limita el ancho del texto a ~60 caracteres            |
| `.lead.full`      | Quita el ancho máximo del párrafo lead                |
| `.link-arrow.on-orange` | Enlace con flecha en blanco (sobre fondo naranja)|
| `.title-nowrap`   | Título en una sola línea (se pliega en móvil)         |
| `.hero-text-wide` | Columna de texto del hero más ancha                   |
| `.hero.tight`     | Hero con menos padding inferior                        |
| `.side-label`     | Etiqueta pequeña del panel lateral del equipo         |
| `.team-tab-note`  | Nota de aviso en pestañas del equipo (oculta por defecto)|
| `.is-hidden`      | Oculta un elemento (usada por el JS)                  |

### Componentes clave

- **`.services-grid`** — cuadrícula fija de 3 columnas (usada en el Inicio,
  6 servicios en 3×2).
- **`.services-grid.flex-grid`** — variante flexible (usada en Servicios,
  10 servicios). La última fila se completa con `.service-card--cta`, el
  bloque naranja de llamado a la acción, para que no queden celdas vacías.
- **`.team-card`** — tarjeta de integrante del equipo; incluye `data-name`
  con nombre y cargo, que es lo que lee el buscador.

---

## JavaScript (`js/main.js`)

Escrito en JavaScript moderno (ES6+): usa `const` / `let` (sin `var`),
funciones flecha y APIs actuales (`classList.toggle`, `dataset`,
`IntersectionObserver`). No depende de ninguna librería.

Todo arranca en un único `DOMContentLoaded` que llama a cinco funciones,
cada una responsable de una cosa:

| Función             | Responsabilidad                                          |
|---------------------|----------------------------------------------------------|
| `initMobileNav()`   | Abre/cierra el menú hamburguesa en móvil.                |
| `initTeamSearch()`  | Filtra las tarjetas del equipo según lo que se escribe.  |
| `initTeamTabs()`    | Cambia entre las pestañas del panel lateral del equipo.  |
| `initScrollReveal()`| Anima la aparición de secciones al hacer scroll.         |
| `initHeaderShadow()`| Añade sombra al header cuando la página se desplaza.      |

Cada función revisa primero si los elementos existen en la página actual
(guard clause) y sale si no, así el mismo archivo sirve para las 4 páginas
sin errores.

### Mejora progresiva (progressive enhancement)

Las animaciones de scroll solo ocultan contenido **después** de que el
JavaScript confirma que puede ejecutarse (añade la clase `.js-reveal` al
`<html>`). Si el JS fallara o estuviera desactivado, todo el contenido se
muestra igualmente. Además, se respeta la preferencia del sistema
`prefers-reduced-motion`: si el usuario pidió menos movimiento, se desactivan
las animaciones.

---

## Publicar cambios en GitHub Pages

El sitio ya está publicado en:

**https://upwyse.github.io/lopez-asociados/**

Para subir cambios nuevos (repo `upwyse/lopez-asociados`, rama `main`):

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

GitHub Pages reconstruye el sitio automáticamente en 1–2 minutos.

### Cambiar la versión de caché

Cuando se editan `styles.css` o `main.js`, los navegadores pueden seguir
mostrando la versión anterior por caché. Para forzar la recarga, en cada
archivo `.html` se incrementa el número de versión en los enlaces:

```html
<link rel="stylesheet" href="css/styles.css?v=8">
<script src="js/main.js?v=8"></script>
```

Basta con subir `?v=8` a `?v=9` (etc.) en las 4 páginas.

### Activar GitHub Pages (si se reinstala desde cero)

1. Entra a `https://github.com/upwyse/lopez-asociados`
2. **Settings → Pages**
3. En "Build and deployment" → **Source**: **Deploy from a branch**
4. **Branch**: `main` / carpeta `/ (root)` → **Save**

---

## Notas de contenido

- **Logo:** es el logotipo real de la firma, extraído de los PDF originales
  en alta resolución. Hay dos versiones en `assets/img/`:
  `logo-lockup.png` (navy + naranja, para fondos claros) y
  `logo-lockup-white.png` (blanco + naranja, para el footer oscuro).
- **Imágenes:** las fotos del equipo, las fotos de portada (hero) y los 4
  sellos de reconocimiento (Chambers & Partners, Legal 500, LatinLawyer 250,
  Leaders League) se extrajeron directamente de los PDF originales.
- **Mapas:** los mapas de Bogotá y Medellín en `contacto.html` usan el embed
  público de Google Maps (sin API key). Para un mapa vinculado a una cuenta
  propia, reemplaza el `src` del `<iframe>` por el código de
  "Compartir → Insertar un mapa" de Google Maps.
- **Menú:** los enlaces "Quiénes somos" e "Insights" apuntan a secciones
  dentro de Inicio, ya que esas páginas no venían en el material fuente. La
  estructura de las páginas existentes sirve de plantilla si más adelante se
  quieren crear páginas propias para ellas.
