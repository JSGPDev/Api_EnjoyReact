-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-05-2024 a las 04:13:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `enjoy`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especiemascota`
--

CREATE TABLE `especiemascota` (
  `idEspecie` int(11) NOT NULL,
  `especieMascota` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especiemascota`
--

INSERT INTO `especiemascota` (`idEspecie`, `especieMascota`) VALUES
(1, 'Perro'),
(2, 'Gato');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `idMascota` int(11) NOT NULL,
  `idEspecie` int(11) NOT NULL,
  `srcImagenMascota` varchar(250) DEFAULT NULL,
  `nombreMascota` varchar(50) DEFAULT NULL,
  `edadMascota` int(11) DEFAULT NULL,
  `sexoMascota` enum('Hembra','Macho') DEFAULT NULL,
  `descripcionMascota` varchar(250) DEFAULT NULL,
  `motivoMascota` varchar(250) DEFAULT NULL,
  `idUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`idMascota`, `idEspecie`, `srcImagenMascota`, `nombreMascota`, `edadMascota`, `sexoMascota`, `descripcionMascota`, `motivoMascota`, `idUsuario`) VALUES
(1, 1, 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'Rex', 2, 'Macho', 'Rex es un perro enérgico y juguetón que ama correr y jugar al aire libre. Es muy leal y protector con su familia.', 'Rex está en adopción porque su anterior dueño se mudó a un apartamento donde no permiten mascotas.', 1),
(2, 1, 'https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'Luna', 3, 'Hembra', 'Luna es una perra cariñosa y tranquila. Le encanta acurrucarse y recibir caricias. Es muy obediente y aprende rápido.', 'Luna está en adopción porque su dueño actual tiene problemas de salud y no puede cuidarla adecuadamente.', 1),
(3, 2, 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'Milo', 1, 'Macho', 'Milo es un gato curioso y juguetón. Le gusta explorar y jugar con juguetes. Es independiente pero también disfruta de la compañía.', 'Milo está en adopción porque fue rescatado de la calle y está buscando un hogar amoroso.', 1),
(4, 2, 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'Nala', 2, 'Hembra', 'Nala es una gata dulce y cariñosa. Le encanta dormir en lugares soleados y ser acariciada. Es muy sociable y se lleva bien con otros animales.', 'Nala está en adopción porque su anterior dueño se mudó al extranjero y no pudo llevarla consigo.', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `idProducto` int(11) NOT NULL,
  `nombreProducto` varchar(100) NOT NULL,
  `SrcImagenProducto` varchar(250) NOT NULL,
  `tamanoProducto` enum('Pequeño','Mediano','Grande') DEFAULT NULL,
  `precioProducto` float NOT NULL,
  `idTipo` int(11) NOT NULL,
  `idEspecie` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoproducto`
--

CREATE TABLE `tipoproducto` (
  `idTipo` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipoproducto`
--

INSERT INTO `tipoproducto` (`idTipo`, `tipo`) VALUES
(1, 'comida'),
(2, 'juguetes'),
(3, 'accesorios'),
(4, 'aseo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `correoUsuario` varchar(100) NOT NULL,
  `contraseniaUsuario` varchar(100) NOT NULL,
  `nombreUsuario` varchar(100) NOT NULL,
  `telefonoUsuario` varchar(10) DEFAULT NULL,
  `direccionUsuario` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `correoUsuario`, `contraseniaUsuario`, `nombreUsuario`, `telefonoUsuario`, `direccionUsuario`) VALUES
(1, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `especiemascota`
--
ALTER TABLE `especiemascota`
  ADD PRIMARY KEY (`idEspecie`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`idMascota`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idEspecie` (`idEspecie`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idProducto`),
  ADD KEY `idTipo` (`idTipo`),
  ADD KEY `idEspecie` (`idEspecie`);

--
-- Indices de la tabla `tipoproducto`
--
ALTER TABLE `tipoproducto`
  ADD PRIMARY KEY (`idTipo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `correoUsuario` (`correoUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `especiemascota`
--
ALTER TABLE `especiemascota`
  MODIFY `idEspecie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `idMascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `idProducto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipoproducto`
--
ALTER TABLE `tipoproducto`
  MODIFY `idTipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  ADD CONSTRAINT `mascota_ibfk_2` FOREIGN KEY (`idEspecie`) REFERENCES `especiemascota` (`idEspecie`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`idTipo`) REFERENCES `tipoproducto` (`idTipo`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`idEspecie`) REFERENCES `especiemascota` (`idEspecie`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
