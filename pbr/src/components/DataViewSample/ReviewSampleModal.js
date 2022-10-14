import React from "react";
import { useTheme } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Typography,
  Grid,
  Button,
  Card,
  Modal,
  TextField,
  Box
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

const useStyles = makeStyles(theme => ({
  modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  paper: {
      position: 'absolute',
      height: 800,
      width: 1000,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: "1em",
      overflowY: "auto",
  },
}));



export default function ReviewSampleModal({
    openReviewSampleModal,
    setOpenReviewSampleModal,
    pendingSamples,
    setPendingSamples,
    acceptSample,
    rejectSample,
    turnPendingFilterOff
  }) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    useTheme();

    const removeFromPending = (sample) => {
      let newSelected = pendingSamples.filter((s) => s !== sample);
      setPendingSamples(newSelected);
      if (newSelected.length === 0) {
        setOpenReviewSampleModal(false);
      }
  
  };

  const IstatORVescan = (sample) => {
    if (sample.measurement_values.length === 13){
      return (
        <Typography gutterBottom variant="body1">
          Istat Data:
        </Typography>
      );
    } else if (sample.measurement_values.length === 17) {
      return (
        <Typography gutterBottom variant="body1">
          VetScan Data:
        </Typography>
      );
    }
  };

    const onAcceptSample = async (id) => {
      await acceptSample(id);
    };

    const onRejectSample = async (id) => {
      await rejectSample(id);
    };

    const fillMachineData = (sample) => {
      console.log("filling machine data")
      return sample.measurement_values.map((measurement) =>(
        <Grid item xs={12} sm={6}>
          <TextField label={measurement.measurement.measurementtype.abbreviation} value={measurement.value} disabled />
        </Grid>
      ));
    };

    const listPendingSamples = () => {
      return pendingSamples.map((sample) => (
       
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="button"> Sample ID: {sample.id}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              General{" "}
            </Typography>
          </Grid>

          <br />

          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              direction="row"
              alignItems="center"
              spacing={3}
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Organization"
                  value={sample.organization.name}
                  disabled
                />
              </Grid>

              <Grid item xs>
                <TextField label="Flock" value={sample.flock.name} disabled />
              </Grid>

              <Grid item xs>
                <TextField
                  label="Source"
                  value={sample.organization.sources[0].name}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Species"
                  value={sample.flock.species}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Production Type"
                  value={sample.flock.production_type}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Strain"
                  value={sample.flock.strain}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  value={sample.flock.gender}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  value={sample.flock_age + " " + sample.flock_age_unit}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sample Type"
                  value={sample.sample_type}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>

          <br />

          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              Machine Data{" "}
            </Typography>
            { (sample.measurement_values.length === 13 ||
            sample.measurement_values.length == 17) ? IstatORVescan(sample) : 
              <Typography gutterBottom variant="button">
                No data is associated with the sample
              </Typography> 
            }
            <br/><br/><br/>
          </Grid>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row" alignItems="center" spacing={3}>
                {fillMachineData(sample)}
            </Grid>
          </Box>

          <br/><br/>


          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              Comments{" "}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label="Comments"
              value={sample.comments}
              disabled
            />
          </Grid>

          <Grid container spacing={2} sx={{padding: '15px'}}>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={() => {
                  onAcceptSample(sample.id);
                  turnPendingFilterOff();
                  removeFromPending(sample);
                }}
              >
                Accept
              </Button>
            </Grid>
            <Grid item xs={12} sm={2} >
              <Button 
                variant="contained"
                onClick={() => {
                  onRejectSample(sample.id);
                  turnPendingFilterOff();
                  removeFromPending(sample);
                }}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      ));
    };


    return (

      <Modal
        aria-labelledby="Review Sample Modal"
        aria-describedby="Modal used for reviewing a sample and accepting/rejecting it"
        open={openReviewSampleModal}
        onClose={() => {
            setOpenReviewSampleModal(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card>
            <Grid container spacing={2} sx={{padding: '15px'}}>

                <Grid item xs={12} sm={12}>
                  <Typography gutterBottom variant="h4">Review Sample</Typography>
                </Grid>


              <Grid item xs={12} sm={12}>
                {listPendingSamples()}
              </Grid>


              <Grid item xs={12} sm={2}>
                <Button
                    onClick={() => {
                        setOpenReviewSampleModal(false);
                    }}
                >
                    Close
                </Button>
              </Grid>

            </Grid>
          </Card>
        </div>
      </Modal>

        
    )
}