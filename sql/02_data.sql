INSERT INTO autores (nombre) VALUES
('J. K. Rowling');

INSERT INTO generos (nombre) VALUES
('Romance'),
('Aventuras'),
('Fantasía'),
('Ciencia ficción'),
('Terror'),
('Comedia'),
('Suspense');

INSERT INTO audiolibros (titulo, autor, descripcion, img) VALUES
('Harry Potter y la piedra filosofal', 1, '«Con las manos temblorosas, Harry le dio la vuelta al sobre y vio un sello de lacre púrpura con un escudo de armas: un león, un águila, un tejón y una serpiente, que rodeaban una gran letra H.»
Harry Potter nunca ha oído hablar de Hogwarts hasta que empiezan a caer cartas en el felpudo del número 4 de Privet Drive. Llevan la dirección escrita con tinta verde en un sobre de pergamino amarillento con un sello de lacre púrpura, y sus horripilantes tíos se apresuran a confiscarlas. Más tarde, el día que Harry cumple once años, Rubeus Hagrid, un hombre gigantesco cuyos ojos brillan como escarabajos negros, irrumpe con una noticia extraordinaria: Harry Potter es un mago, y le han concedido una plaza en el Colegio Hogwarts de Magia y Hechicería. ¡Está a punto de comenzar una aventura increíble!', 
'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1.jpeg');

INSERT INTO genero_audiolibro (audiolibro, genero) VALUES
(1, 3);

INSERT INTO capitulos (numero, nombre, audiolibro, audio) VALUES
(1, 'El niño que sobrevivió', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_1.mp3'),
(2, 'El vidrio que se desvaneció', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_2.mp3'),
(3, 'Las cartas de nadie', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_3.mp3'),
(4, 'El guardián de las llaves', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_4.mp3'),
(5, 'El callejón Diagon', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_5.mp3'),
(6, 'El viaje a través del andén nueve y tres cuartos', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_6.mp3'),
(7, 'El Sombrero Seleccionador', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_7.mp3'),
(8, 'El profesor de Pociones', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_8.mp3'),
(9, 'El duelo a medianoche', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_9.mp3'),
(10, 'Halloween', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_10.mp3'),
(11, 'Quidditch', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_11.mp3'),
(12, 'El espejo de Oesed', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_12.mp3'),
(13, 'Nicolás Flamel', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_13.mp3'),
(14, 'Norberto, el ridgeback noruego', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_14.mp3'),
(15, 'El bosque prohibido', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_15.mp3'),
(16, 'A través de la trampilla', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_16.mp3'),
(17, 'El hombre con dos caras', 1, 'https://narrativesdb.blob.core.windows.net/archivos-narratives/HarryPotter1_17.mp3');
