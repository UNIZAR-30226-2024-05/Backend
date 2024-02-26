# Contenedor Docker PostgreSQL

Este repositorio contiene un contenedor Docker configurado con PostgreSQL, listo para ser ejecutado con datos de muestra.

## Requisitos previos

- Docker instalado en tu sistema. Puedes encontrar instrucciones de instalación en [la documentación oficial de Docker](https://docs.docker.com/get-docker/).

## Instrucciones de uso

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/UNIZAR-30226-2024-05/Backend.git

2. Ejecutar el Contenedor:
    Navega al directorio del proyecto y ejecuta el contenedor utilizando Docker Compose:
    ```bash
    cd repositorio_backend
    docker-compose up -d

3. Acceder a la Base de Datos:
    Una vez que el contenedor esté en ejecución, puedes acceder a la base de datos utilizando psql:
    ```bash
    docker exec -it pg_container psql -U carol narratives_db

4. Ejecutar servidor:
    Para poder probar el backend y mandar solicitudes GET, POST, etc:
    ```bash
    npm run start
    
    // para ejecutar modo development y que los cambios en el código se carguen automáticamente 
    // sin necesidad de volver a lanzar el servidor:
    // npm run dev

## Contenido del Repositorio

- docker-compose.yml: Archivo de configuración de Docker Compose.
- .env: Archivo de configuración de las variables de entorno necesarias para ejecutar tanto del contenedor de la base de datos como del contenedor de pgadmin 4.
- sql: Archivos SQL con la estructura de la base datos (tablas) y datos de población.
- src: Archivos del servidor node js.
    - controllers: Almacena la lógica de controlador para cada ruta.
    - middlewares: Almacena funciones de middleware personalizadas que se utilizan en las rutas para realizar tareas como la autenticación, la validación de datos de entrada, el registro de solicitudes, etc.
    - models: Almacena los métodos para interactuar con la base de datos.
    - routes: Almacena todos los archivos de enrutamiento.
