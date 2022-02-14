import React from "react";
import { ThemeProvider } from "@mui/material";

import "./App.css";
import { useRoutes } from "react-router-dom";
import routes from "./routes";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import GlobalStyles from "./layouts/GlobalStyles";
import { themes } from "./theme";
import { AuthProvider } from "./useAuth";

function App() {
  React.useEffect(() => {}, []);

  const routing = useRoutes(routes);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthProvider>
        <ThemeProvider theme={themes.mainTheme}>
          <GlobalStyles />
          {routing}
        </ThemeProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
