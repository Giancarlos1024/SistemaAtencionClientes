import React, { useState, useEffect } from 'react';
import './css/DatosTabla.css';
import jsPDF from "jspdf";
import "jspdf-autotable";
import Logoimg from "./img/logo.png";
import { PDFViewer, Document, Page, View, Text } from '@react-pdf/renderer';

function DatosTabla({ onUpdateForm, tipo, actualizarDatos }) {
  const [datos, setDatos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOption, setSearchOption] = useState("cedula");
  const [showPreview, setShowPreview] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);

  useEffect(() => {
    fetchData();
  }, [actualizarDatos]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/datos');
      if (response.ok) {
        const data = await response.json();
        setDatos(data);
      } else {
        console.error('Error al obtener datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const handleUpdate = async (codigoTicket, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3000/datos/${codigoTicket}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (response.ok) {
        console.log('Datos actualizados exitosamente');
        fetchData();
      } else {
        console.error('Error al actualizar datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar datos:', error);
    }
  };

  const handleDelete = async (codigoTicket) => {
    try {
      const response = await fetch(`http://localhost:3000/eliminarDatos/${codigoTicket}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Datos eliminados exitosamente');
        fetchData();
      } else {
        console.error('Error al eliminar datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar datos:', error);
    }
  };

  const handleUpdateData = (dato) => {
    onUpdateForm(dato);
  };

  const filterByDate = (dateString, startDate, endDate) => {
    const date = new Date(dateString);
    return date >= startDate && date <= endDate;
  };

  function handleGeneratePDF() {
    const doc = new jsPDF({
      orientation: "landscape",
    });
  
    const tableColumnNames = [
      "Nombres",
      "Apellidos",
      "Correo",
      "Cedula",
      "Dispositivo",
      "Descripción",
      "Precio",
      "Estado",
      "Código Ticket",
      "Fecha Inicio",
      "Fecha Finalización",
    ];
    const docWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 50;
  
    const logoX = (docWidth - logoWidth) / 2;
  
    doc.addImage(Logoimg, "PNG", logoX, 10, logoWidth, 50);
  
    const tableData = filteredData.map((dato) => [
      dato.nombreUsuario,
      dato.apellidoUsuario,
      dato.correoUsuario,
      dato.dniUsuario,
      dato.nombreDispositivo,
      dato.descripcionDispositivo,
      dato.precioDispositivo,
      dato.nombreEstado,
      dato.codigoTicket,
      new Date(dato.fechaInicio).toLocaleString(),
      new Date(dato.fechaEstimadaFinalizacion).toLocaleString(),
    ]);
  
    doc.autoTable({
      head: [tableColumnNames],
      body: tableData,
      startY: 70,
    });
  
    const centerX = docWidth / 2;
  
    doc.setFontSize(12);
  
    doc.setLineWidth(0.5);
    doc.line(
      centerX - 20,
      doc.internal.pageSize.getHeight() - 10,
      centerX + 20,
      doc.internal.pageSize.getHeight() - 10
    );
  
    const nombre = "Att. One Movil";
    doc.text(nombre, centerX, doc.internal.pageSize.getHeight() - 5, {
      align: "center",
    });
  
    const currentDate = getCurrentDate();
    const currentTime = getCurrentTime();
    doc.setFontSize(10);
    doc.text(currentDate + " " + currentTime, doc.internal.pageSize.getWidth() - 10, 10, {
      align: "right",
    });
  
    doc.save("datos.pdf");
  }
  
  function handleVisualizacionReporte() {
    const doc = new jsPDF({
      orientation: "landscape",
    });
  
    const tableColumnNames = [
      "Nombres",
      "Apellidos",
      "Correo",
      "Cedula",
      "Dispositivo",
      "Descripción",
      "Precio",
      "Estado",
      "Código Ticket",
      "Fecha Inicio",
      "Fecha Finalización",
    ];
    const docWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 50;
  
    const logoX = (docWidth - logoWidth) / 2;
  
    doc.addImage(Logoimg, "PNG", logoX, 10, logoWidth, 50);
  
    const tableData = filteredData.map((dato) => [
      dato.nombreUsuario,
      dato.apellidoUsuario,
      dato.correoUsuario,
      dato.dniUsuario,
      dato.nombreDispositivo,
      dato.descripcionDispositivo,
      dato.precioDispositivo,
      dato.nombreEstado,
      dato.codigoTicket,
      new Date(dato.fechaInicio).toLocaleString(),
      new Date(dato.fechaEstimadaFinalizacion).toLocaleString(),
    ]);
  
    doc.autoTable({
      head: [tableColumnNames],
      body: tableData,
      startY: 70,
    });
  
    const centerX = docWidth / 2;
  
    doc.setFontSize(12);
  
    doc.setLineWidth(0.5);
    doc.line(
      centerX - 20,
      doc.internal.pageSize.getHeight() - 10,
      centerX + 20,
      doc.internal.pageSize.getHeight() - 10
    );
  
    const nombre = "Att. One Movil";
    doc.text(nombre, centerX, doc.internal.pageSize.getHeight() - 5, {
      align: "center",
    });
  
    const currentDate = getCurrentDate();
    const currentTime = getCurrentTime();
    doc.setFontSize(10);
    doc.text(currentDate + " " + currentTime, doc.internal.pageSize.getWidth() - 10, 10, {
      align: "right",
    });
  
    // Convertir el contenido del PDF en una URL de blob
    const pdfUrl = doc.output('bloburl');
  
    // Abrir el visor de PDF en una nueva ventana o pestaña
    window.open(pdfUrl, '_blank');
  
    // Opcional: Mostrar el visor de PDF en el mismo componente
    // setShowPreview(true);
    // setPdfContent(pdfUrl);
  }
  
  

  function handleCloseModal() {
    setShowPreview(false);
  }

  const getCurrentDate = () => {
    const now = new Date();
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return now.toLocaleDateString("es-ES", options);
  };
  
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
    setSearchTerm("");
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = datos.filter((dato) => {
    if (
      searchOption === "fechainicio" ||
      searchOption === "fechafinalizacion"
    ) {
      const startDate = new Date(searchTerm);
      const endDate = new Date(searchTerm);
      endDate.setDate(endDate.getDate() + 1);
      if (searchOption === "fechainicio") {
        return filterByDate(dato.fechaInicio, startDate, endDate);
      } else {
        return filterByDate(
          dato.fechaEstimadaFinalizacion,
          startDate,
          endDate
        );
      }
    } else if (searchOption === "dispositivo") {
      return dato.nombreDispositivo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    } else {
      return Object.values(dato).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  return (
    <div className='container-tabla'>
      <h2>Datos</h2>
      <div className="search-container">
        <select value={searchOption} onChange={handleSearchOptionChange}>
          <option value="cedula">Cedula</option>
          <option value="fechainicio">Fecha Inicio</option>
          <option value="fechafinalizacion">Fecha Finalizacion</option>
          <option value="estado">Estado</option>
          <option value="dispositivo">Dispositivo</option>
        </select>
        {searchOption === "estado" ? (
          <select
            className="selectSearch"
            value={searchTerm}
            onChange={handleSearchInputChange}
          >
            <option value="En progreso">En progreso</option>
            <option value="Completada">Completada</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        ) : (
          <input
            className="inputSearch"
            type={
              searchOption === "fechainicio" ||
              searchOption === "fechafinalizacion"
                ? "date"
                : "text"
            }
            placeholder={`Buscar por ${
              searchOption === "fechainicio" ||
              searchOption === "fechafinalizacion"
                ? "fecha"
                : searchOption
            }`}
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Correo</th>
            <th>Cedula</th>
            <th>Dispositivo</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Código Ticket</th>
            <th>Fecha Inicio</th>
            <th>Fecha Finalización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((dato, index) => (
            <tr key={index}>
              <td>{dato.nombreUsuario}</td>
              <td>{dato.apellidoUsuario}</td>
              <td>{dato.correoUsuario}</td>
              <td>{dato.dniUsuario}</td>
              <td>{dato.nombreDispositivo}</td>
              <td>{dato.descripcionDispositivo}</td>
              <td>{dato.precioDispositivo}</td>
              <td>{dato.nombreEstado}</td>
              <td>{dato.codigoTicket}</td>
              <td>{new Date(dato.fechaInicio).toLocaleString()}</td>
              <td>
                {new Date(dato.fechaEstimadaFinalizacion).toLocaleString()}
              </td>
              <td>
                <button onClick={() => handleUpdateData(dato)}>
                  Actualizar
                </button>
                <button onClick={() => handleDelete(dato.codigoTicket)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleGeneratePDF} className="btn btn-primary">
        Generar Reporte
      </button>
      <button onClick={handleVisualizacionReporte} className="btn btn-primary">
        Visualización Reporte
      </button>

      {showPreview && (
        <div className="pdf-modal">
          <div className="pdf-modal-content">
            <button onClick={handleCloseModal} className="close-btn">Cerrar</button>
            {pdfContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default DatosTabla;
