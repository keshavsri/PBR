import React from "react";
import { useTheme } from "@mui/material/styles";

import { Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useDataView from "../../services/useDataView";

const useStyles = makeStyles({});

export default function Error() {
  const classes = useStyles();
  const { error } = useDataView();
  useTheme();

  return (
    <>
      <Typography variant="h3">ERROR: {error.title}</Typography>
      <Typography paragraph>{error.description}</Typography>
    </>
  );
}
