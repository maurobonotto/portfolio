# Portfolio de Mauro Bonotto - Editor de video

Este documento explica como agregar nuevos proyectos y categorias al portfolio.

## Estructura del repositorio

- proyectos.json - Base de datos de todos los proyectos.
- assets/img/portadas/ - Carpeta para las imagenes de portada (JPG o PNG, relacion 16:9, nombre en minusculas con guiones).

## Agregar un nuevo proyecto

1. Subir la imagen de portada a assets/img/portadas/ con el patron: nombre-proyecto-categoria.jpg (ejemplo: mi-pelicula-documentales.jpg).

2. Abrir proyectos.json y agregar un nuevo objeto al final (antes del corchete de cierre final). Respetar la sintaxis JSON (comas entre objetos, sin coma despues del ultimo).

### Campos

- id: Identificador unico, minusculas y guiones. Ejemplo: "mi-proyecto"
- categoria: "documentales", "ficcion", "trailers", "comerciales", "asistencia", "videoclips"
- titulo: Titulo del proyecto. Si tiene " - Co-editor" se mostrara en cursiva.
- detalles: Array de lineas de texto. Ejemplo: ["Cortometraje - 15 min.", "Dir.: Juan Perez"]
- img: Ruta a la imagen: "assets/img/portadas/archivo.jpg"
- tipo_enlace: "popup" (video), "externo" (enlace externo), "carrusel" (varios videos), "estatico" (sin enlace)
- videos: Array de IDs de YouTube (solo para popup o carrusel). Ejemplo: ["abc123DEF"]
- url_externa: URL completa (solo para externo). Ejemplo: "https://www.imdb.com/title/tt123/"
- plataforma: "vimeo" si el video es de Vimeo (opcional, por defecto YouTube)

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
  "titulo": "PELICULA (2024)",
  "detalles": ["Asistente de edicion", "Dir.: Carlos Ruiz"],
  "img": "assets/img/portadas/asistencia-ejemplo-asistencia.jpg",
  "tipo_enlace": "externo",
  "url_externa": "https://www.imdb.com/title/tt1234567/"
}

**Multiples videos (carrusel):**

{
  "id": "serie-web",
  "categoria": "comerciales",
  "titulo": "SERIE WEB (2024)",
  "detalles": ["Serie - 3 caps.", "Dir.: Martin Gomez"],
  "img": "assets/img/portadas/serie-web-comerciales.jpg",
  "tipo_enlace": "carrusel",
  "videos": ["videoID1", "videoID2", "videoID3"]
}

**Sin video (estatico):**

{
  "id": "proyecto-sin-video",
  "categoria": "documentales",
  "titulo": "PROYECTO (2024)",
  "detalles": ["En desarrollo"],
  "img": "assets/img/portadas/proyecto-sin-video-documentales.jpg",
  "tipo_enlace": "estatico"
}

## Agregar una nueva categoria

1. En index.html, dentro de <div class="sidebar-menu">, agregar un nuevo enlace:
   <a href="#entrevistas" class="sidebar-link">ENTREVISTAS</a>

2. En script.js, dentro de generarSecciones, agregar la categoria al array ordenCategorias:
   const ordenCategorias = ['documentales', 'ficcion', 'trailers', 'comerciales', 'asistencia', 'videoclips', 'entrevistas'];

3. Opcional: si se quiere un titulo especial, dentro de generarSecciones agregar:
   if (categoria === 'entrevistas') nombreCategoria = 'ENTREVISTAS';

4. Crear proyectos en proyectos.json con "categoria": "entrevistas".
