import { createTheme } from "@mui/system";

export const theme = createTheme({
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 8,
      },
    },
  },
  palette: {
    type: "light",
    primary: {
      main: "#CC0000",
    },
    secondary: {
      main: "#2E3B52",
    },
    warning: {
      main: "#FFC700",
    },
    success: {
      main: "#25B900",
    },
    error: {
      main: "#ff1000",
    },
    text: {
      secondary: "#2E3B52",
    },
  },
  typography: {
    h1: {
      fontSize: "3.2rem",
      fontWeight: 900,
    },
    h2: {
      fontSize: "3rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "2.7rem",
      fontWeight: 400,
    },
    fontFamily: "Open Sans",
  },
});
