import { useEffect } from "react";
import PropTypes from "prop-types";

function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast-container toast-${toast.type || "success"}`} role="alert">
      <div className="toast-icon-circle">
        <span className="material-symbols-outlined">
          {toast.type === "success" && "check_circle"}
          {toast.type === "warning" && "warning"}
          {toast.type === "error" && "error"}
          {toast.type === "info" && "info"}
        </span>
      </div>

      <div className="toast-text-area">
        <strong className="toast-title">{toast.title}</strong>
        <p className="toast-message">{toast.message}</p>
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}

ToastNotification.propTypes = {
  toast: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default ToastNotification;
