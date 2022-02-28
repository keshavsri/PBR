// Authentication Pattern from https://ui.dev/react-router-protected-routes-authentication/

import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
const AuthContext = React.createContext();

export function useAuth() {
  const [user, setUser] = React.useState(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    fetch("/api/user/me", {
      method: "GET",
    })
      .then(handleResponse)
      .then((user) => {
        if (user) {
          setUser(user);
          setLoadingAuth(false);
        } else {
          setUser(null);
          setLoadingAuth(false);
        }
      })
      .catch((err) => {
        setUser(null);
        setLoadingAuth(false);
      });
  }, []);

  let login = async (email, password) => {
    console.log("useAuth(): Logging in.");

    return new Promise((resolve, reject) => {
      fetch("/api/user/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then(handleResponse)
        .then((user) => {
          setUser(user);
          resolve("Success. Logging in.");
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  let logout = async () => {
    console.log("useAuth(): Logging out.");
    fetch("/api/user/logout", {
      method: "POST",
    })
      .then(() => {
        return new Promise((res) => {
          setUser(null);
          res();
        });
      })
      .catch((err) => {
        return new Promise((rej) => {
          rej(err);
        });
      });
  };

  function handleResponse(response) {
    if (!response.ok) {
      let error = "Try again.";
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
        error = "Invalid Credentials.";
      }
      return Promise.reject(error);
    }
    return response.json();
  }

  return {
    user,
    setUser,
    login,
    logout,
    loadingAuth,
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(AuthContext);
}
