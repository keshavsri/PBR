import React from "react";
import { ThemeProvider } from "@mui/material";

import "./App.css";
import { useRoutes } from "react-router-dom";

import routes from "./routes";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import GlobalStyles from "./layouts/GlobalStyles";
import { themes } from "./theme";
import { AuthProvider, useAuth } from "./services/useAuth";

import { Box, CircularProgress, Grid } from "@mui/material";

function App() {
  const routing = useRoutes(routes);

  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <ThemeProvider theme={themes.mainTheme}>
            <GlobalStyles />
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "100vh", backgroundColor: "white" }}
            >
              <Box sx={{ display: "flex" }}>
                <CircularProgress
                  color="primary"
                  sx={{ width: "100px !IMPORTANT", height: "100px !IMPORTANT" }}
                />
              </Box>
            </Grid>
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    );
  }

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
