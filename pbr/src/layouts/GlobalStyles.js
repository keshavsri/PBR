import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    "@global": {
      "*": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      },
      html: {
        fontFamily: '"Open-Sans", "Helvetica", "Arial", sans-serif',
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
      },
      body: {
        backgroundColor: "rgb(45, 45, 45)",
        minHeight: "-webkit-fill-available",
      },
      a: {
        color: theme.palette.primary.main,
        "&:hover": {
          color: theme.palette.primary.dark,
        },
        textDecoration: "none",
      },
      // "#root": {
      //   height: "100%",
      //   width: "100%",
      // },
    },
  })
);

const GlobalStyles = () => {
  useStyles();
  return null;
};

export default GlobalStyles;
