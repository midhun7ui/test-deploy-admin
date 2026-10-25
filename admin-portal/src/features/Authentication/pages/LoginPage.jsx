import { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { isAuthenticated } from "../authState";
import { forgotPassword } from "../authApi";

function LoginPage() {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleResetSubmit(e) {
    e.preventDefault();
    setResetError("");
    const cleanEmail = resetEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setResetError("Please enter a valid administrator email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await forgotPassword(cleanEmail);
      setResetMessage(
        res?.message ||
          "If an account exists for this email, a password reset link has been sent to your inbox."
      );
    } catch (err) {
      const errMsg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to send reset email. Please try again.";
      setResetError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCloseModal() {
    setShowForgotModal(false);
    setResetEmail("");
    setResetMessage("");
    setResetError("");
  }

  return (
    <main className="purple-admin-login-page">
      {/* Background City/Highway Visual Overlay (Left) */}
      <div className="bg-left-city-overlay">
        <img
          src="/login-visual.png"
          alt="Logistics background"
          className="bg-city-image"
        />
        <div className="bg-city-gradient" />
      </div>

      {/* Background Map Route & Location Pins (Right) */}
      <div className="bg-right-map-overlay">
        <svg className="map-route-svg" viewBox="0 0 500 500" fill="none">
          <path
            d="M 50 180 Q 200 60 320 280 T 450 160"
            stroke="#a855f7"
            strokeWidth="3.5"
            strokeDasharray="9 9"
            opacity="0.45"
          />
          {/* Top Location Pin */}
          <g transform="translate(425, 125)">
            <circle cx="18" cy="18" r="16" fill="#a855f7" opacity="0.25" />
            <path
              d="M18 4 C11 4 6 9 6 16 C6 25 18 34 18 34 C18 34 30 25 30 16 C30 9 25 4 18 4 Z"
              fill="#9333ea"
            />
            <circle cx="18" cy="15" r="4.5" fill="#ffffff" />
          </g>
          {/* Bottom Location Pin */}
          <g transform="translate(300, 255)">
            <circle cx="24" cy="24" r="22" fill="#9333ea" opacity="0.3" />
            <path
              d="M24 6 C15 6 8 13 8 22 C8 34 24 46 24 46 C24 46 40 34 40 22 C40 13 33 6 24 6 Z"
              fill="#7e22ce"
            />
            <circle cx="24" cy="21" r="6" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* Centered White Card */}
      <div className="purple-login-card">
        <div className="card-brand-section">
          <img src="/logo.svg" alt="HireD" className="card-logo" />
          <h1 className="card-title">Admin Panel</h1>
          <p className="card-subtitle">Sign in to manage your operations</p>
        </div>

        <LoginForm onForgotClick={() => setShowForgotModal(true)} />
      </div>

      {/* Reset Password Modal */}
      {showForgotModal && (
        <div className="forgot-modal-overlay">
          <div className="forgot-modal-box">
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="modal-icon-box">
              <span className="material-symbols-outlined">key_vertical</span>
            </div>

            <h2>Reset Portal Password</h2>
            <p className="modal-desc">
              Enter your corporate administrator email address to receive a secure password reset link.
            </p>

            {resetMessage ? (
              <div className="reset-success-state" style={{ textAlign: "center", padding: "12px 0" }}>
                <div className="reset-success-alert" style={{ marginBottom: "16px" }}>
                  <span className="material-symbols-outlined">mark_email_read</span>
                  <span>{resetMessage}</span>
                </div>
                <button
                  type="button"
                  className="modal-submit-btn"
                  onClick={handleCloseModal}
                  style={{ width: "100%" }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="modal-form">
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">mail</span>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@hired.com"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {resetError && (
                  <div className="login-error-alert" style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
                    <span>{resetError}</span>
                  </div>
                )}

                <div className="modal-actions" style={{ marginTop: "16px" }}>
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="modal-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </main>
  );
}

export default LoginPage;
