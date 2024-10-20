import React from 'react';
import './ProfileModal.css'; 

const ProfileModal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  const handleProfileOverlayClick = (e) => {
    if (e.target.classList.contains('profile-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={handleProfileOverlayClick}>
      <div className="profile-modal-content">
        <button className="profile-close-button" onClick={onClose}>
          &times;
        </button>
        {children} 
      </div>
    </div>
  );
};

export default ProfileModal;
