import React, { Component } from "react";
import { withStyles } from "@mui/styles";
import { Outlet } from "react-router-dom";

import { Grid, Box, Grow } from "@mui/material";
import backgroundImage from "../images/CVM-Building.jpeg";

const useStyles = (theme) => ({
  loginBackdrop: {
    backgroundImage: `url("${backgroundImage}")`,
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
          alignItems="center"
          sx={{ height: "100%" }}
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
