import React from 'react';

function ReportModal({ show, handleClose, reportContent }) {
  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Reporte</h2>
        <div>{reportContent}</div>
      </div>
    </div>
  );
}

export default ReportModal;
