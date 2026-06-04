# Portfolio de Mauro Bonotto - Editor de video

Este documento explica cómo agregar nuevos proyectos, categorías y cómo funciona el soporte bilingüe.

## Estructura del repositorio

- `index.html` - Estructura principal de la página.
- `styles.css` - Estilos (diseño responsive, modal, menú lateral, switch de idioma).
- `script.js` - Lógica de carga, modal, carrusel, menú y traducción dinámica.
- `proyectos.json` - Base de datos de proyectos (siempre en español, se traduce al inglés automáticamente).
- `assets/img/portadas/` - Imágenes de portada (JPG o PNG, 16:9, minúsculas con guiones).

## Soporte bilingüe (español / inglés)

- Detección automática del idioma del navegador (`navigator.language`). Si es español, muestra español; cualquier otro idioma muestra inglés.
- El usuario puede cambiar manualmente con el interruptor **ESP/ENG** en la barra superior. La preferencia se guarda en `localStorage` y persiste entre visitas.
- **Traducción automática**:
  - Textos fijos (menú lateral, contacto, categorías, etc.) se traducen mediante un diccionario.
  - Las líneas de `detalles` de cada proyecto se traducen con un mapa de patrones (ver sección "Agregar nuevas traducciones").
  - Títulos de proyectos y nombres de canales también se traducen cuando es necesario.
- **Reglas especiales**:
  - Si un título contiene ` - Co-editor`, esa etiqueta se elimina del título y se agrega como primera línea de los detalles ("Co-editor" en ambos idiomas).
  - Si un detalle contiene `Edición + animación`, esa línea se elimina y se añade al final del título como ` - Edición + animación` (o ` - Editing + Animation` en inglés).
  - Para el proyecto con `id: "el-farmer"` se elimina la línea `Editor principal` (o `Lead Editor` en inglés) para unificar formato.

## Agregar un nuevo proyecto

1. Subir la imagen de portada a `assets/img/portadas/` con el patrón `nombre-proyecto-categoria.jpg`.
2. Abrir `proyectos.json` y agregar un nuevo objeto al final del array.

### Campos del proyecto

- `id`: identificador único, minúsculas y guiones. Ejemplo: "mi-proyecto".
- `categoria`: una de: "documentales", "ficcion", "trailers", "comerciales", "asistencia", "videoclips".
- `titulo`: título. Si quieres "Co-editor", escribe "MI PROYECTO (2024) - Co-editor".
- `detalles`: array de líneas de texto. Ejemplo: ["Cortometraje - 15 min.", "Dir.: Juan Perez"].
- `img`: ruta a la imagen: "assets/img/portadas/archivo.jpg".
- `tipo_enlace`: "popup", "externo", "carrusel", "estatico".
- `videos`: array de IDs de YouTube (para "popup" o "carrusel").
- `url_externa`: URL completa (para "externo").
- `plataforma`: "vimeo" si aplica (opcional).

### Ejemplos

**Video de YouTube (popup):**

    {
      "id": "mi-pelicula",
      "categoria": "documentales",
      "titulo": "MI PELICULA (2024)",
      "detalles": ["Cortometraje - 15 min.", "Dir.: Ana Lopez"],
      "img": "assets/img/portadas/mi-pelicula-documentales.jpg",
      "tipo_enlace": "popup",
      "videos": ["dQw4w9WgXcQ"]
    }

**Enlace externo (IMDb):**

    {
      "id": "asistencia-ejemplo",
      "categoria": "asistencia",
      "titulo": "PELICULA (2024) - Co-editor",
      "detalles": ["Asistente de edicion", "Dir.: Carlos Ruiz"],
      "img": "assets/img/portadas/asistencia-ejemplo-asistencia.jpg",
      "tipo_enlace": "externo",
      "url_externa": "https://www.imdb.com/title/tt1234567/"
    }

**Múltiples videos (carrusel):**

    {
      "id": "serie-web",
      "categoria": "comerciales",
      "titulo": "SERIE WEB (2024)",
      "detalles": ["Serie - 3 caps.", "Dir.: Martin Gomez"],
      "img": "assets/img/portadas/serie-web-comerciales.jpg",
      "tipo_enlace": "carrusel",
      "videos": ["videoID1", "videoID2", "videoID3"]
    }

**Sin video (estático):**

    {
      "id": "proyecto-sin-video",
      "categoria": "documentales",
      "titulo": "PROYECTO (2024)",
      "detalles": ["En desarrollo"],
      "img": "assets/img/portadas/proyecto-sin-video-documentales.jpg",
      "tipo_enlace": "estatico"
    }

## Agregar una nueva categoría

1. En `index.html`, dentro del menú lateral (`<div class="sidebar-menu">`), añadir:
   `<a href="#entrevistas" class="sidebar-link" data-key="ent">ENTREVISTAS</a>`

2. En `script.js`, en el objeto `traducciones` (dentro de `es` y `en`), añadir la clave `ent`:

       es: { ..., ent: 'ENTREVISTAS' },
       en: { ..., ent: 'INTERVIEWS' }

3. En la función `generarSecciones`, agregar la categoría al array `ordenCategorias`:

       const ordenCategorias = ['documentales', 'ficcion', 'trailers', 'comerciales', 'asistencia', 'videoclips', 'entrevistas'];

4. En el mismo `generarSecciones`, dentro del `switch`, agregar:

       case 'entrevistas': nombreCategoria = traducciones[idiomaActual].ent; break;

5. Crear proyectos en `proyectos.json` con `"categoria": "entrevistas"`.

## Agregar nuevas traducciones (patrones de texto)

Si agregas líneas a los `detalles` que no se traduzcan automáticamente, edita la función `traducirDetalle` en `script.js`. Busca el array `mapa` y añade tu nuevo par al final. Los patrones más largos deben ir antes que los más cortos.

Ejemplo: añadir `['Inédito', 'Unreleased']`

## Notas adicionales

- Los datos originales en `proyectos.json` siempre deben estar en español.
- No es necesario modificar `proyectos.json` para cambiar el idioma; todo se maneja en `script.js`.
- El sitio es completamente estático y funciona sin backend.
- Los estilos usan CSS Grid, Flexbox y variables CSS.
- El reproductor modal soporta YouTube y Vimeo con navegación entre videos (carrusel).
- El menú lateral es responsive y se cierra automáticamente al hacer clic en un enlace.

## Mantenimiento

- Al agregar un nuevo proyecto, asegúrate de que la imagen de portada exista y tenga el nombre correcto.
- Si modificas la estructura del HTML (por ejemplo, agregas un nuevo elemento traducible), recuerda añadir el atributo `data-key` correspondiente y actualizar el objeto `traducciones`.
- Si encuentras algún texto que no se traduzca correctamente, revisa el mapa de traducción en `traducirDetalle`.