/**
 * Auth state – persisted in localStorage so the user session survives page refreshes.
 */

const USER_KEY = "admin_auth_user";

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return (
    getCurrentUser() !== null &&
    localStorage.getItem("access_token") !== null
  );
}

export function clearCurrentUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
