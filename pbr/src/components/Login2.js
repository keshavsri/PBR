import React from "react";
import backgroundImage from "../images/CVM-Building.jpeg";
import {
  TextField,
  Button,
  Box,
  Container,
  Snackbar,
  Typography,
} from "@mui/material";
import loginStyles from "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login2(props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displaySnackbar, setSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const { logout, authenticate } = props;

  React.useEffect(() => {
    logout();
  }, []);

  // Handles snackbar close behaviors
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar(false);
  };
  const history = useNavigate();

  const submitLogin = () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((response) => {
      if (response.status == 400) {
        setSnackbarMessage("Incorrect login credentials!");
        setSnackbar(true);
      } else if (response.status == 200) {
        authenticate();
        history.push("/dashboard");
      } else {
        setSnackbarMessage("Server Error! Please reload the page.");
        setSnackbar(true);
      }
    });
  };

  return (
    <Container sx={{ padding: 3 }}>
      <Box
        component="form"
        sx={{
          width: "40%",
          margin: "auto",
          "& .MuiTextField-root": { m: 1, width: "100%" },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Please log in to view your account!
        </Typography>
        <TextField
          required
          variant="standard"
          label="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <TextField
          required
          variant="standard"
          type="password"
          label="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </Box>
      <Box
        sx={{
          width: "40%",
          margin: "auto",
          display: "flex",
        }}
      >
        <Button component={Link} to="/new-user">
          New User
        </Button>
        <Box sx={{ flex: [1, 1, "auto"] }}></Box>
        <Button onClick={submitLogin}>Login</Button>
      </Box>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={displaySnackbar}
        onClose={handleSnackbarClose}
        autoHideDuration={5000}
        message={snackbarMessage}
      />
    </Container>
  );
}
