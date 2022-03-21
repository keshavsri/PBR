import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let mainTheme = createTheme({
  components: {
    MuiToolbar: {
      styleOverrides: {
        MuiButtonBase: {
          styleOverrides: {
            root: {
              borderRadius: "333px",
            },
          },
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          // Match 24px = 3 * 2 + 1.125 * 16
          boxSizing: "content-box",
          padding: 3,
          fontSize: "1.125rem",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          height: "42px",
        },
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
    secondaryLight: {
      main: "#EEEEEE",
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
    lighttext: {
      main: "rgba(0, 0, 0, 0.50)",
    },
    background: {
      default: "rgb(40, 40, 40)",
    },
  },
  typography: {
    button: {
      fontSize: "1.15rem", // works
      fontWeight: 600,
      textTransform: "none",
    },
    fontFamily: [
      "Univers",
      "UniversCondensed",
      "Open Sans",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2.7rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "2.4rem",
      fontWeight: 400,
    },
  },
});

mainTheme = responsiveFontSizes(mainTheme);

export const themes = {
  mainTheme,
};
