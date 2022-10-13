import React from "react";
import { useTheme } from "@mui/material/styles";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
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
    height: 500,
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
 

export default function AcceptOrRejectModal(props) {

   const classes = useStyles();
   const [modalStyle] = React.useState(getModalStyle);
   useTheme();

  const {
    
    selectedSamples,
    savedToPending,
    AcceptRejectModalVisibility,
    setAcceptRejectModalVisibility
  } = props;

const onSubmit = async () => {
  await savedToPending();
  setAcceptRejectModalVisibility(false);
};


console.log("from the modal here are the selected samples", selectedSamples);


  return (
    <Modal
      open={AcceptRejectModalVisibility}
      onClose={() => setAcceptRejectModalVisibility(false)}
      aria-labelledby="Accept or Reject Modal"
      aria-describedby="Modal Used to accept or reject a  Pending sample"
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <Grid container spacing={2} sx={{ padding: "15px" }}>
            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">
                Accept or Reject the selected sample
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Selected sample 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>

                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        onSubmit();
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Sample eselected 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>

                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        onSubmit();
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                  
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                onClick={() => {
                  setAcceptRejectModalVisibility(false);
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Card>
      </div>
    </Modal>
  );




}





