import React from 'react';
import './Modal.css'; 

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children} 
      </div>
    </div>
  );
};

export default Modal;
