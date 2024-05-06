-- Crear la base de datos
CREATE DATABASE DeviceCheckupDB;

DROP DATABASE DeviceCheckupDB;
-- Usar la base de datos
USE DeviceCheckupDB;

-- Crear la tabla para los usuarios
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY,
    usuario NVARCHAR(255) NOT NULL,
	nombre NVARCHAR(255) NOT NULL,
    apellido NVARCHAR(255) NOT NULL,
    contrasena NVARCHAR(255) NOT NULL,
    tipo NVARCHAR(50) NOT NULL
);



-- Crear la tabla para los dispositivos
CREATE TABLE Dispositivos (
    id INT PRIMARY KEY IDENTITY,
    nombre NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(MAX),
    precio DECIMAL(10, 2) NOT NULL
);

-- Crear la tabla para los usuarios
CREATE TABLE Clientes (
    id INT PRIMARY KEY IDENTITY,
    nombre NVARCHAR(255) NOT NULL,
    apellido NVARCHAR(255) NOT NULL,
    correo NVARCHAR(255),
    dni NVARCHAR(20) -- Cambio de 'edad' a 'dni'
);

-- Crear la tabla para los estados de reparación
CREATE TABLE EstadosReparacion (
    id INT PRIMARY KEY IDENTITY,
    nombre NVARCHAR(50) NOT NULL
);

-- Crear la tabla para las reparaciones
CREATE TABLE Reparaciones (
    id INT PRIMARY KEY IDENTITY,
    codigo_ticket NVARCHAR(50) NOT NULL, -- Columna para el código del ticket
    dispositivo_id INT FOREIGN KEY REFERENCES Dispositivos(id),
    usuario_id INT FOREIGN KEY REFERENCES Clientes(id),
    fecha_inicio DATETIME NOT NULL,
    fecha_estimada_finalizacion DATETIME,
    estado_id INT FOREIGN KEY REFERENCES EstadosReparacion(id)
);

-- Crear la tabla para el registro de actividad
CREATE TABLE ActivityLog (
    id INT PRIMARY KEY IDENTITY,
    action NVARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL,
    usuario INT FOREIGN KEY REFERENCES Users(id)
);


-- Insertar datos en la tabla Dispositivos
INSERT INTO Dispositivos (nombre, descripcion, precio)
VALUES
('Smartphone', 'Teléfono inteligente con pantalla táctil', 599.99),
('Tablet', 'Tableta con sistema operativo Android', 399.99),
('Laptop', 'Portátil ligero y potente', 999.99);

-- Insertar datos en la tabla Clientes
INSERT INTO Clientes (nombre, apellido, correo, dni) -- Modificar la inserción para incluir 'dni' en lugar de 'edad'
VALUES
('Juan', 'Perez', 'juan@example.com', '12345678'), -- Ejemplo de DNI
('María', 'Gomez', 'maria@example.com', '87654321'), -- Ejemplo de DNI
('Carlos', 'Lopez', 'carlos@example.com', '54321678'); -- Ejemplo de DNI

-- Insertar datos en la tabla EstadosReparacion
INSERT INTO EstadosReparacion (nombre)
VALUES
('En progreso'),
('Completada'),
('Pendiente');

-- Insertar datos en la tabla Reparaciones
INSERT INTO Reparaciones (codigo_ticket, dispositivo_id, usuario_id, fecha_inicio, fecha_estimada_finalizacion, estado_id)
VALUES
('TICKET-001', 1, 1, '2022-03-28 10:00:00', '2022-03-30 12:00:00', 1),
('TICKET-002', 2, 2, '2022-03-29 09:00:00', '2022-03-31 10:00:00', 3),
('TICKET-003', 3, 3, '2022-03-30 08:00:00', '2022-04-01 11:00:00', 2);

INSERT INTO Users (usuario, nombre, apellido, contrasena, tipo)
VALUES
('Gian10','giancarlos Renzo','Velasquez','giancarlos123','Admin');

INSERT INTO ActivityLog(action, timestamp, usuario)
VALUES
('Crear Datos','2022-03-28 10:00:00',1);
-- Seleccionar datos de las tablas para verificar que se hayan insertado correctamente
SELECT * FROM Dispositivos;
SELECT * FROM Clientes;
SELECT * FROM EstadosReparacion;
SELECT * FROM Reparaciones;
SELECT * FROM Users;
SELECT * FROM ActivityLog;


