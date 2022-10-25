import React from "react";
import { useTheme } from "@mui/material/styles";

import { Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useDataView from "../../../services/useDataView";
import useAuth from "../../../services/useAuth";

const useStyles = makeStyles({
  successMsg: {
    textAlign: "center",
  },
});

export default function Error() {
  const classes = useStyles();
  const { error } = useDataView();
  const { user } = useAuth();
  useTheme();

  let message =
    "Your Sample Entry was Saved Successfully";

  return (
    <>
      <Typography variant="h3" className={classes.successMsg}>
        {message}
      </Typography>
    </>
  );
}
