import React from "react";
import { ThemeProvider } from "@mui/material";

import "./App.css";
import { useRoutes } from "react-router-dom";

import routes from "./routes";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import GlobalStyles from "./layouts/GlobalStyles";
import { mainTheme } from "./theme";

import useAuth, { AuthProvider, AuthConsumer } from "./services/useAuth";

import { Box, CircularProgress, Grid } from "@mui/material";

function App() {
  const routing = useRoutes(routes);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={mainTheme}>
        <AuthProvider>
          <>
            <GlobalStyles />
            <AuthConsumer>
              {(context) => {
                if (context.loadingAuth) {
                  return (
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
                          sx={{
                            width: "100px !IMPORTANT",
                            height: "100px !IMPORTANT",
                          }}
                        />
                      </Box>
                    </Grid>
                  );
                } else {
                  return <>{routing}</>;
                }
              }}
            </AuthConsumer>
          </>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
