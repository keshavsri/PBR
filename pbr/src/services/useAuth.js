// Authentication Pattern from https://ui.dev/react-router-protected-routes-authentication/

import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
const AuthContext = React.createContext();

export function useAuth() {
  const [user, setUser] = React.useState(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const [recredentialize, setRecredentialize] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    fetch("/api/user/me", {
      method: "GET",
    })
      .then(handleRefreshResponse)
      .then((user) => {
        console.log(user);
        setLoadingAuth(false);
        setRecredentialize(false);
        setUser(user);
        setRecredentialize(false);
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
          setRecredentialize(false);
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
          setUser(null);
          rej(err);
        });
      });
  };

  function handleRefreshResponse(response) {
    if (!response.ok) {
      if ([419].indexOf(response.status) !== -1) {
        // Token expired. We need to reprompt to login.
        console.log("Token expired. We need to reprompt to login.");
        setRecredentialize(true);
        setLoadingAuth(false);
        return Promise.reject();
      }
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        console.log("User is unauthorized. Forbid!.");
        logout();
        setLoadingAuth(false);
        return Promise.reject();
      }
    } else {
      console.log("User is valid. Return.");
      return response.json();
    }
  }

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
    recredentialize,
    setRecredentialize,
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(AuthContext);
}
