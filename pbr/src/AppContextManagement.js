import React, { useState } from "react";

export const AppContext = React.createContext({
  authenticated: false,
  setAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

export const AppContextProvider = (props) => {
  const setAuthenticated = (boolean) => {
    setState({ ...state, boolean: boolean });
  };
  const setUser = (user) => {
    setState({ ...state, user: user });
  };

  const initState = {
    authenticated: false,
    setAuthenticated: setAuthenticated,
    user: null,
    setUser: setUser,
  };

  const [state, setState] = useState(initState);

  return (
    <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
  );
};
