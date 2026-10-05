# Portal para Autoridades de Mesa - Prototipo (TP2)

## Descripcion
Prototipo funcional (prueba de concepto) del Portal para Autoridades de Mesa.
Cubre la consulta de charlas de orientacion con mapa interactivo, la inscripcion de un
voluntario como postulante y la consulta de postulaciones persistidas.

## Alcance del prototipo
- Consultar charlas de orientacion (UC-01 / UC-02)
- Ver la sede de cada charla en un mapa interactivo (integracion con servicio de mapas)
- Inscribirse como postulante, con validacion de reglas de negocio (UC-03)
- Consultar las postulaciones registradas (persistencia en el navegador)

Queda fuera de esta prueba de concepto (pertenece al modelo de dominio del TP1, no al PoC):
gestion de convocatorias, rol administrador, aprobacion/rechazo de postulantes.

## Tecnologias
- HTML5, CSS3, JavaScript (ES6+, vanilla, sin frameworks)
- LeafletJS 1.9.4 + OpenStreetMap (servicio de mapas)
- localStorage (persistencia en el navegador)

## Como ejecutar

Hay que servir la carpeta del prototipo con un servidor local, porque se cargan JSON con `fetch()`.
Abrir el HTML con doble clic no funciona por CORS.

### Opcion 1: Python (recomendado)
Desde esta carpeta:

```bash
python -m http.server 8080
```

Abrir: http://localhost:8080

### Opcion 2: Node.js
```bash
npx serve .
```

### Opcion 3: Live Server en VS Code / Cursor
Abrir `index.html` con la extension Live Server.

## Estructura del proyecto
```
prototipo/
  index.html          -> Pagina principal (presentacion)
  css/styles.css      -> Estilos
  js/dataService.js   -> Capa de acceso a datos (localStorage)
  js/validacion.js    -> Logica de validacion (reglas de negocio)
  js/mapaService.js   -> Integracion con LeafletJS (servicio de mapas)
  js/ui.js            -> Capa de presentacion (DOM, navegacion, eventos)
  data/charlas.json   -> Datos de ejemplo de charlas
  data/distritos.json -> Datos de ejemplo de distritos electorales
  README.md           -> Este archivo
```

## Dependencias externas
- LeafletJS se carga via CDN (https://unpkg.com/leaflet@1.9.4)
- Teselas del mapa: OpenStreetMap
- No requiere credenciales ni API keys
- No requiere `npm install` ni `pip install`

## Por que Leaflet y no Google Maps
Se puede usar Google Maps, pero para este TP no conviene:

- La API de JavaScript de Google Maps pide proyecto en Google Cloud, API key y cuenta de facturacion.
- Sin key el mapa no carga; si se sube la key al codigo, queda expuesta.
- Leaflet + OpenStreetMap cubre el mismo caso de uso (marcadores, popup, centrar en una sede) sin costo ni registro.

Si la consigna exigiera Google Maps de forma explicita, habria que cambiar solo `js/mapaService.js` y agregar una API key.

## Justificacion de persistencia
Se utiliza localStorage por ser una prueba de concepto que no requiere un servidor backend.
Permite persistir los datos entre sesiones del navegador sin instalar ni configurar una base de datos.
Las postulaciones se pueden ver en la pestana "Postulaciones".
Para vaciar datos de prueba: DevTools del navegador > Application > Local Storage.

## Alcance y decision de la prueba de concepto

Este prototipo implementa solamente lo pedido en el TP2: consulta de charlas y sedes, mapa interactivo e inscripcion de voluntarios. No incluye una pantalla de administrador para aprobar o rechazar postulaciones, porque esos casos de uso pertenecen al proceso posterior al cierre de la convocatoria y no forman parte de la funcionalidad solicitada para esta prueba de concepto.
