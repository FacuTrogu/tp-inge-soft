# Portal para Autoridades de Mesa - Prototipo (TP2)

## Tecnologías Utilizadas
- HTML5, CSS3, JavaScript (ES6+, vanilla, sin frameworks).
- LeafletJS 1.9.4 + OpenStreetMap (cargado vía CDN).

## Requisitos Previos (Entorno)
El proyecto no utiliza dependencias locales a instalar, por lo que carece de manifiestos (`package.json` o `requirements.txt`). 
Para evitar bloqueos de seguridad del navegador (CORS) al leer los archivos de datos JSON locales, es obligatorio contar con un entorno base capaz de levantar un servidor web, como **Python 3.x** o **Node.js**.

## Cómo Ejecutar el Prototipo
Abrir una terminal posicionada en la raíz de esta carpeta y utilizar una de las siguientes opciones:

### Opción 1: Python (Recomendado)
Ejecutar el módulo de servidor integrado:

python -m http.server 8080

Luego, abrir el navegador e ingresar a: http://localhost:8080

### Opción 2: Node.js
Ejecutar mediante npx:

npx serve .

Luego, ingresar en el navegador al enlace local que devuelva la terminal (generalmente http://localhost:3000).

### Opción 3: Live Server (VS Code)
Si se utiliza Visual Studio Code o Cursor, hacer clic derecho sobre el archivo `index.html` y seleccionar **Open with Live Server**.

### ACLARACIÓN
Hicimos algunos cambios en el código para evitar que se vean el dni y email en el apartado "Postulaciones" y para no permitir que el nombre y apellido ingresado en la postulación contenga números. Quizás, los cambios no se reflejen correctamente si quedo cache en la local storage del navegador. Se puede borrar apretando f12 en la pagina del portal, yendo al apartado "Application", luego desplegamos "Local storage" y apretamos click derecho en la url del portal y seleccionamos "Clear". Finalmente, recargamos la pagina con f5 o ctrl + f5. De todas formas, son cambios menores.