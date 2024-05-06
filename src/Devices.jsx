import React, { useState, useEffect } from 'react';
import './css/Devices.css'; // Importar estilos

function Devices() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    nombre: '',
    descripcion: '',
    precio: ''
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await fetch('http://localhost:3000/dispositivos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const handleAddDevice = async () => {
    try {
      const response = await fetch('http://localhost:3000/dispositivos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDevice)
      });
      if (response.ok) {
        loadDevices();
        setNewDevice({
          nombre: '',
          descripcion: '',
          precio: ''
        });
      } else {
        console.error('Error adding device:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding device:', error);
    }
  };

  const handleDeleteDevice = async (id) => {
    try {
      await fetch(`http://localhost:3000/dispositivos/${id}`, {
        method: 'DELETE'
      });
      loadDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  return (
    <div className="devices-container">
      <h2>Gestión de Dispositivos</h2>
      <div className="add-device-form">
        <input type="text" placeholder="Nombre" value={newDevice.nombre} onChange={(e) => setNewDevice({ ...newDevice, nombre: e.target.value })} />
        <input type="text" placeholder="Descripción" value={newDevice.descripcion} onChange={(e) => setNewDevice({ ...newDevice, descripcion: e.target.value })} />
        <input type="text" placeholder="Precio" value={newDevice.precio} onChange={(e) => setNewDevice({ ...newDevice, precio: e.target.value })} />
        <button onClick={handleAddDevice}>Agregar Dispositivo</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.id}>
              <td>{device.id}</td>
              <td>{device.nombre}</td>
              <td>{device.descripcion}</td>
              <td>${device.precio}</td>
              <td>
                <button onClick={() => handleDeleteDevice(device.id)}>Eliminar</button>
                {/* Aquí puedes agregar botones para editar el dispositivo */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Devices;
