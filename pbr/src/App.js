import React, { useContext } from "react";
import { ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./App.css";
import { useRoutes } from "react-router-dom";
import routes from "./routes";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import GlobalStyles from "./layouts/GlobalStyles";
import { themes } from "./theme";

const defaultState = {
  authenticated: false,
  loggedInUser: {
    firstname: "",
    lastname: "",
  },
};

const AppContext = React.createContext(defaultState);

function App() {
  const routing = useRoutes(routes);
  const context = useContext(AppContext);
  console.log("Context", context);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!context.authenticated) {
      navigate("/login");
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppContext.Provider
        value={{
          loggedInUser: context.loggedInUser,
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
export { AppContext };
