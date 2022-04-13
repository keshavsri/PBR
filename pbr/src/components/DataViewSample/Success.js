import React from "react";
import { useTheme } from "@mui/material/styles";

import { Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AuthConsumer from "../../services/useAuth";
import DataViewConsumer from "../../services/useDataView";

const useStyles = makeStyles({
  successMsg: {
    textAlign: "center",
  },
});

export default function Error() {
  const classes = useStyles();
  const { error } = DataViewConsumer();
  const { user } = AuthConsumer();
  useTheme();

  let message =
    "Your Sample Entry was Submitted Successfully and is Pending Validation from a Supervisor.";

  return (
    <>
      <Typography variant="h3" className={classes.successMsg}>
        {message}
      </Typography>
    </>
  );
}
