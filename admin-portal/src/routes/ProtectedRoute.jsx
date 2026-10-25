import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, clearCurrentUser, setCurrentUser } from "../features/Authentication/authState";
import { fetchMe } from "../features/Authentication/authApi";

function ProtectedRoute({ children }) {
  const isAuthed = isAuthenticated();

  useEffect(() => {
    if (!isAuthed) return;

    let isMounted = true;

    const checkHealth = () => {
      fetchMe()
        .then((user) => {
          if (isMounted) {
            if (user.role !== "admin") {
              clearCurrentUser();
              window.location.href = "/login";
            } else {
              setCurrentUser(user);
            }
          }
        })
        .catch((err) => {
          // Only force logout if the backend explicitly rejected authentication with 401 or 403
          if (err.status === 401 || err.status === 403) {
            if (isMounted) {
              clearCurrentUser();
              window.location.href = "/login";
            }
          }
        });
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthed]);

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
