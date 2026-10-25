import apiClient from "../../lib/apiClient";

/**
 * Login with email + password.
 * Stores tokens in localStorage and returns { access, refresh, user }.
 * Throws an error with `.status` set on non-2xx responses.
 */
export async function login(credentials) {
  try {
    const { data } = await apiClient.post("/api/v1/auth/login/", credentials);

    // Persist tokens so the request interceptor can attach them
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    return data; // { access, refresh, user }
  } catch (error) {
    const status = error.response?.status ?? 0;
    const detail = error.response?.data?.detail ?? "Unable to sign in.";

    const err = new Error(detail);
    err.status = status;
    throw err;
  }
}

/**
 * Verify 6-digit OTP code for Admin 2FA.
 * Calls /api/v1/auth/admin/verify-otp/ with { temp_token, otp }.
 * Stores access & refresh tokens on success and returns { access, refresh, user }.
 */
export async function verifyOtp({ temp_token, otp }) {
  try {
    const { data } = await apiClient.post("/api/v1/auth/admin/verify-otp/", {
      temp_token,
      otp,
    });

    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    return data;
  } catch (error) {
    const status = error.response?.status ?? 0;
    const detail = error.response?.data?.detail ?? "Verification failed.";
    const code = error.response?.data?.code;
    const attemptsRemaining = error.response?.data?.attempts_remaining;

    const err = new Error(detail);
    err.status = status;
    err.code = code;
    err.attemptsRemaining = attemptsRemaining;
    throw err;
  }
}

/**
 * Request a fresh 6-digit OTP code for Admin 2FA.
 * Calls /api/v1/auth/admin/resend-otp/ with { temp_token }.
 */
export async function resendOtp({ temp_token }) {
  try {
    const { data } = await apiClient.post("/api/v1/auth/admin/resend-otp/", {
      temp_token,
    });
    return data;
  } catch (error) {
    const status = error.response?.status ?? 0;
    const detail = error.response?.data?.detail ?? "Unable to resend verification code.";
    const code = error.response?.data?.code;
    const retryAfter = error.response?.data?.retry_after_seconds;

    const err = new Error(detail);
    err.status = status;
    err.code = code;
    err.retryAfter = retryAfter;
    throw err;
  }
}

/**
 * Logout – blacklists the refresh token on the server, then clears storage.
 */
export async function logout() {
  const refresh = localStorage.getItem("refresh_token");
  if (refresh) {
    try {
      await apiClient.post("/api/v1/auth/logout/", { refresh });
    } catch {
      // Swallow – we still clear local state
    }
  }
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

/**
 * Fetch the current user's profile.
 */
export async function fetchMe() {
  const { data } = await apiClient.get("/api/v1/auth/me/");
  return data;
}

/**
 * Request password reset link for Admin account.
 */
export async function forgotPassword(email) {
  const { data } = await apiClient.post("/api/v1/admin/forgot-password/", { email });
  return data;
}

/**
 * Reset Admin password using token and uid.
 */
export async function resetPassword(payload) {
  const { data } = await apiClient.post("/api/v1/admin/reset-password/", payload);
  return data;
}

