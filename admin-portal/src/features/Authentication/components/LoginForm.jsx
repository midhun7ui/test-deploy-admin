import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../authApi";
import { setCurrentUser } from "../authState";

function LoginForm({ onForgotClick }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const data = await login({ email, password });

      if (data.user?.role !== "admin") {
        setError("Access denied. Only admin users can log in.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return;
      }

      setCurrentUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      if (err.status === 401) {
        setError("Invalid email or password.");
      } else if (err.status === 403) {
        setError("Your account has been blocked.");
      } else {
        setError(err.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="purple-login-form" onSubmit={handleSubmit}>
      {/* Email Address Input */}
      <div className="input-wrapper">
        <span className="material-symbols-outlined input-icon">mail</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Password Input */}
      <div className="input-wrapper">
        <span className="material-symbols-outlined input-icon">lock</span>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={isSubmitting}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          disabled={isSubmitting}
        >
          <span className="material-symbols-outlined">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {/* Controls Row: Keep me signed in & Forgot password? */}
      <div className="form-options-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
            disabled={isSubmitting}
          />
          <span>Keep me signed in</span>
        </label>

        {onForgotClick && (
          <button
            type="button"
            className="forgot-password-link"
            onClick={onForgotClick}
            disabled={isSubmitting}
          >
            Forgot password?
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="purple-login-error" role="alert">
          <span className="material-symbols-outlined">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="purple-submit-btn"
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
        {!isSubmitting && (
          <span className="material-symbols-outlined btn-arrow">arrow_forward</span>
        )}
        {isSubmitting && <span className="purple-spinner" />}
      </button>
    </form>
  );
}

export default LoginForm;
