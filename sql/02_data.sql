INSERT INTO users (username, mail, password, admin) VALUES
('defaultAdmin', 'defaultAdmin@gmail.com', 'passwdAdmin', true),
('usuario1', 'usuario1@example.com', 'contraseña123', false),
('usuario2', 'usuario2@example.com', 'contraseña456', false),
('usuario3', 'usuario3@example.com', 'contraseña789', false);


INSERT INTO autores (nombre) VALUES
('Lope de Vega'),
('Julio Verne'),
('Miguel de Unamuno'),
('Pierre Reverdy'),
('Oscar Wilde');

INSERT INTO generos (nombre) VALUES
('Romance'),
('Aventuras'),
('Fantasía'),
('Ciencia ficción'),
('Terror'),
('Comedia'),
('Suspense');

INSERT INTO audiolibros (titulo, autor, descripcion, img) VALUES
('Audiolibro 1', 1, 'Descripción del audiolibro 1', 'imagen1.jpg'),
('Audiolibro 2', 2, 'Descripción del audiolibro 1', 'imagen1.jpg'),
('Audiolibro 3', 1, 'Descripción del audiolibro 1', 'imagen1.jpg'),
('Audiolibro 4', 1, 'Descripción del audiolibro 1', 'imagen1.jpg'),
('Audiolibro 5', 2, 'Descripción del audiolibro 2', 'imagen2.jpg');

INSERT INTO genero_audiolibro (audiolibro, genero) VALUES
(1, 1),
(1, 2),
(2, 2);

INSERT INTO capitulos (numero, nombre, audiolibro, audio) VALUES
(1, 'Capítulo 1', 1, 'audio1.mp3'),
(2, 'Capítulo 2', 1, 'audio2.mp3'),
(1, 'Capítulo 1', 2, 'audio3.mp3');

INSERT INTO marcapaginas (titulo, capitulo, usuario, tipo, fecha) VALUES
('Marcador Capítulo 1', 1, 1, '1', '12:00:00'),
('Marcador Capítulo 2', 2, 1, '0', '12:00:00'),
('Marcador Capítulo 3', 1, 2, '0', '13:30:00'),
('Marcador Capítulo 4', 2, 2, '1', '12:00:00'),
('Marcador Capítulo 5', 2, 3, '0', '12:00:00'),
('Marcador Capítulo 6', 1, 5, '0', '13:30:00');

/*
INSERT INTO amigos (user1, user2) VALUES
(1, 2),
(2, 3),
(4, 1);

INSERT INTO peticiones (sender, receiver, estado, fecha) VALUES
(1, 2, '2', CURRENT_TIMESTAMP),
(2, 3, '2', CURRENT_TIMESTAMP),
(4, 1, '2', CURRENT_TIMESTAMP),
(1, 3, '1', CURRENT_TIMESTAMP);

INSERT INTO reviews (usuario, audiolibro, comentario, puntuacion, visibilidad, fecha) VALUES
(1, 1, 'Buena historia, me encantó', 5, '1', CURRENT_TIMESTAMP),
(2, 2, 'Interesante pero podría mejorar', 3, '1', CURRENT_TIMESTAMP);


INSERT INTO club_lectura (nombre, audiolibro, descripcion) VALUES
('Club de Lectura 1', 1, 'Club para discutir el audiolibro 1'),
('Club de Lectura 2', 2, 'Club para discutir varios audiolibros');



INSERT INTO miembros_club (club, usuario) VALUES
(1, 1),
(1, 2),
(1, 4),
(2, 3),
(2, 1);

INSERT INTO mensajes (club, usuario, mensaje, fecha) VALUES
( 1, 1, 'usuario 1 manda mensaje a club 1', CURRENT_TIMESTAMP),
( 1, 4, 'usuario 4 manda mensaje a club 1', CURRENT_TIMESTAMP),
( 2, 1, 'usuario 1 manda mensaje a club 2', CURRENT_TIMESTAMP),
( 2, 3, 'usuario 3 manda mensaje a club 2', CURRENT_TIMESTAMP);

INSERT INTO colecciones (titulo, propietario) VALUES
('coleccion1', 1),
('coleccion2', 1),
('coleccion1', 4);

INSERT INTO colecciones_usuarios (coleccion, usuario) VALUES
(1, 1),
(1, 2),
(1, 4),
(2, 3),
(3, 1);

INSERT INTO colecciones_audiolibros (coleccion, audiolibro) VALUES
(1, 1),
(1, 2),
(1, 4),
(2, 3),
(2, 5);
*/
