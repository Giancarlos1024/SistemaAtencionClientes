import React, { useState, useEffect } from 'react';
import './css/Users.css'; // Importa el archivo CSS
import { Link } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    dni: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'DELETE',
      });
      fetchUsers(); // Actualizar la lista después de eliminar
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        fetchUsers(); // Actualizar la lista después de agregar
        setNewUser({
          nombre: '',
          apellido: '',
          correo: '',
          dni: ''
        });
      } else {
        console.error('Error adding user:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="devices-container">
      <h2>Gestión de Usuarios</h2>
      <div className="add-device-form">
        <input type="text" placeholder="Nombre" value={newUser.nombre} onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })} />
        <input type="text" placeholder="Apellido" value={newUser.apellido} onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })} />
        <input type="text" placeholder="Correo" value={newUser.correo} onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })} />
        <input type="text" placeholder="Cedula" value={newUser.dni} onChange={(e) => setNewUser({ ...newUser, dni: e.target.value })} />
        <button onClick={handleSubmit}>Agregar Usuario</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Cedula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.correo}</td>
              <td>{user.dni}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                {/* Aquí puedes agregar botones para editar el usuario */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
