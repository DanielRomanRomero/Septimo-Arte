# CLAUDE.md

Proyecto:
Aplicación web tipo buscador de películas

Rol del agente:
Desarrollador web con 12 años de experiencia.

Objetivo:
Crea una aplicación web que nos permita buscar películas y tener un catálogo de cine para consultar consumiendo los datos de un api externa (que luego te indicaré)


Funcionalidades de la aplicación:
- Input de búsqueda
- Consumo de API externa
- Home page con listado de los últimos estrenos
- Listado de resultados
- Paginación
- Filtros (año, ratings, categorías)
- Vista de detalle con la sinopsis, imagen de portada, etc
- Manejo de errores
- Indicador de carga
- Poder marcar si la he visto o no
- Poder marcar si me gusta o no
- Marcar como pendiente de ver
- Sección de peliculas vistas
- Sección de peliculas pendientes de ver
- La información del usuario se guardará en data/mis_datos.json (la app será para uso solo personal, no para multiples usuarios)

Información del api externa:
- El api que vamos a usar es TMDB (The Movie Database), que el api es gratis.
- Las urls de la documentación son estas (si no sabes como hacer algo con el api, investiga en la documentación):
    https://developer.themoviedb.org/reference/intro/getting-started
    https://developer.themoviedb.org/docs/getting-started

- El API KEY para usar el api rest, lo tendrás en el fichero .env que está en la raiz del proyecto. La variable que tienes que usar es API_KEY y debes usar la librería dotenv para acceder a ellas (si no está instalada, instálala)


Stack de tecnología:
- HTML5
- CSS3
- JavaScript
- React

Preferencias generales:
- Todos los textos visibles en la web deben estar en español


Preferencias de diseño:
- Básate en las imágenes del diseño que tienes en la carpeta design del proyecto

Preferencias de estilos:
- Colores (los del diseño)
- Uso de medidas en rem, usando un font-size base de 10px
- Uso de HTML5 y CSS3 nativo
- Uso de buenas prácticas de maquetación css y si es necesario usa flexbox y css grid layout
- Que la webapp sea responsive.

Preferencias de código:
- No añadas dependencias externas
- HTML debe ser semántico
- Usa siempre let o const, y no uses nunca var
- No uses alert, confirm o prompt, todo el feedback debe ser visual en el dom
- Toda alerta o ventana que aparezca debe tener el mismo estilo que la web
- No uses innerHTML, todo el contenido debe ser insertado con appendChild o previamente creando un document.createElement
- Cuidado con olvidar prevenir el default en los eventos submit o click
- Prioriza el código legible y mantenible
- Prioriza que el código sea sencillo de entender
- Si el agente duda, que revise las especificaciones del proyecto y si no que pregunte al usuario.

Preferencias  de archivos:
- carpeta (design)
- CLAUDE.md
- estructura de ficheros más adecuada para proyectos de react (lo elige el agente de ia)
