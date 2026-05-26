PORTFOLIO DE MAURO BONOTTO - EDITOR DE VIDEO

Este es el codigo fuente del portfolio online de Mauro Bonotto. La pagina muestra proyectos organizados por categorias (documentales, ficcion, trailers, comerciales, asistencia de edicion, videoclips). Cada proyecto tiene una imagen de portada y al hacer clic se abre un reproductor de video (YouTube o Vimeo) o un enlace externo (IMDb, etc.).

ESTRUCTURA DEL REPOSITORIO

- index.html (Pagina principal)
- styles.css (Estilos CSS)
- script.js (Logica JavaScript: carga de proyectos, modal, menu)
- proyectos.json (Base de datos de todos los proyectos)
- .nojekyll (Archivo vacio para desactivar Jekyll en GitHub Pages)
- assets/img/portadas/ (Carpeta donde se guardan las imagenes de portada, formato JPG o PNG)

COMO AGREGAR UN NUEVO PROYECTO

1. Preparar la imagen de portada
   - La imagen debe tener relacion de aspecto 16:9 (recomendado: 1280x720 pixeles).
   - Nombrarla siguiendo el patron: nombre-del-proyecto-categoria.jpg
     Ejemplo: mi-pelicula-documentales.jpg
   - Subirla a la carpeta assets/img/portadas/

2. Agregar la entrada en proyectos.json

Abrir el archivo proyectos.json y agregar un nuevo objeto al final de la lista (antes del corchete de cierre final). Respetar la sintaxis JSON (comas entre objetos, sin coma despues del ultimo).

Estructura basica de un proyecto:

{
  "id": "identificador-unico",
  "categoria": "nombre-de-categoria",
  "titulo": "TITULO DEL PROYECTO (año)",
  "detalles": [
    "Linea 1 de descripcion",
    "Linea 2 de descripcion",
    "Dir.: Nombre del director",
    "Prod.: Productora"
  ],
  "img": "assets/img/portadas/nombre-del-archivo.jpg",
  "tipo_enlace": "popup",
  "videos": ["ID1", "ID2"]
}

EXPLICACION DE CAMPOS

- id: Identificador unico (sin espacios, usar guiones). Ejemplo: "mi-proyecto"
- categoria: Categoria a la que pertenece. Valores posibles: "documentales", "ficcion", "trailers", "comerciales", "asistencia", "videoclips"
- titulo: Titulo del proyecto. Si tiene " - Co-editor" se mostrara en cursiva automaticamente. Ejemplo: "MI PELICULA (2024) - Co-editor"
- detalles: Array de lineas de texto que aparecen debajo del titulo. Ejemplo: ["Serie - 8 caps. x 30 min.", "Dir.: Juan Perez"]
- img: Ruta a la imagen de portada (relativa a la raiz del sitio). Ejemplo: "assets/img/portadas/mi-proyecto-documentales.jpg"
- tipo_enlace: Comportamiento al hacer clic en la portada. Valores: "popup" (video en ventana modal), "externo" (abre en nueva pestaña), "carrusel" (multiples videos con flechas), "estatico" (sin enlace)
- videos: Array de IDs de YouTube o Vimeo (solo para tipo_enlace "popup" o "carrusel"). Ejemplo: ["abc123DEF", "xyz789GHI"]
- url_externa: URL completa (solo para tipo_enlace "externo"). Ejemplo: "https://www.imdb.com/title/tt1234567/"
- plataforma: Opcional, para videos que no son YouTube. Valor: "vimeo" (si se omite, asume YouTube)

EJEMPLOS COMPLETOS

A. Proyecto con video de YouTube (popup simple):

{
  "id": "mi-trailer",
  "categoria": "trailers",
  "titulo": "MI PELICULA (2024)",
  "detalles": [
    "Trailer oficial",
    "Dir.: Ana Lopez",
    "Prod.: Cine Independiente"
  ],
  "img": "assets/img/portadas/mi-pelicula-trailers.jpg",
  "tipo_enlace": "popup",
  "videos": ["dQw4w9WgXcQ"]
}

B. Proyecto con enlace externo (IMDb, YouTube directo, etc.):

{
  "id": "mi-obra-externa",
  "categoria": "asistencia",
  "titulo": "AYUDANTE DE EDICION (2024)",
  "detalles": [
    "Asistente de edicion",
    "Dir.: Carlos Ruiz"
  ],
  "img": "assets/img/portadas/mi-obra-asistencia.jpg",
  "tipo_enlace": "externo",
  "url_externa": "https://www.imdb.com/title/tt9876543/"
}

C. Proyecto con multiples videos (carrusel):

{
  "id": "serie-web",
  "categoria": "comerciales",
  "titulo": "SERIE WEB (2024)",
  "detalles": [
    "Serie - 3 caps. x 5 min.",
    "Dir.: Martin Gomez"
  ],
  "img": "assets/img/portadas/serie-web-comerciales.jpg",
  "tipo_enlace": "carrusel",
  "videos": ["video1ID", "video2ID", "video3ID"]
}

D. Proyecto sin video (estatico):

{
  "id": "proyecto-sin-video",
  "categoria": "documentales",
  "titulo": "PROYECTO EN PREPRODUCCION (2024)",
  "detalles": [
    "En fase de desarrollo",
    "Proximamente"
  ],
  "img": "assets/img/portadas/proyecto-sin-video-documentales.jpg",
  "tipo_enlace": "estatico"
}

COMO AGREGAR UNA NUEVA CATEGORIA

1. Decidir el nombre de la categoria (en minusculas, sin espacios). Ejemplo: "entrevistas".

2. Agregar la categoria al menu lateral. Editar index.html, buscar la seccion <div class="sidebar-menu"> y anadir un nuevo enlace:
   <a href="#entrevistas" class="sidebar-link">ENTREVISTAS</a>

3. Agregar la categoria al orden de secciones. Editar script.js, buscar la linea donde esta ordenCategorias (dentro de generarSecciones) y anadir tu categoria al array:
   const ordenCategorias = ['documentales', 'ficcion', 'trailers', 'comerciales', 'asistencia', 'videoclips', 'entrevistas'];

4. Crear proyectos con esa categoria en proyectos.json:
   {
     "id": "primera-entrevista",
     "categoria": "entrevistas",
     "titulo": "ENTREVISTA A ...",
     ...
   }

5. Opcional: definir un titulo especial para la categoria (si quieres que se muestre en mayusculas diferente). En script.js, dentro de generarSecciones, puedes anadir:
   if (categoria === 'entrevistas') nombreCategoria = 'ENTREVISTAS';

RECOMENDACIONES PARA LAS IMAGENES DE PORTADA

- Formato: JPG o PNG. JPG es preferible para optimizar peso.
- Tamano: 1280x720 pixeles (16:9) es ideal. No usar imagenes mas grandes de 1920x1080.
- Peso: intentar que cada imagen no supere los 200-300 KB (usar herramientas como TinyPNG).
- Nombres: usar solo minusculas, numeros y guiones. Sin espacios ni caracteres especiales.
  Correcto: mi-proyecto-documentales.jpg
  Incorrecto: Mi Proyecto (2024).jpg

COMO PROBAR CAMBIOS LOCALMENTE

Antes de subir a GitHub, se puede probar el sitio en la computadora:

1. Instalar un servidor local simple (si se tiene Python):
   python -m http.server 8000
2. Abrir el navegador en http://localhost:8000
3. Revisar que todos los proyectos carguen y los videos se reproduzcan.

DESPLIEGUE EN GITHUB PAGES

1. Subir todos los archivos al repositorio (rama main o master).
2. Ir a Settings -> Pages -> Source -> seleccionar Deploy from a branch y la rama main, carpeta / (root).
3. Esperar 1-2 minutos. La pagina estara en https://maurobonotto.github.io/portfolio/

SOLUCION DE PROBLEMAS COMUNES

- El video no se reproduce (error "Video no disponible"): verificar que el ID de YouTube sea correcto (sensible a mayusculas/minusculas). Comprobar si el video permite incrustacion (opcion en YouTube Studio). Si no, cambiarlo a tipo_enlace "externo".

- La imagen no se carga: revisar la ruta en el JSON. Debe ser exacta, empezando por assets/img/portadas/. GitHub Pages diferencia mayusculas/minusculas en las rutas.

- El menu hamburguesa no despliega categorias: asegurarse de que los enlaces del menu tengan href="#nombre-categoria" y que la seccion en el main tenga id="nombre-categoria". Revisar que la categoria este listada en ordenCategorias en script.js.

- Proyecto estatico (sin enlace) muestra el icono de play: verificar que tipo_enlace sea exactamente "estatico" (sin errores ortograficos). El icono de play no se mostrara.

NOTAS FINALES

- El archivo proyectos.json debe ser valido (sin comas al final, llaves y corchetes balanceados). Usar un validador JSON si hay dudas.
- Si se agregan muchos proyectos, el sitio sigue siendo rapido porque las imagenes se cargan con loading="lazy".
- Los metadatos SEO ya estan configurados en index.html (titulo, descripcion, Open Graph, Twitter Card). Si se cambia de dominio, actualizar las URLs en las etiquetas og:url y twitter:image.

Listo. Ahora se puede mantener el portfolio actualizado facilmente. Cualquier duda, revisar este README o contactar al desarrollador.
