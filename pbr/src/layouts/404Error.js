import React from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles, createStyles } from "@mui/styles";
import AuthConsumer from "../services/useAuth";

import image1 from "../images/404images/birds.jpg";
import image2 from "../images/404images/cows.jpg";
import image3 from "../images/404images/grassy.jpg";
import image4 from "../images/404images/windvane.jpg";
import egg from "../images/404images/egg.svg";
import brickLogoNCSU from "../images/NCSU Brick Logo.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Grid, Grow, Typography, Fab, Box } from "@mui/material";

const bgImages = [image1, image2, image3, image4];

function randomIntFromInterval(min, max) {
  // min and max included
  const num = Math.floor(Math.random() * (max - min + 1) + min);
  return num;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    loginBackdrop: {
      backgroundImage: `url("${
        bgImages[randomIntFromInterval(0, bgImages.length - 1)]
      }")`,
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
    returnButton: {
      position: "absolute",
      top: "20px",
    },
    ncsuBrickLogo: {
      width: "250px",
      position: "absolute",
      bottom: "20px",
      [theme.breakpoints.down("md")]: {
        bottom: "45px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "180px",
      },
      zIndex: 2,
    },
    credits: {
      position: "absolute",
      bottom: "20px",
      left: "20px",
      color: "white",
      fontSize: "10px",
      [theme.breakpoints.down("sm")]: {
        left: "inherit",
      },
    },
    egg: {
      height: "300px",
      width: "auto",
      position: "relative",
      transition: "all .6s",
      top: "0",
      marginTop: "95px",
      webkitFilter: "drop-shadow( 0px 0px 6px rgba(0, 0, 0, .7))",
      filter: "drop-shadow( 0px 0px 6px rgba(0, 0, 0, .7))",
      [theme.breakpoints.down("md")]: {
        height: "220px",
      },
      [theme.breakpoints.down("sm")]: {
        height: "130px",
      },
    },
    errorContainer: {
      textAlign: "center",
      padding: "20px",
      webkitFilter: "drop-shadow( 0px 0px 6px rgba(0, 0, 0, .7))",
      filter: "drop-shadow( 0px 0px 6px rgba(0, 0, 0, .7))",
    },
    errorNumber: {
      color: "white",
      fontSize: "16rem !IMPORTANT",
      [theme.breakpoints.down("md")]: {
        fontSize: "7rem !IMPORTANT",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "5rem !IMPORTANT",
      },
    },
    errorMessage: {
      color: "white",
      fontSize: "6rem !IMPORTANT",
      [theme.breakpoints.down("md")]: {
        fontSize: "5rem !IMPORTANT",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "3rem !IMPORTANT",
      },
    },
    root: {
      backgroundColor: theme.palette.background.default,
      height: "80%",
      textAlign: "center",
      width: "100%",
      transition: "all .6s",
    },
  })
);

export default function Error404() {
  const classes = useStyles();
  const { authenticated } = AuthConsumer();

  const navigate = useNavigate();
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
          <Grid
            container
            direction="column"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Box className={classes.errorContainer}>
              <Typography
                variant="h1"
                align="center"
                className={classes.errorNumber}
              >
                404
              </Typography>
              <Typography
                variant="h2"
                align="center"
                className={classes.errorMessage}
              >
                Page Not Found
              </Typography>
            </Box>
            {authenticated && (
              <Fab
                className={classes.returnButton}
                variant="extended"
                color="primary"
                aria-label="Return"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowBackIcon sx={{ mr: 1 }} />
                Go Back
              </Fab>
            )}
            {!authenticated && (
              <Fab
                className={classes.returnButton}
                variant="extended"
                color="primary"
                aria-label="Return"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <ArrowBackIcon sx={{ mr: 1 }} />
                Go Back
              </Fab>
            )}
            <img className={classes.egg} src={egg} alt="Cracked Eggs" />
          </Grid>
        </Grow>

        <img
          className={classes.ncsuBrickLogo}
          src={brickLogoNCSU}
          alt="NCSU Brick Logo"
        />
        <a
          className={classes.credits}
          href="https://www.freepik.com/vectors/birthday"
        >
          Egg vector created by pch.vector - www.freepik.com
        </a>
      </Grid>
    </>
  );
}
