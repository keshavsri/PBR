import * as React from "react";
import { useTheme } from "@mui/material/styles";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  Alert,
  Modal,
  MenuItem,
  Select,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

function getModalStyle() {
  const top = 55;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,

    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    height: 800,
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "1em",
    "overflow-y": "auto",
  },
}));

export default function AddSample(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  useTheme();

  const {
    organization,
    organizations,
    addSampleVisibility,
    setSampleVisibility,
  } = props;

  return (
    <Modal
      open={addSampleVisibility}
      onClose={() => setSampleVisibility(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Card>
        <Grid container spacing={2} sx={{ padding: "15px" }}>
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h4">
              Submit Samples For Review.
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Modal>
  );
}
