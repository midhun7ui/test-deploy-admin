import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../authApi";

function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        uid,
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.token?.[0] ||
        err.response?.data?.uid?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.message ||
        "Invalid or expired password reset link. Please request a new one.";
      setErrorMessage(detail);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="purple-admin-login-page">
      {/* Background Visuals */}
      <div className="bg-left-city-overlay">
        <img
          src="/login-visual.png"
          alt="Logistics background"
          className="bg-city-image"
        />
        <div className="bg-city-gradient" />
      </div>

      <div className="purple-login-card">
        <div className="card-brand-section">
          <img src="/logo.svg" alt="HireD" className="card-logo" />
          <h1 className="card-title">Set New Password</h1>
          <p className="card-subtitle">Admin Operations Security</p>
        </div>

        {isSuccess ? (
          <div className="reset-success-card" style={{ textAlign: "center", padding: "16px 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#ecfdf5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
                check_circle
              </span>
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
              Password Reset Complete
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: "1.5" }}>
              Your administrator account password has been updated successfully.
            </p>
            <button
              type="button"
              className="login-btn-primary"
              onClick={() => navigate("/")}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#7e22ce",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Return to Admin Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="admin-login-form">
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
              Enter a strong new password for your administrator account.
            </p>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                New Password
              </label>
              <div className="input-wrapper" style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "10px 40px 10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d8b4fe",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9333ea",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #d8b4fe",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {errorMessage && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  marginBottom: "16px",
                  border: "1px solid #fecaca",
                }}
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#7e22ce",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Resetting Password..." : "Update Password"}
            </button>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link to="/" style={{ color: "#7e22ce", fontSize: "13px", textDecoration: "none" }}>
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default ResetPasswordPage;
