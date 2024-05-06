import React, { useState, useEffect } from 'react';
import './css/Admin.css';
import { Link, useLocation } from 'react-router-dom';
import DatosTabla from './DatosTabla';
import CreateUser from './CreateUser';
import DatosTablaUser from './DatosTablaUser';

function Admin() {
  const [formData, setFormData] = useState({
    // Definir el estado inicial del formulario
    nombreUsuario: '',
    apellidoUsuario: '',
    correoUsuario: '',
    dniUsuario: '',
    nombreDispositivo: '',
    descripcionDispositivo: '',
    precioDispositivo: '',
    nombreEstado: '', // Cambiar el tipo de dato a string para el estado
    codigoTicket: '',
    fechaInicio: '',
    fechaEstimadaFinalizacion: ''
  });
  const [activityLog, setActivityLog] = useState([]);
  const location = useLocation();
  const { state: { username, password, tipo } = {} } = location;

  useEffect(() => {
    if (username && password && tipo) {
      // Realizar alguna acción con el nombre de usuario, contraseña y rol recibidos
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Role:', tipo);
      
      fetchActivityLog(); // Obtener registros de actividad al cargar el componente
    }
  }, [username, password, tipo]);

  const handleUpdateForm = (updatedData) => {
    // Actualiza el formulario con los datos recibidos
    setFormData(updatedData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Formatear las fechas antes de enviar
      const formattedData = {
        ...formData,
        // Agregar 'T' entre la fecha y la hora para el formato de fecha-fecha de SQL Server
        fechaInicio: formData.fechaInicio.replace('T', ' '),
        fechaEstimadaFinalizacion: formData.fechaEstimadaFinalizacion.replace('T', ' ')
      };

      const response = await fetch('http://localhost:3000/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        console.log('Datos creados exitosamente');
        // Limpiar el formulario después de la creación exitosa
        setFormData({
          nombreUsuario: '',
          apellidoUsuario: '',
          correoUsuario: '',
          dniUsuario: '',
          nombreDispositivo: '',
          descripcionDispositivo: '',
          precioDispositivo: '',
          nombreEstado: '',
          codigoTicket: '',
          fechaInicio: '',
          fechaEstimadaFinalizacion: ''
        });
        fetchActivityLog(); // Actualizar registros de actividad después de la creación
      } else if (response.status === 400) {
        // Si la cedula ya está registrado, mostrar un mensaje de error
        alert('La cedula ya está registrada. Por favor, introduzca otra cedula.');
      } else {
        console.error('Error al crear datos:', response.statusText);
      }

      // Registro de la acción de creación de datos
      const creationLogEntry = {
        username: username,
        action: 'Crear Datos',
        timestamp: new Date().toISOString()
      };
      await sendActivityLog(creationLogEntry);

    } catch (error) {
      console.error('Error al crear datos:', error);
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      console.log('Datos a enviar al servidor:', formData);
      const response = await fetch(`http://localhost:3000/datos/${formData.codigoTicket}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Datos actualizados exitosamente');
        setFormData({
          nombreUsuario: '',
          apellidoUsuario: '',
          correoUsuario: '',
          dniUsuario: '',
          nombreDispositivo: '',
          descripcionDispositivo: '',
          precioDispositivo: '',
          nombreEstado: '',
          codigoTicket: '',
          fechaInicio: '',
          fechaEstimadaFinalizacion: ''
        });

        // Registro de la acción de actualización de datos
        const updateLogEntry = {
          username: username,
          action: 'Confirmar Actualizacion',
          timestamp: new Date().toISOString()
        };
        await sendActivityLog(updateLogEntry);

        fetchActivityLog(); // Actualizar registros de actividad después de la actualización
      } else {
        console.error('Error al actualizar datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    }
  };

  // Función para enviar registros de actividad al servidor
  const sendActivityLog = async (logEntry) => {
    try {
      const response = await fetch('http://localhost:3000/activity-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      });
      if (response.ok) {
        console.log('Registro de actividad enviado con éxito');
      } else {
        console.error('Error al enviar registro de actividad:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar registro de actividad:', error);
    }
  };

  // Función para obtener registros de actividad del servidor
  const fetchActivityLog = async () => {
    try {
      const response = await fetch('http://localhost:3000/activity-log');
      if (response.ok) {
        const data = await response.json();
        setActivityLog(data);
      } else {
        console.error('Error al obtener registros de actividad:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener registros de actividad:', error);
    }
  };

  return (
    <div>
      <div className="admin-container">
        <h1>Panel de Administrador</h1>
        <Link to="/">Home</Link>
        <section className='FormulariosPanel'>
          <div className='formularios'>
            <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
                <div className='conteinerInputs'>
                  <h2>Crear Cliente</h2>
                  <input
                    type="text"
                    name="dniUsuario"
                    placeholder="Cedula"
                    value={formData.dniUsuario}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
                <div className='conteinerInputs'>
                  <input
                    type="text"
                    name="nombreUsuario"
                    placeholder="Nombre"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
                <div className='conteinerInputs'>
                  <input
                    type="text"
                    name="apellidoUsuario"
                    placeholder="Apellido"
                    value={formData.apellidoUsuario}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
                <div className='conteinerInputs'>
                  <input
                    type="email"
                    name="correoUsuario"
                    placeholder="Correo"
                    value={formData.correoUsuario}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <div className='conteinerInputs'>
                  <h2>Crear Dispositivo</h2>
                  <input
                    type="text"
                    name="nombreDispositivo"
                    placeholder="Nombre"
                    value={formData.nombreDispositivo}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
                <div className='conteinerInputs'>
                  <input
                    type="text"
                    name="descripcionDispositivo"
                    placeholder="Descripción"
                    value={formData.descripcionDispositivo}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
                <div className='conteinerInputs'>
                  <input
                    type="text"
                    name="precioDispositivo"
                    placeholder="Costo de Reparacion"
                    value={formData.precioDispositivo}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <div className='conteinerInputs'>
                  <h2>Crear Estado de Reparación</h2>
                  <select
                    name="nombreEstado"
                    value={formData.nombreEstado}
                    onChange={handleChange}

                  >
                    <option value="En progreso">En Progreso</option>
                    <option value="Completada">Completada</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <div className='conteinerInputs'>
                  <h2>Crear Reparación</h2>
                  <input
                    type="text"
                    name="codigoTicket"
                    placeholder="Código del Ticket"
                    value={formData.codigoTicket}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
                <div className='conteinerInputs'>
                  <input
                    type="datetime-local"
                    name="fechaInicio"
                    placeholder="Fecha de Inicio"
                    value={formData.fechaInicio.replace('Z', '')}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
                <div className='conteinerInputs'>
                  <input
                    type="datetime-local"
                    name="fechaEstimadaFinalizacion"
                    placeholder="Fecha Estimada de Finalización"
                    value={formData.fechaEstimadaFinalizacion.replace('Z', '')}
                    onChange={handleChange}
                    disabled={tipo === 'Tecnico'}
                  />
                </div>
              </div>

              <div className='conteinerInputs'>
                <button type="submit" className="admin-button buttonClientes">Crear Datos</button>
                <button type="button" className="admin-button buttonClientes" onClick={handleConfirmUpdate}>Confirmar Actualización</button>
              </div>
            </form>
          </div>
          <div className='formularios Subformularios'>
            {tipo === 'Admin' && (
              <>
                <CreateUser />
                <DatosTablaUser />
              </>
            )}
          </div>
        </section>
      </div>
      {tipo === 'Admin' && (
              <div className="activity-log-container">
              <div className="activity-log-table">
                <table>
                  <caption>Registros de Actividad</caption>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Acción</th>
                      <th>Fecha y Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLog.map((logEntry, index) => (
                      <tr key={index}>
                        <td>{logEntry.usuario}</td> 
                        <td>{logEntry.action}</td>
                        <td>{new Date(logEntry.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
      
      <DatosTabla onUpdateForm={handleUpdateForm} tipo={tipo} />
    </div>
  );
}

export default Admin;
