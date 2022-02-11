// Authentication Pattern from https://ui.dev/react-router-protected-routes-authentication/

import * as React from "react";

const AuthContext = React.createContext();

function useAuth() {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  return {
    authenticated,
    login() {
      console.log("useAuth(): Logging in.");
      return new Promise((res) => {
        setAuthenticated(true);
        setUser({
          firstname: "Test",
          lastName: "User",
          email: "testuser@ncsu.edu",
        });
        res();
      });
    },
    user,
    logout() {
      console.log("useAuth(): Logging out.");

      return new Promise((res) => {
        setAuthenticated(false);
        setUser(null);
        res();
      });
    },
  };
}

export function AuthProvider({ children }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AuthConsumer() {
  return React.useContext(AuthContext);
}
