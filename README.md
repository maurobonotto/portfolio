# Portfolio de Mauro Bonotto - Editor de video

Este documento explica cómo agregar nuevos proyectos, categorías y cómo funciona el soporte bilingüe y los enlaces directos.

## Estructura del repositorio

- index.html - Estructura principal de la página.
- styles.css - Estilos (diseño responsive, modal, menú lateral, switch de idioma).
- script.js - Lógica de carga, modal, carrusel, menú y traducción dinámica.
- proyectos.json - Base de datos de proyectos (siempre en español, se traduce al inglés automáticamente).
- assets/img/portadas/ - Imágenes de portada.

## Soporte bilingüe (español / inglés)

- Detección automática: Se detecta el idioma del navegador (navigator.language). Si es español, muestra español; cualquier otro idioma muestra inglés.
- Selector manual: El usuario puede cambiar manualmente con el interruptor ESP/ENG en la barra superior. La preferencia se guarda en localStorage y persiste entre visitas.
- Forzar idioma por URL: Agrega ?lang=es o ?lang=en a la URL. Ejemplo: https://maurobonotto.ar/?lang=en#redes-sociales
  Esto cargará la página en inglés y se desplazará a la sección de Redes Sociales.
- Traducción automática: 
  - Textos fijos (menú lateral, contacto, categorías) mediante diccionario.
  - Líneas de detalles de cada proyecto mediante un mapa de patrones (ver "Agregar nuevas traducciones").
  - Títulos de proyectos y nombres de canales mediante reglas específicas.

## Enlaces directos a secciones con idioma

Puedes enviar a alguien directamente a una categoría específica y en el idioma deseado usando:

https://maurobonotto.ar/?lang=en#redes-sociales

- ?lang=en (o ?lang=es) fuerza el idioma.
- #redes-sociales (o #documentales, #ficcion, #trailers, #comerciales, #asistencia, #videoclips) desplaza la página a esa sección.

El sistema espera a que los proyectos estén cargados y luego hace el desplazamiento suave.

## Categorías disponibles

| Categoría       | ID en HTML            | Hash en URL                     |
|----------------|-----------------------|---------------------------------|
| Documentales    | documentales          | #documentales                   |
| Ficción         | ficcion               | #ficcion                        |
| Trailers        | trailers              | #trailers                       |
| Comerciales     | comerciales           | #comerciales                    |
| Asistencia      | asistencia            | #asistencia                     |
| Videoclips      | videoclips            | #videoclips                     |
| Redes Sociales  | redes-sociales        | #redes-sociales                 |

La categoría Redes Sociales tiene un comportamiento especial:
- Las imágenes de portada usan proporción 9:16 (vertical).
- El modal de video también usa 9:16 (vertical) y se adapta al alto de la pantalla.

## Agregar un nuevo proyecto

1. Subir la imagen de portada a assets/img/portadas/ con el patrón nombre-proyecto-categoria.jpg.
   - Para categoría redes-sociales, la imagen debe ser vertical (9:16). Para las demás, horizontal (16:9).
2. Abrir proyectos.json y agregar un nuevo objeto al final del array.

### Campos del proyecto

- id: identificador único, minúsculas y guiones. Ejemplo: "mi-proyecto".
- categoria: una de: "documentales", "ficcion", "trailers", "comerciales", "asistencia", "videoclips", "redes-sociales".
- titulo: título del proyecto en español.
- rol: tu rol en el proyecto. Ejemplos: "Edición", "Co-edición", "Edición + Guion de montaje", "Edición + Animaciones AFX", etc. Se traduce automáticamente.
- detalles: array de líneas de texto en español. Ejemplo: ["Cortometraje - 15 min.", "Dir.: Juan Perez"].
- img: ruta a la imagen de portada.
- tipo_enlace: "popup", "externo", "carrusel", "estatico".
- videos: array de IDs de YouTube (o Vimeo, con "plataforma": "vimeo"). No uses URLs completas de Instagram (no son compatibles).
- url_externa: URL completa (para tipo_enlace: "externo").
- plataforma: "vimeo" si los videos son de Vimeo (opcional).

### Ejemplo para Redes Sociales (con múltiples videos verticales)

{
  "id": "mi-reel",
  "categoria": "redes-sociales",
  "titulo": "MI TRABAJO EN REDES",
  "rol": "Edición",
  "detalles": [
    "Compilado de clips verticales.",
    "Plataforma: Instagram / TikTok"
  ],
  "img": "assets/img/portadas/mi-reel-redes-sociales.jpg",
  "tipo_enlace": "carrusel",
  "videos": ["ID_YOUTUBE1", "ID_YOUTUBE2"]
}

## Agregar una nueva categoría

1. En index.html, dentro del div class="sidebar-menu", añadir:
   <a href="#nueva-categoria" class="sidebar-link" data-key="nueva">NUEVA CATEGORÍA</a>
2. En script.js, en el objeto traducciones (dentro de es y en), añadir la clave nueva:
   es: { ..., nueva: 'NUEVA CATEGORÍA' },
   en: { ..., nueva: 'NEW CATEGORY' }
3. En la función generarSecciones, agregar la categoría al array ordenCategorias.
4. En el mismo generarSecciones, dentro del switch, agregar:
   case 'nueva-categoria': nombreCategoria = traducciones[idiomaActual].nueva; break;
5. Crear proyectos en proyectos.json con "categoria": "nueva-categoria".

## Agregar nuevas traducciones (patrones de texto)

Si agregas líneas a los detalles que no se traduzcan automáticamente, edita la función traducirDetalle en script.js. Busca el array reglas y añade tu nuevo par (español → inglés) al final de la sección "OTRAS FRASES". Los patrones más largos deben ir antes que los más cortos.

Ejemplo: añadir ['Inédito', 'Unreleased'].

## Notas adicionales

- Los datos originales en proyectos.json siempre deben estar en español.
- No es necesario modificar proyectos.json para cambiar el idioma; todo se maneja en script.js.
- El sitio es completamente estático y funciona sin backend.
- Los estilos usan CSS Grid, Flexbox y variables CSS.
- El reproductor modal soporta YouTube y Vimeo con navegación entre videos (carrusel).
- Para la categoría redes-sociales, el modal se adapta a formato vertical (9:16) y se centra dinámicamente.
- Los enlaces directos con ?lang= y # funcionan en primera carga gracias a handleInitialHash().

## Mantenimiento

- Al agregar un nuevo proyecto, asegúrate de que la imagen de portada exista y tenga el tamaño adecuado (16:9 excepto para redes-sociales que es 9:16).
- Si modificas la estructura del HTML (por ejemplo, agregas un nuevo elemento traducible), recuerda añadir el atributo data-key correspondiente y actualizar el objeto traducciones.
- Si encuentras algún texto que no se traduzca correctamente, revisa el mapa de traducción en traducirDetalle.
- Importante: No uses URLs de Instagram en el array videos. Solo IDs de YouTube o Vimeo.