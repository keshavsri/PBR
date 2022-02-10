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
import { AppContextProvider, AppContext } from "./AppContextManagement";

function App() {
  const routing = useRoutes(routes);
  const context = useContext(AppContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!context.authenticated) {
      navigate("/login");
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppContextProvider>
        <ThemeProvider theme={themes.mainTheme}>
          <GlobalStyles />
          {routing}
        </ThemeProvider>
      </AppContextProvider>
    </LocalizationProvider>
  );
}

export default App;
export { AppContext };
