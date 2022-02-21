// Authentication Pattern from https://ui.dev/react-router-protected-routes-authentication/

import * as React from "react";
import Cookies from "js-cookie";

const AuthContext = React.createContext();

function useAuth() {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  function login(email, password, bypass = false) {
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
          bypass: bypass,
        }),
      })
        .then(handleResponse)
        .then((response) => {
          console.log(response);
          setAuthenticated(true);
          setUser(response.user);
          resolve("Success. Logging in.");
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function logout() {
    console.log("useAuth(): Logging out.");

    return new Promise((res) => {
      setAuthenticated(false);
      setUser(null);
      res();
    });
  }

  function handleResponse(response) {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        if ([401, 403].indexOf(response.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          logout();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }

      return data;
    });
  }

  return {
    authenticated,
    user,
    login,
    logout,
    handleResponse,
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(AuthContext);
}
