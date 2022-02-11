import React, { Component } from "react";
import { withStyles } from "@mui/styles";
import { Grid, Box, Grow } from "@mui/material";
import backgroundImage from "../images/CVM-Building.jpeg";

const useStyles = (theme) => ({
  loginBackdrop: {
    backgroundImage: `url("${backgroundImage}") !important`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100%",
    filter: "blur(8px)",
    webkitFilter: "blur(8px)",
    position: "absolute",
    left: "0",
    top: "0",
    zIndex: "-1",
    transition: "all .6s",
  },
  root: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
    textAlign: "center",
    width: "100%",
  },
  loginGrid: {
    overflow: "scroll",
    [theme.breakpoints.down("sm")]: {
      overflow: "inherit",
    },
  },
});

class LoginBackdrop extends Component {
  render() {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.loginBackdrop}></div>
        <Grid
          container
          direction="row"
          justifyContent="center"
          className={classes.loginGrid}
          alignItems="center"
          sx={{ height: "100vh" }}
        >
          <Grow in={true}>
            <Box>{this.props.children}</Box>
          </Grow>
        </Grid>
      </>
    );
  }
}

export default withStyles(useStyles)(LoginBackdrop);
