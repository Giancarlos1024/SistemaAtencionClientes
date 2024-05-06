const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('DeviceCheckupDB.sqlite');

// Crear tablas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            contrasena TEXT NOT NULL,
            tipo TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Dispositivos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio NUMERIC NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            correo TEXT,
            dni TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS EstadosReparacion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Reparaciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo_ticket TEXT NOT NULL,
            dispositivo_id INTEGER,
            usuario_id INTEGER,
            fecha_inicio DATETIME NOT NULL,
            fecha_estimada_finalizacion DATETIME,
            estado_id INTEGER,
            FOREIGN KEY (dispositivo_id) REFERENCES Dispositivos(id),
            FOREIGN KEY (usuario_id) REFERENCES Clientes(id),
            FOREIGN KEY (estado_id) REFERENCES EstadosReparacion(id)
        )
    `);

    // Insertar datos
    db.run(`
        INSERT INTO Dispositivos (nombre, descripcion, precio)
        VALUES
        ('Smartphone', 'Teléfono inteligente con pantalla táctil', 599.99),
        ('Tablet', 'Tableta con sistema operativo Android', 399.99),
        ('Laptop', 'Portátil ligero y potente', 999.99)
    `);

    db.run(`
        INSERT INTO Clientes (nombre, apellido, correo, dni)
        VALUES
        ('Juan', 'Perez', 'juan@example.com', '12345678'),
        ('María', 'Gomez', 'maria@example.com', '87654321'),
        ('Carlos', 'Lopez', 'carlos@example.com', '54321678')
    `);

    db.run(`
        INSERT INTO EstadosReparacion (nombre)
        VALUES
        ('En progreso'),
        ('Completada'),
        ('Pendiente')
    `);

    db.run(`
        INSERT INTO Reparaciones (codigo_ticket, dispositivo_id, usuario_id, fecha_inicio, fecha_estimada_finalizacion, estado_id)
        VALUES
        ('TICKET-001', 1, 1, '2022-03-28 10:00:00', '2022-03-30 12:00:00', 1),
        ('TICKET-002', 2, 2, '2022-03-29 09:00:00', '2022-03-31 10:00:00', 3),
        ('TICKET-003', 3, 3, '2022-03-30 08:00:00', '2022-04-01 11:00:00', 2)
    `);

    db.run(`
        INSERT INTO Users (usuario, contrasena, tipo)
        VALUES
        ('giancarlos','giancarlos123','Gerente')
    `);
});

// Cerrar la conexión a la base de datos al finalizar las operaciones
db.close();
