import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../authApi";
import { isAuthenticated, setCurrentUser } from "../authState";

function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve MFA session from route state or fallback to sessionStorage
  const sessionData = (() => {
    if (location.state?.temp_token) {
      return location.state;
    }
    try {
      const stored = sessionStorage.getItem("admin_mfa_session");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const [isSuccess, setIsSuccess] = useState(false);
  const [tempToken, setTempToken] = useState(sessionData?.temp_token || "");
  const emailMasked = sessionData?.email_masked || "your registered email";

  // 6 individual digit inputs
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Timers: Expiry countdown (default 10 min) and Resend cooldown (60s)
  const [timeLeft, setTimeLeft] = useState(
    sessionData?.expires_in_seconds || 600
  );
  const [resendCooldown, setResendCooldown] = useState(60);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [_attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [resendNotice, setResendNotice] = useState("");

  // Focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Expiry countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // If already authenticated and not in successful completion state, redirect straight to dashboard
  if (isAuthenticated() && !isSuccess) {
    return <Navigate to="/dashboard" replace />;
  }

  // If no active 2FA challenge session exists, redirect to login
  if (!sessionData?.temp_token && !isSuccess) {
    return <Navigate to="/login" replace />;
  }

  // Format seconds as MM:SS
  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle digit input change
  function handleDigitChange(index, value) {
    if (isSubmitting || isLocked) return;

    setError("");
    setResendNotice("");

    // Accept only digits
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const char = cleaned.slice(-1); // Take the latest typed digit
    const nextDigits = [...digits];
    nextDigits[index] = char;
    setDigits(nextDigits);

    // Auto-advance to next input if digit entered
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    const fullCode = nextDigits.join("");
    if (fullCode.length === 6 && nextDigits.every((d) => d !== "")) {
      executeVerification(fullCode);
    }
  }

  // Handle backspace and arrow navigation
  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Current input is empty: move to and clear previous box
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        setDigits(nextDigits);
        inputRefs.current[index - 1]?.focus();
      } else if (digits[index]) {
        // Clear current box
        const nextDigits = [...digits];
        nextDigits[index] = "";
        setDigits(nextDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  // Handle clipboard paste of 6-digit code
  function handlePaste(e) {
    e.preventDefault();
    if (isSubmitting || isLocked) return;

    const pasted = e.clipboardData.getData("text").trim();
    const numericChars = pasted.replace(/\D/g, "").slice(0, 6);

    if (!numericChars) return;

    const nextDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < numericChars.length; i++) {
      nextDigits[i] = numericChars[i];
    }
    setDigits(nextDigits);

    if (numericChars.length === 6) {
      inputRefs.current[5]?.focus();
      executeVerification(numericChars);
    } else {
      inputRefs.current[numericChars.length]?.focus();
    }
  }

  // Verification request execution
  async function executeVerification(codeToVerify) {
    const otpCode = codeToVerify || digits.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (timeLeft <= 0) {
      setError("Verification code has expired. Please request a new code.");
      return;
    }

    setError("");
    setResendNotice("");
    setIsSubmitting(true);

    try {
      const data = await verifyOtp({
        temp_token: tempToken,
        otp: otpCode,
      });

      setIsSuccess(true);
      sessionStorage.removeItem("admin_mfa_session");
      setCurrentUser(data.user);

      // Brief visual confirmation before transitioning
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 750);
    } catch (err) {
      if (err.code === "OTP_LOCKED") {
        setIsLocked(true);
        setError(
          "Maximum attempts exceeded. This login session has been terminated for security reasons."
        );
      } else if (err.code === "OTP_EXPIRED") {
        setError(
          "Verification code has expired. Please request a new code below."
        );
      } else if (err.code === "OTP_INVALID") {
        const remaining = err.attemptsRemaining ?? null;
        setAttemptsRemaining(remaining);
        setError(
          remaining !== null
            ? `Incorrect verification code. ${remaining} attempt${
                remaining === 1 ? "" : "s"
              } remaining.`
            : "Incorrect verification code. Please check your email and try again."
        );
        // Clear digits on invalid entry and refocus first box
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError(
          err.message ||
            "Unable to verify code. Please verify your internet connection."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Resend code request execution
  async function handleResend() {
    if (resendCooldown > 0 || isResending || isLocked) return;

    setIsResending(true);
    setError("");
    setResendNotice("");

    try {
      const data = await resendOtp({ temp_token: tempToken });

      // Update active token
      if (data.temp_token) {
        setTempToken(data.temp_token);
        const updated = {
          ...sessionData,
          temp_token: data.temp_token,
          expires_in_seconds: data.expires_in_seconds || 600,
        };
        sessionStorage.setItem("admin_mfa_session", JSON.stringify(updated));
      }

      setDigits(["", "", "", "", "", ""]);
      setTimeLeft(600);
      setResendCooldown(60);
      setAttemptsRemaining(null);
      setResendNotice("A fresh 6-digit code has been sent to your inbox.");
      inputRefs.current[0]?.focus();
    } catch (err) {
      if (err.retryAfter) {
        setResendCooldown(err.retryAfter);
      }
      setError(
        err.message ||
          "Unable to resend code right now. Please wait before trying again."
      );
    } finally {
      setIsResending(false);
    }
  }

  // Cancel and return to primary login
  function handleCancel() {
    sessionStorage.removeItem("admin_mfa_session");
    navigate("/login", { replace: true });
  }

  return (
    <main className="purple-admin-login-page">
      {/* Background Visual Overlays */}
      <div className="bg-left-city-overlay">
        <img
          src="/login-visual.png"
          alt="Logistics background"
          className="bg-city-image"
        />
        <div className="bg-city-gradient" />
      </div>

      <div className="bg-right-map-overlay">
        <svg className="map-route-svg" viewBox="0 0 500 500" fill="none">
          <path
            d="M 50 180 Q 200 60 320 280 T 450 160"
            stroke="#a855f7"
            strokeWidth="3.5"
            strokeDasharray="9 9"
            opacity="0.45"
          />
          <g transform="translate(425, 125)">
            <circle cx="18" cy="18" r="16" fill="#a855f7" opacity="0.25" />
            <path
              d="M18 4 C11 4 6 9 6 16 C6 25 18 34 18 34 C18 34 30 25 30 16 C30 9 25 4 18 4 Z"
              fill="#9333ea"
            />
            <circle cx="18" cy="15" r="4.5" fill="#ffffff" />
          </g>
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

      {/* Centered Security Card */}
      <div className="purple-login-card otp-card">
        {/* Brand / Security Badge Header */}
        <div className="card-brand-section">
          <img src="/logo.svg" alt="HireD" className="card-logo" />

          <div className="otp-shield-badge">
            <span className="material-symbols-outlined">shield_person</span>
          </div>

          <h1 className="card-title">Two-Step Verification</h1>
          <p className="card-subtitle">Administrator Security Layer</p>
        </div>

        {isSuccess ? (
          <div className="otp-success-state">
            <div className="otp-success-icon-wrap">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <h2>Verification Confirmed</h2>
            <p>Signing in to HireD Operations Portal...</p>
            <div className="purple-spinner" style={{ margin: "16px auto 0" }} />
          </div>
        ) : (
          <div className="otp-body-content">
            <p className="otp-instruction-text">
              Enter the 6-digit verification code sent to:
            </p>

            <div className="otp-email-chip" title="Registered admin email">
              <span className="material-symbols-outlined">mark_email_read</span>
              <span className="otp-email-text">{emailMasked}</span>
            </div>

            {/* 6 Digit Input Boxes Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeVerification();
              }}
              className="otp-form"
            >
              <div
                className="otp-digits-row"
                onPaste={handlePaste}
                role="group"
                aria-label="6 digit verification code"
              >
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    disabled={isSubmitting || isLocked}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`otp-digit-box ${
                      error ? "otp-digit-error" : ""
                    } ${digit ? "otp-digit-filled" : ""}`}
                    aria-label={`Digit ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Status & Error Alerts */}
              {error && (
                <div className="otp-alert-box otp-error-alert" role="alert">
                  <span className="material-symbols-outlined alert-icon">
                    error
                  </span>
                  <span>{error}</span>
                </div>
              )}

              {resendNotice && (
                <div
                  className="otp-alert-box otp-success-alert"
                  role="status"
                >
                  <span className="material-symbols-outlined alert-icon">
                    check_circle
                  </span>
                  <span>{resendNotice}</span>
                </div>
              )}

              {/* Expiry Timer & Resend Controls */}
              <div className="otp-meta-row">
                <div className="otp-countdown-wrap">
                  <span className="material-symbols-outlined">schedule</span>
                  <span>
                    Expires in{" "}
                    <strong
                      className={timeLeft < 60 ? "timer-urgent" : ""}
                    >
                      {formatTimer(timeLeft)}
                    </strong>
                  </span>
                </div>

                <div className="otp-resend-wrap">
                  {resendCooldown > 0 ? (
                    <span className="otp-resend-disabled">
                      Resend in <strong>{resendCooldown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="otp-resend-action-btn"
                      onClick={handleResend}
                      disabled={isResending || isLocked}
                    >
                      {isResending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="otp-actions-column">
                {!isLocked ? (
                  <button
                    type="submit"
                    className="purple-submit-btn otp-submit-btn"
                    disabled={
                      isSubmitting ||
                      digits.some((d) => d === "") ||
                      timeLeft <= 0
                    }
                  >
                    <span>
                      {isSubmitting ? "Verifying Code..." : "Verify & Sign In"}
                    </span>
                    {!isSubmitting && (
                      <span className="material-symbols-outlined btn-arrow">
                        arrow_forward
                      </span>
                    )}
                    {isSubmitting && <span className="purple-spinner" />}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="purple-submit-btn otp-submit-btn"
                    onClick={handleCancel}
                  >
                    <span>Return to Sign In</span>
                    <span className="material-symbols-outlined btn-arrow">
                      login
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  className="otp-back-link-btn"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  <span>Sign in with a different account</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default VerifyOtpPage;
