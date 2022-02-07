import React, { useContext } from "react";
import { ThemeProvider } from "@mui/material";

import "./App.css";
import { useRoutes } from "react-router-dom";
import routes from "./routes";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import GlobalStyles from "./layouts/GlobalStyles";
import Login from "./components/Login";
import { themes } from "./theme";

const defaultState = {
  loggedInUser: null,
};

const AppContext = React.createContext(defaultState);

function App() {
  const routing = useRoutes(routes);
  const context = useContext(AppContext);
  context.loggedInUser = null;
  console.log(themes);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppContext.Provider
        value={{
          loggedInUser: context.partner,
        }}
      >
        <ThemeProvider theme={themes.mainTheme}>
          <GlobalStyles />
          {routing}
        </ThemeProvider>
      </AppContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
