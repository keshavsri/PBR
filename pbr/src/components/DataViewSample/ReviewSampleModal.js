import React from "react";
import { useTheme } from "@mui/material/styles";
import {states} from '../../models/enums'


import {
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Alert,
  Modal,
  MenuItem
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import useAuth from "../../services/useAuth";


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
      height: 500,
      width: 1000,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
}));



export default function ReviewSampleModal({
    openReviewSampleModal,
    setOpenReviewSampleModal,
    selectedSamples,
  }) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    useTheme();
    const { checkResponseAuth } = useAuth();

    

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


                {/* Map through all selected samples: For each sample, PUT call based on accept/reject, */}

                <Grid item xs={12} sm={2}>
                <Button
                    onClick={() => {
                        setOpenReviewSampleModal(false);
                    }}
                >
                    Cancel
                </Button>
                </Grid>

                <Grid item xs={12} sm={2}>
                <Button
                    variant="contained"
                    onClick={() => {
                        //onSubmit();
                    }}
                >
                    Submit
                </Button>
                </Grid>

            </Grid>
          </Card>
        </div>
      </Modal>

        
    )
}