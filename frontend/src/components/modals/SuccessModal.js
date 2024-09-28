import React from "react";
import "../../styles/successModal.css";

const SuccessModal = ({ message, onClose, show }) => {
  return (
    <div className={`success-modal-overlay ${show ? "show" : ""}`}>
      <div className={`success-modal ${show ? "show" : ""}`}>
        <h3>Success</h3>
        <p>{message}</p>
        <button className="ok-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
