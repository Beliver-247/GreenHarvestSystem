import React from "react";
import "../../styles/confirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel, show }) => {
  return (
    <div className={`confirm-modal-overlay ${show ? "show" : ""}`}>
      <div className={`confirm-modal ${show ? "show" : ""}`}>
        <h3>Confirmation</h3>
        <p>{message}</p>
        <div className="confirm-modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Yes
          </button>
          <button className="cancel-button" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
