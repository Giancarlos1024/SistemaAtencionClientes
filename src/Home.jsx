import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate en lugar de navigate
import './css/App.css';
import './css/Home.css';
import './css/Modal.css';
import logo from './img/logo.png';
import baterias from './img/baterias.jpg';
import pantallas from './img/pantallas.jpg';
import liberacion from './img/liberacion.jpg';
import forros from './img/forro.jpg';
import pantallaspromo from './img/pantallaspromo.jpg';
import revision from './img/revision.jpg';

function Home() {
  const [ticketCode, setTicketCode] = useState('');
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [repairStatus, setRepairStatus] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalHelpOpen, setIsModalHelpOpen] = useState(false);
  
  const navigate = useNavigate(); // Utiliza useNavigate() en lugar de navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/dispositivos/${ticketCode}`);
      const data = await response.json();
      setDeviceDetails(data);
      // Obtener datos del usuario y estado de reparación permanecen sin cambios
    } catch (error) {
      console.error('Error al obtener detalles del dispositivo:', error);
    }
  };
  const verifyCredentials = async (username, password) => {
    try {
      const response = await fetch(`http://localhost:3000/users`);
      const data = await response.json();
      const user = data.find(user => user.usuario === username && user.contrasena === password);
      if (user) {
        return { isAuthenticated: true, tipo: user.tipo };
      } else {
        return { isAuthenticated: false };
      }
    } catch (error) {
      console.error('Error al verificar credenciales:', error);
      return { isAuthenticated: false };
    }
  };
  
  
  const handleAuthentication = async (username, password) => {
    const { isAuthenticated, tipo } = await verifyCredentials(username, password);
    
    if (isAuthenticated) {
      console.log(username);
      console.log(password);
      const userData = {
        username,
        password,
        tipo
      };
      navigate('/admin', { state: userData }); // Pasa los datos como parte del estado de la ruta
      setIsModalOpen(false); // Cierra el modal después de iniciar sesión correctamente
    } else {
      // Si el usuario no existe o las credenciales son incorrectas
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000); // Limpia el error después de 3 segundos
      setUsername('');
      setPassword('');
    }
  };
  

  const handleDownloadPDF = async () => {
    if (deviceDetails) { // Verifica que deviceDetails no sea null
      try {
        const response = await fetch('http://localhost:3000/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(deviceDetails)
        });
        const pdfBlob = await response.blob();
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'detalles_dispositivo.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error al descargar el PDF:', error);
      }
    } else {
      console.error('No hay detalles de dispositivo para generar el PDF');
    }
  };
  
  
  
  

  return (
    <div className="App">
      <header className="header-container">
        <img src={logo} alt="error" />
        <div className="container-botones">
        <button onClick={() => setIsModalOpen(true)} className='buttoninicio'>Login</button>
        <button onClick={() => setIsModalHelpOpen(true)} className='buttoninicio'>Ayuda</button>
        </div>
      
      </header>
      <main>
        <section className="welcome">
          <h2>Bienvenido</h2>
          <p>Ingrese su código de ticket para verificar el estado de su dispositivo.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ingrese su ticket"
              value={ticketCode}
              onChange={(event) => setTicketCode(event.target.value)}
            />
            <button type="submit">Verificar Estado</button>
          </form>
          {isAdmin && <Link to="/admin">Panel de Administración</Link>}
        </section>
        <section className='container-productos'>
          <h2>Productos Destacados</h2>
          <section className='container-grupo'>
            <div className='container-subproductos'>
              <img src={baterias} alt="error" />
              <p><strong>Baterias</strong></p>
            </div>
            <div className='container-subproductos'>
              <img src={pantallas} alt="error" />
              <p><strong>Pantallas</strong></p>
            </div>
            <div className='container-subproductos'>
              <img src={liberacion} alt="error" />
              <p><strong>Liberacion</strong></p>
            </div>
          </section>
        </section>
        <section className='container-productos'>
          <h2>Ofertas Especiales</h2>
          <section className='container-grupo'>
            <div className='container-subproductos'>
              <img src={forros} alt="error" />
              <p><strong>Forros</strong></p>
            </div>
            <div className='container-subproductos'>
              <img src={pantallaspromo} alt="error" />
              <p><strong>Pantallas Promo</strong></p>
            </div>
            <div className='container-subproductos'>
              <img src={revision} alt="error" />
              <p><strong>Revision</strong></p>
            </div>
          </section>
        </section>
        {deviceDetails && (
          <div className="modal" style={{ display: deviceDetails ? 'block' : 'none' }}>
            <div className="modal-content">
              <span className="close" onClick={() => setDeviceDetails(null)}>&times;</span>
              <h2>DETALLES DEL DISPOSITIVO</h2>
              <table>
                <tbody>
                  <tr>
                    <th>Nombre del dispositivo</th>
                    <td>{deviceDetails.nombre}</td>
                  </tr>
                  <tr>
                    <th>Descripción del dispositivo</th>
                    <td>{deviceDetails.descripcion}</td>
                  </tr>
                  <tr>
                    <th>Precio</th>
                    <td>$ {deviceDetails.precio}</td>
                  </tr>
                  <tr>
                    <th>Nombres y Apellidos</th>
                    <td>{deviceDetails.usuario} {deviceDetails.apellido}</td>
                  </tr>
                  <tr>
                    <th>Correo electrónico</th>
                    <td>{deviceDetails.correo}</td>
                  </tr>
                  <tr>
                    <th>Cedula</th>
                    <td>{deviceDetails.dni}</td>
                  </tr>
                  <tr>
                    <th>Estado de reparación</th>
                    <td>{deviceDetails.estado}</td>
                  </tr>
                  <tr>
                    <th>Fecha de Inicio</th>
                    <td>{deviceDetails.fecha_inicio}</td>
                  </tr>
                  <tr>
                    <th>Fecha de Finalizacion</th>
                    <td>{deviceDetails.fecha_estimada_finalizacion}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={handleDownloadPDF}>Descargar Detalles (PDF)</button>
            </div>
          </div>
        )}
        {isModalOpen && (
          <div className="modal" style={{ display: isModalOpen ? 'block' : 'none' }}>
            <div className="modal-content">
              <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
              <h2>Iniciar Sesión</h2>
              <form className='formularioLogin' onSubmit={(event) => {
                event.preventDefault();
                handleAuthentication(username, password);
              }}>
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className={loginError ? 'error' : ''}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={loginError ? 'error' : ''}
                />
                {loginError && <p className="error-message">Credenciales incorrectas. Inténtelo de nuevo.</p>}
                <button className='buttoninicio' type="submit">Iniciar</button>
              </form>
            </div>
            
          </div>
        )}


{isModalHelpOpen && (
          <div className="modal" style={{ display: isModalHelpOpen ? 'block' : 'none' }}>
            <div className="modal-content">
              <span className="close" onClick={() => setIsModalHelpOpen(false)}>&times;</span>
              <h2>Ayuda</h2>
              <h3 className='pasos'>Paso 1</h3>
              <div className='pasossub'>Debe colocar su numero de ticket que se le ha sido asignado en tienda en este espacio</div>
              <img src="paso1.png" alt="paso 1" />
           <h3>Paso 2</h3>
           <div className='pasossub'>Ahora debe continuar presionando el boton "Verificar Estado"</div>
           <img src="paso2.png" alt="paso 2" />
           <h3>Paso 3</h3>
           <div className='pasossub'>¡Ya puede ver el estado en el que se encuentra su dispositivo!</div>
           <img src="paso3.png" alt="paso 3" />
            </div>
            
          </div>
        )}

      </main>
    </div>
  );
}

export default Home;
