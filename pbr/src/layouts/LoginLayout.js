import React, { Component } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { Grid, Box, Grow, Paper } from "@mui/material";
import backgroundImage from "../images/CVM-Building.jpeg";

const useStyles = makeStyles((theme) =>
  createStyles({
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
      backgroundColor: "red",
      height: "100%",
      textAlign: "center",
      width: "100%",
    },
    loginGrid: {
      overflow: "hidden",
    },
    card: {
      overflowY: "auto",
      overflowX: "hidden",
      maxHeight: "100vh",
    },
  })
);

export default function LoginBackdrop(props) {
  const classes = useStyles();

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
          <Paper
            elevation={12}
            className={classes.card}
            sx={{
              raised: true,
              maxWidth: "sm",
              textAlign: "center",
              padding: 5,
            }}
          >
            {props.children}
          </Paper>
        </Grow>
      </Grid>
    </>
  );
}
