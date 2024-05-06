
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
const app = express();
const pdf = require('html-pdf');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud en formato JSON




// Configuración de la conexión a la base de datos
const config = {
  user: 'SA',
  password: 'ALUMNO',
  server: 'localhost',
  database: 'DeviceCheckupDB',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  }
};

// Endpoint para obtener detalles del dispositivo por código de ticket
app.get('/dispositivos/:ticketCode', async (req, res) => {
  const { ticketCode } = req.params;
  try {
    console.log('Conectando a la base de datos...');
    await sql.connect(config);
    console.log('Conexión exitosa');
    const result = await sql.query(`
      SELECT d.*, r.fecha_inicio, r.fecha_estimada_finalizacion, e.nombre AS estado, u.nombre AS usuario, u.apellido, u.correo, u.dni
      FROM Dispositivos d
      INNER JOIN Reparaciones r ON d.id = r.dispositivo_id
      INNER JOIN Clientes u ON r.usuario_id = u.id
      INNER JOIN EstadosReparacion e ON r.estado_id = e.id
      WHERE r.codigo_ticket = '${ticketCode}'
    `);
    console.log('Consulta realizada con éxito');
    res.json(result.recordset[0]); // Suponiendo que solo hay un dispositivo por ticket
  } catch (error) {
    console.error('Error al obtener detalles del dispositivo:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});
// Endpoint para generar un PDF con los detalles del dispositivo y enviarlo al cliente


// Endpoint para obtener todos los dispositivos
app.get('/dispositivos', async (req, res) => {
  try {
    console.log('Conectando a la base de datos...');
    await sql.connect(config);
    console.log('Conexión exitosa');
    const result = await sql.query('SELECT * FROM Dispositivos');
    console.log('Consulta realizada con éxito');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener dispositivos:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});

// Endpoint para agregar un nuevo dispositivo
app.post('/dispositivos', async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  try {
    console.log('Conectando a la base de datos...');
    await sql.connect(config);
    console.log('Conexión exitosa');
    const result = await sql.query(`
      INSERT INTO Dispositivos (nombre, descripcion, precio)
      VALUES ('${nombre}', '${descripcion}', ${precio})
    `);
    console.log('Dispositivo creado exitosamente');
    res.status(201).send('Dispositivo creado exitosamente');
  } catch (error) {
    console.error('Error al crear dispositivo:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});


// Endpoint para actualizar un dispositivo existente
app.put('/dispositivos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  try {
    await sql.connect(config);
    const result = await sql.query(`
      UPDATE Dispositivos
      SET nombre = '${nombre}', descripcion = '${descripcion}', precio = ${precio}
      WHERE id = ${id}
    `);
    res.status(200).send('Dispositivo actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar dispositivo:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});

// Endpoint para eliminar un dispositivo
// Endpoint para eliminar un dispositivo
app.delete('/dispositivos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query(`DELETE FROM Dispositivos WHERE id = ${id}`);
    res.status(200).send('Dispositivo eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar dispositivo:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});


// Endpoint para obtener todas las reparaciones
app.get('/reparaciones', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Reparaciones');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener reparaciones:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});

// Endpoint para obtener todos los cliente
app.get('/usuarios', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Clientes');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});

// Endpoint para obtener un cliente por su ID
app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query(`SELECT * FROM Clientes WHERE id = ${id}`);
    if (result.recordset.length === 0) {
      res.status(404).send('Usuario no encontrado');
    } else {
      res.json(result.recordset[0]);
    }
  } catch (error) {
    console.error('Error al obtener usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});

// Endpoint para crear un nuevo cliente
app.post('/usuarios', async (req, res) => {
  const { nombre, apellido, correo, dni } = req.body;
  try {
    await sql.connect(config);
    const result = await sql.query(`
      INSERT INTO Clientes (nombre, apellido, correo, dni)
      VALUES ('${nombre}', '${apellido}', '${correo}', ${dni})
    `);
    res.status(201).send('Usuario creado exitosamente');
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});

// Endpoint para actualizar un cliente existente
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, dni } = req.body;
  try {
    await sql.connect(config);
    const result = await sql.query(`
      UPDATE Clientes
      SET nombre = '${nombre}', apellido = '${apellido}', correo = '${correo}', dni = ${dni}
      WHERE id = ${id}
    `);
    res.status(200).send('Usuario actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});

// Endpoint para eliminar un cliente
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query(`DELETE FROM Clientes WHERE id = ${id}`);
    res.status(200).send('Usuario eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});


// Endpoint para obtener todos los datos
app.get('/datos', async (req, res) => {
  let transaction;

  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Iniciar una transacción
    transaction = new sql.Transaction();
    await transaction.begin();

    // Consultar todos los datos
    const result = await transaction.request().query(`
      SELECT
        u.nombre AS nombreUsuario,
        u.apellido AS apellidoUsuario,
        u.correo AS correoUsuario,
        u.dni AS dniUsuario,
        d.nombre AS nombreDispositivo,
        d.descripcion AS descripcionDispositivo,
        d.precio AS precioDispositivo,
        e.nombre AS nombreEstado,
        r.codigo_ticket AS codigoTicket,
        r.fecha_inicio AS fechaInicio,
        r.fecha_estimada_finalizacion AS fechaEstimadaFinalizacion
      FROM
        Reparaciones r
      INNER JOIN
        Dispositivos d ON r.dispositivo_id = d.id
      INNER JOIN
        Clientes u ON r.usuario_id = u.id
      INNER JOIN
        EstadosReparacion e ON r.estado_id = e.id;
    `);

    // Confirmar la transacción
    await transaction.commit();

    // Enviar los datos al cliente
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener datos:', error.message);

    // Si ocurre algún error, revertir la transacción si está definida
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).send('Error interno del servidor');
  }
});


// Endpoint para crear datos
app.post('/crear', async (req, res) => {
  // Obtener los datos del cuerpo de la solicitud
  const {
    nombreUsuario,
    apellidoUsuario,
    correoUsuario,
    dniUsuario,
    nombreDispositivo,
    descripcionDispositivo,
    precioDispositivo,
    nombreEstado,
    codigoTicket,
    fechaInicio,
    fechaEstimadaFinalizacion
  } = req.body;

  let transaction; // Definir la variable transaction aquí

  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Verificar si el DNI ya está registrado
    const dniCheckResult = await sql.query`
      SELECT COUNT(*) AS count FROM Clientes WHERE dni = ${dniUsuario};
    `;

    if (dniCheckResult.recordset[0].count > 0) {
      // Si el DNI ya existe, enviar un mensaje de error
      return res.status(400).send('El DNI ya está registrado');
    }

    // Iniciar una transacción
    transaction = new sql.Transaction();
    await transaction.begin();

    // Insertar el usuario
    const usuarioResult = await transaction.request().query(`
      INSERT INTO Clientes (nombre, apellido, correo, dni)
      VALUES ('${nombreUsuario}', '${apellidoUsuario}', '${correoUsuario}', '${dniUsuario}');
      SELECT SCOPE_IDENTITY() AS usuarioId; -- Obtener el ID del usuario recién creado
    `);

    const usuarioId = usuarioResult.recordset[0].usuarioId;

    // Insertar el dispositivo
    const dispositivoResult = await transaction.request().query(`
      INSERT INTO Dispositivos (nombre, descripcion, precio)
      VALUES ('${nombreDispositivo}', '${descripcionDispositivo}', ${precioDispositivo});
      SELECT SCOPE_IDENTITY() AS dispositivoId; -- Obtener el ID del dispositivo recién creado
    `);

    const dispositivoId = dispositivoResult.recordset[0].dispositivoId;

    // Insertar el estado de reparación
    const estadoResult = await transaction.request().query(`
      SELECT id FROM EstadosReparacion WHERE nombre = '${nombreEstado}';
    `);
    const estadoId = estadoResult.recordset[0].id;

    // Insertar la reparación
    await transaction.request().query(`
      INSERT INTO Reparaciones (codigo_ticket, dispositivo_id, usuario_id, fecha_inicio, fecha_estimada_finalizacion, estado_id)
      VALUES (
        '${codigoTicket}', 
        ${dispositivoId}, 
        ${usuarioId}, 
        '${fechaInicio}', 
        '${fechaEstimadaFinalizacion}',
        ${estadoId} -- Usar el ID del estado de reparación obtenido
      );
    `);

    // Confirmar la transacción
    await transaction.commit();

    // Enviar respuesta de éxito al cliente
    res.status(201).send('Datos creados exitosamente');
  } catch (error) {
    console.error('Error al crear datos:', error.message);

    // Si ocurre algún error, revertir la transacción si está definida
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).send('Error interno del servidor');
  } finally {
    // Cerrar la conexión a la base de datos
    sql.close();
  }
});

// Endpoint para actualizar datos
app.put('/datos/:codigoTicket', async (req, res) => {
  const { codigoTicket } = req.params;
  const updatedData = req.body; // Datos actualizados del dispositivo

  try {
    console.log('Datos recibidos del cliente:', updatedData);
    await sql.connect(config);

    // Actualizar los datos en la tabla Clientes
    await sql.query(`
      UPDATE Clientes
      SET 
        nombre = '${updatedData.nombreUsuario}',
        apellido = '${updatedData.apellidoUsuario}',
        correo = '${updatedData.correoUsuario}',
        dni = '${updatedData.dniUsuario}'
      WHERE id = (
        SELECT usuario_id
        FROM Reparaciones
        WHERE codigo_ticket = '${codigoTicket}'
      );
    `);

    // Actualizar los datos en la tabla Dispositivos
    await sql.query(`
      UPDATE Dispositivos
      SET 
        nombre = '${updatedData.nombreDispositivo}',
        descripcion = '${updatedData.descripcionDispositivo}',
        precio = ${updatedData.precioDispositivo}
      WHERE id = (
        SELECT dispositivo_id
        FROM Reparaciones
        WHERE codigo_ticket = '${codigoTicket}'
      );
    `);

    // Actualizar los datos en la tabla Reparaciones
    await sql.query(`
      UPDATE Reparaciones
      SET 
        fecha_inicio = '${updatedData.fechaInicio}',
        fecha_estimada_finalizacion = '${updatedData.fechaEstimadaFinalizacion}',
        estado_id = (
          SELECT id
          FROM EstadosReparacion
          WHERE nombre = '${updatedData.nombreEstado}'
        )
      WHERE codigo_ticket = '${codigoTicket}';
    `);

    res.status(200).send('Datos actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar datos:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});



// Endpoint para eliminar datos de todas las tablas relacionadas
app.delete('/eliminarDatos/:codigoTicket', async (req, res) => {
  const { codigoTicket } = req.params;
  let transaction;

  try {
    await sql.connect(config);

    // Iniciar una transacción
    transaction = new sql.Transaction();
    await transaction.begin();

    // Obtener IDs de reparaciones, usuarios y dispositivos relacionados
    const idsResult = await transaction.request().query(`
      SELECT usuario_id, dispositivo_id
      FROM Reparaciones
      WHERE codigo_ticket = '${codigoTicket}';
    `);

    const ids = idsResult.recordset[0]; // Suponiendo que solo hay un conjunto de IDs

    const usuarioId = ids.usuario_id;
    const dispositivoId = ids.dispositivo_id;

    // Eliminar datos relacionados en todas las tablas
    await transaction.request().query(`
      DELETE FROM Reparaciones WHERE codigo_ticket = '${codigoTicket}';
      DELETE FROM Dispositivos WHERE id = ${dispositivoId};
      DELETE FROM Clientes WHERE id = ${usuarioId};
      -- Añade otras operaciones de eliminación según sea necesario
    `);

    // Confirmar la transacción
    await transaction.commit();

    // Enviar respuesta de éxito al cliente
    res.status(200).send('Datos eliminados exitosamente');
  } catch (error) {
    console.error('Error al eliminar datos:', error.message);

    // Si ocurre algún error, revertir la transacción si está definida
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).send('Error interno del servidor');
  } finally {
    // Cerrar la conexión a la base de datos
    sql.close();
  }
});

// Endpoint para generar un PDF con los detalles del dispositivo y enviarlo al cliente
app.post('/pdf', async (req, res) => {
  const deviceDetails = req.body; // Obtener los detalles del dispositivo del cuerpo de la solicitud

  // Definir la plantilla HTML del PDF
  const htmlTemplate = `
    <html>
      <head>
        <style>
          /* Estilos CSS para el PDF */
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color:#80DDF2 ;
          }
          h2{
            text-align: center;
          }
          h3{
            margin-top:20px;
            text-align: center;
          }
          .container-img{
            display:flex,
            justify-content:center;
            margin:0 auto;

          }
          .line{
            margin:0 auto;
            margin-top:20px;
            display:flex;
            justify-content:center;
            height:2px;
            width:30%;
            background-color:black;
          }
          img{
            margin: 0 auto;
            margin-left:41%;
            display:flex;
          }
          .sexo{
            margin-top:70%;
          }
        </style>
      </head>
      <body>
      <div style="display: flex; justify-content: center;">
      <div class="container-img">
       <img src="https://i.ibb.co/x1QHhxZ/logo.png" alt="logo" border="0" />
      </div>
    </div>
      <h2>Detalles del Dispositivo</h2>
      <table>
        <tr>
          <th>Nombres y Apellidos</th>
          <td>${deviceDetails.usuario} ${deviceDetails.apellido}</td>
        </tr>
        <tr>
          <th>Fecha de Inicio</th>
          <td>${deviceDetails.fecha_inicio}</td>
        </tr>
        <tr>
            <th>Nombre del dispositivo</th>
            <td>${deviceDetails.nombre}</td>
        </tr>
        <tr>
          <th>Descripción del dispositivo</th>
          <td>${deviceDetails.descripcion}</td>
        </tr>
        <tr>
          <th>Precio</th>
          <td>$ ${deviceDetails.precio}</td>
        </tr>
        <tr>
          <th>Correo electrónico</th>
          <td>${deviceDetails.correo}</td>
        </tr>
        <tr>
          <th>DNI</th>
          <td>${deviceDetails.dni}</td>
        </tr>
        <tr>
          <th>Estado de reparación</th>
          <td>${deviceDetails.estado}</td>
        </tr>
        <tr>
          <th>Fecha de Finalizacion</th>
          <td>${deviceDetails.fecha_estimada_finalizacion}</td>
        </tr>
            <!-- Agrega más filas según sea necesario -->
      </table>
      <div class="sexo">
      <div class="line"></div>
        <h3>ATT. One Movil</h3>
      </div>
      
      </body>
    </html>
  `;

  // Opciones para la generación del PDF
  const options = {
    format: 'A4',
    border: {
      top: '10mm',
      right: '10mm',
      bottom: '10mm',
      left: '10mm'
    }
  };

  try {
    // Generar el PDF utilizando html-pdf
    pdf.create(htmlTemplate, options).toBuffer(function (err, buffer) {
      if (err) {
        console.error('Error al generar el PDF:', err);
        res.status(500).send('Error interno del servidor al generar el PDF');
      } else {
        // Enviar el PDF como respuesta al cliente
        res.contentType('application/pdf');
        res.send(buffer);
      }
    });
  } catch (error) {
    console.error('Error al generar el PDF:', error.message);
    res.status(500).send('Error interno del servidor al generar el PDF');
  }
});

app.get('/users', async (req, res) => {
  try {
    // Conectar a la base de datos
    await sql.connect(config);
    
    // Realizar la consulta para obtener todos los usuarios
    const result = await sql.query('SELECT * FROM Users');

    // Enviar los datos de los usuarios al cliente
    res.json(result.recordset);
  } catch (error) {
    // Manejar errores si ocurrieron durante la obtención de los usuarios
    console.error('Error al obtener usuarios:', error.message);
    res.status(500).send('Error interno del servidor');
  } 
});

app.post('/users', async (req, res) => {
  try {
    // Obtén los datos del cuerpo de la solicitud
    const { nombre, apellido, usuario, contrasena, confirmContrasena, userType } = req.body;

    if (contrasena !== confirmContrasena) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Verifica si la contraseña tiene al menos 8 caracteres
    if (contrasena.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }
    // Crea una nueva conexión a la base de datos
    await sql.connect(config);

    // Ejecuta la consulta SQL para insertar el nuevo usuario
    await sql.query`
      INSERT INTO Users (nombre, apellido, usuario, contrasena, tipo)
      VALUES (${nombre}, ${apellido}, ${usuario}, ${contrasena}, ${userType});`;

    // Cierra la conexión a la base de datos
    await sql.close();

    // Envía una respuesta al cliente indicando que el usuario se creó correctamente
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    // Maneja cualquier error que ocurra durante el proceso
    console.error('Error al crear el usuario:', error.message);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Endpoint para actualizar un usuario existente
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, usuario, contrasena, tipo } = req.body; // Agrega nombre y apellido
  try {
    await sql.connect(config);
    const result = await sql.query(`
      UPDATE Users
      SET nombre = '${nombre}', apellido = '${apellido}', usuario = '${usuario}', contrasena = '${contrasena}', tipo = '${tipo}'
      WHERE id = ${id}
    `);
    res.status(200).send('Usuario actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});


// Endpoint para eliminar un usuario
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    const result = await sql.query(`DELETE FROM Users WHERE id = ${id}`);
    res.status(200).send('Usuario eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).send('Error interno del servidor');
  } finally {
    sql.close();
  }
});


/*ACTIVIDADES A REALIZAAR */
app.get('/activity-log', async (req, res) => {
  try {
    // Realizar una consulta para obtener los registros de actividad
    await sql.connect(config);
    const query = `
      SELECT ActivityLog.id, ActivityLog.action, ActivityLog.timestamp, Users.usuario
      FROM ActivityLog
      INNER JOIN Users ON ActivityLog.usuario = Users.id
    `;
    const result = await sql.query(query);
    const activityLog = result.recordset; // Suponiendo que estás utilizando mssql y el resultado es un objeto con una propiedad "recordset"

    // Enviar los registros de actividad al cliente
    res.json(activityLog);
  } catch (error) {
    console.error('Error al obtener registros de actividad:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/activity-log', async (req, res) => {
  try {
    // Obtener los datos del registro de actividad del cuerpo de la solicitud
    await sql.connect(config);
    const logEntry = req.body;
    console.log("Datos desde el backend",logEntry);
    // Realizar una consulta para obtener el id del usuario correspondiente al nombre de usuario
    const userIdQuery = `SELECT id FROM Users WHERE usuario = '${logEntry.username}'`;
    const userIdResult = await sql.query(userIdQuery);
    const userId = userIdResult.recordset[0].id; // Suponiendo que estás utilizando mssql y el resultado es un objeto con una propiedad "recordset"

    // Insertar el registro de actividad en la tabla ActivityLog
    const insertQuery = `INSERT INTO ActivityLog (action, timestamp, usuario) VALUES ('${logEntry.action}', '${logEntry.timestamp}', ${userId})`;
    await sql.query(insertQuery);

    console.log('Registro de actividad insertado correctamente');
    res.sendStatus(200); // Enviar respuesta exitosa
  } catch (error) {
    console.error('Error al insertar registro de actividad:', error);
    res.status(500).send('Error interno del servidor');
  }
});




// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});
