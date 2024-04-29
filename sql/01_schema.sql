CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    mail VARCHAR(50) NOT NULL UNIQUE,
    img CHAR(1) NOT NULL CHECK (img >= '0' AND img <= '9'),
    password VARCHAR(64) NOT NULL,
    admin BOOLEAN NOT NULL
);

CREATE TABLE amigos (
    user1 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user2 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (user1, user2)
);

/* 0 - petición en espera
   1 - petición confirmada
   2 - petición rechazada */
CREATE TABLE peticiones (
    sender INTEGER REFERENCES users(id) ON DELETE CASCADE,
    receiver INTEGER REFERENCES users(id) ON DELETE CASCADE,
    estado CHAR(1) NOT NULL CHECK (estado IN ('0', '1', '2')),
    fecha TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (sender, receiver, estado, fecha)
);

CREATE TABLE autores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    ciudadNacimiento VARCHAR(100),
    informacion TEXT
);

CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE audiolibros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    autor INTEGER REFERENCES autores(id) ON DELETE CASCADE,
    descripcion TEXT,
    img TEXT,
    UNIQUE(titulo, autor)
);

CREATE TABLE genero_audiolibro (
    audiolibro INTEGER REFERENCES audiolibros(id) ON DELETE CASCADE,
    genero INTEGER REFERENCES generos(id) ON DELETE CASCADE
);
    
CREATE TABLE capitulos (
    id SERIAL PRIMARY KEY,
    numero SMALLINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    audiolibro INTEGER REFERENCES audiolibros(id) ON DELETE CASCADE,
    audio TEXT NOT NULL UNIQUE,
    UNIQUE(audiolibro, numero, nombre)
);

/* 0 - pública
   1 - amigos
   2 - privada */
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    usuario INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    audiolibro INTEGER NOT NULL REFERENCES audiolibros(id) ON DELETE CASCADE,
    comentario VARCHAR(500),
    puntuacion SMALLINT NOT NULL CHECK (puntuacion >= 0 AND puntuacion <= 5),
    visibilidad CHAR(1) NOT NULL CHECK (visibilidad IN ('0', '1', '2')),
    fecha TIMESTAMPTZ NOT NULL,
    UNIQUE(usuario, audiolibro)
);

CREATE TABLE club_lectura (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    audiolibro INTEGER REFERENCES audiolibros(id) ON DELETE SET NULL,
    descripcion VARCHAR(200)
);

/* 0 - momento donde se dejó último libro leído
   1 - momento de un libro que no es el último leído
   2 - momentos personalizados que guarda el usuario */
CREATE TABLE marcapaginas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(50) NOT NULL,
    capitulo INTEGER REFERENCES capitulos(id) ON DELETE CASCADE,
    usuario INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tipo CHAR(1) NOT NULL CHECK (tipo IN ('0', '1', '2')),
    fecha TIME NOT NULL
);

CREATE TABLE miembros_club (
    club INTEGER NOT NULL REFERENCES club_lectura(id) ON DELETE CASCADE,
    usuario INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(club, usuario)
);

CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    club INTEGER NOT NULL REFERENCES club_lectura(id) ON DELETE CASCADE,
    usuario INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMPTZ NOT NULL
);

CREATE TABLE colecciones (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(30) NOT NULL,
    propietario INTEGER REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (titulo, propietario )
);

CREATE TABLE colecciones_usuarios (
    coleccion INTEGER REFERENCES colecciones(id) ON DELETE CASCADE,
    usuario INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(coleccion, usuario)
);

CREATE TABLE colecciones_audiolibros (
    coleccion INTEGER REFERENCES colecciones(id) ON DELETE CASCADE,
    audiolibro INTEGER REFERENCES audiolibros(id) ON DELETE CASCADE,
    PRIMARY KEY (coleccion, audiolibro)
);
