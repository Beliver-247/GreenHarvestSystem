import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "../../styles/notificationModal.css";

const NotificationModal = ({ message, show, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Modal disappears after 2 seconds

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [show, onClose]);

  const handleClick = () => {
    // Redirect the user to the /incoming-batches path
    navigate("/incoming-batches");
    onClose(); // Close the notification after clicking
  };

  return (
    <div className={`notification-modal ${show ? "show" : ""}`} onClick={handleClick}>
      <p>{message}</p>
    </div>
  );
};

export default NotificationModal;
