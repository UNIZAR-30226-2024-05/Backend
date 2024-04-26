# Servidor en la nube

Solicitudes a narratives-backend.azurewebsites.net

## Conexión ssh

1. ssh carol@20.199.84.234:
    Con usuario y contraseña
    
2. ssh -i <ruta_a_clave_privada> carol@20.199.84.234

## Encender servidor si está caído

1. Reiniciar:
   ```bash
   sudo systemctl restart startServer.service

2. Comprobar funcionamiento:
    ```bash
   sudo systemctl status startServer.service

# Servidor en local

Este repositorio contiene lo necesario para configurar en local un contenedor Docker de PostgreSQL, listo para ser ejecutado con algunos datos de muestra.

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

### Necesario fichero .env con variables de entorno (en Discord)

- docker-compose.yml: Archivo de configuración de Docker Compose.
- sql: Archivos SQL con la estructura de la base datos (tablas) y datos de población.
- src: Archivos del servidor node js.
