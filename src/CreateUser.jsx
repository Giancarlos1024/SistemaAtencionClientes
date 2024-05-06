import React, { useState } from 'react';
import './css/CreateUser.css';

const CreateUser = () => {
  const initialState = {
    nombre: '',
    apellido: '',
    usuario: '',
    contrasena: '',
    confirmContrasena: '',
    userType: ''
  };
  

  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (formData.contrasena !== formData.confirmContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Usuario creado exitosamente');
        setSuccessMessage('Usuario creado exitosamente');
        setFormData(initialState); // Resetear el estado del formulario
      } else {
        console.error('Error al crear el usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <div className='divCreateUser'>
      <form className='UserForm' onSubmit={handleSubmit}>
        <h4 className='DataUser'>Crear Usuario</h4>
        {successMessage && <p>{successMessage}</p>}
        <div className='divfor'>
          <input
            type="text"
            name="usuario"
            placeholder='Usuario'
            value={formData.usuario}
            onChange={handleChange}
            required
          />
        </div>
        <div className='divfor'>
          <input
            type="text"
            name="nombre"
            placeholder='Nombre'
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className='divfor'>
          <input
            type="text"
            name="apellido"
            placeholder='Apellido'
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>
        <div className='divfor'>
          <input
            type={showPassword ? "text" : "password"}
            name="contrasena"
            placeholder='Contraseña'
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
        </div>
        <div className='divfor'>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmContrasena"
            placeholder='Confirmar Contraseña'
            value={formData.confirmContrasena}
            onChange={handleChange}
            required
          />
        </div>
        <div className='divfor' >
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={togglePasswordVisibility}
          />
          <label htmlFor="showPassword"> Mostrar Contraseña</label>
        </div>
        <div className='divfor'>
          <h4>Tipo</h4>
          <select name="userType" value={formData.userType} onChange={handleChange}>
            <option>Selección</option>
            <option value="Admin">Admin</option>
            <option value="Gerente">Gerente</option>
            <option value="Tecnico">Tecnico</option>
          </select>
        </div>
        <button type="submit" className='buttonUser'>Crear Usuario</button>
      </form>
    </div>
  );
};

export default CreateUser;
