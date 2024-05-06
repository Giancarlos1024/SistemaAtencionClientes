import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    dni: ''
  });

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  const fetchUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`);
      const data = await response.json();
      setUser(data);
      setEditedUser(data); // Inicializar los datos editados con los datos del usuario
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });
      if (response.ok) {
        // Manejar éxito
      } else {
        console.error('Error updating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Editar Usuario</h2>
      <form onSubmit={handleSubmit} className="edit-user-form">
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">Nombre:</label>
          <input type="text" id="nombre" name="nombre" value={editedUser.nombre} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="apellido" className="form-label">Apellido:</label>
          <input type="text" id="apellido" name="apellido" value={editedUser.apellido} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="correo" className="form-label">Correo:</label>
          <input type="email" id="correo" name="correo" value={editedUser.correo} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="dni" className="form-label">Cedula:</label>
          <input type="number" id="dni" name="dni" value={editedUser.dni} onChange={handleChange} className="form-input" required />
        </div>
        <button type="submit" className="submit-btn">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditUser;
