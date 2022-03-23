import React from "react";
import { useTheme } from "@mui/material/styles";

import { Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DataViewConsumer from "../../services/useDataView";

const useStyles = makeStyles({});

export default function Error() {
  const classes = useStyles();
  const { error } = DataViewConsumer();
  useTheme();

  return (
    <>
      <Typography variant="h3">ERROR: {error.title}</Typography>
      <Typography paragraph>{error.description}</Typography>
    </>
  );
}
