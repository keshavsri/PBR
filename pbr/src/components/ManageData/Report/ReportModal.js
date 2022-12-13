import * as React from "react";

import {
  Modal, Typography, Card, TextField, MenuItem, Button, IconButton, Popover, Grid
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import useAuth from "../../../services/useAuth";

import InfoIcon from '@mui/icons-material/Info';

import ReportPDF from "./ReportPDF";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { saveAs } from 'file-saver';

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    overflow: "scroll",
    transform: `translate(-${top}%, -${left}%)`,
    position: "absolute",
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
    height: 300,
    width: 700,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "1em",
    "overflow-y": "hidden",
  },
}));

export default function ReportModal(props) {
  const {
    visibility,
    setVisibility,
    selected
  } = props;

  const { checkResponseAuth, user } = useAuth();
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  useTheme();

  const [methodEnum, setMethodEnum] = React.useState({});
  const [selectedMethod, setSelectedMethod] = React.useState();
  const [sampleHealthyRangeData, setSampleHealthyRangeData] = React.useState([]);

  React.useEffect(() => {
    getMethods();
  }, [])

  React.useEffect(async () => {
    if (sampleHealthyRangeData.length === selected.length && visibility) {
      const doc = <ReportPDF payload={sampleHealthyRangeData}/>;
      const asPdf = pdf([]);
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      saveAs(blob, 'report.pdf');
    }
  }, [sampleHealthyRangeData])

  const getMethods = async () => {
    await fetch(`api/enum/healthy-range-method`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setMethodEnum(data);
      });
  }

  const getSampleHealthyRangeData = () => {
    setSampleHealthyRangeData([]);
    let urls = []
    const responses = [];
    selected.forEach((id) => {
      urls.push(`/api/healthy-range/report/${id}?method=${selectedMethod}`)
    })
    console.log(urls)
    for (let i = 0; i < urls.length; i++) {
      fetch(urls[i], { 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setSampleHealthyRangeData(sampleHealthyRangeData => [...sampleHealthyRangeData, data])
      })
    }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);

  const openInfoPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeInfoPopover = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? 'simple-popover' : undefined;

  return (
    <Modal
        open={visibility}
        title="Report"
        subtitle="Generate"
        onClose={() => {
          setVisibility(false);
          setSelectedMethod(null);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
         <Grid container sx={{ pb: 2}}>
            <Grid item>
              <Typography variant="h4" inline>{"\n\n"}</Typography>
            </Grid>
          </Grid>
          <Card>
            <Grid container sx={{ pb: 2}}>
              <Grid item>
                <Typography variant="h3" inline>Generate a Report</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-describedby={popoverId}
                  variant="contained"
                  onClick={openInfoPopover}
                >
                  <InfoIcon />
                </IconButton>
                <Popover
                  id={popoverId}
                  open={popoverOpen}
                  anchorEl={anchorEl}
                  onClose={closeInfoPopover}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div>
                    <Typography sx={{ pt: 2, pl: 2, pr: 2, pb: 1 }} variant="h6">Reports are generated using the healthy ranges that match the criteria (Species, Age Group, Gender, Cartridge) of the sample.</Typography>
                    <Typography sx={{ pl: 2, pr: 2 }} variant="h5">Statistical Method</Typography>
                    <Typography sx={{ pl: 2, pr: 2, fontStyle: 'italic' }}>The statistical method used to calculate the ranges.</Typography>
                    <Typography sx={{ pl: 2, pr: 2, pb: 2 }}>Standard: 95% reference interval. Assumes data distribussion is Gaussian.</Typography>

                  </div>
                </Popover>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              select
              label="Statistical Method"
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
            >
              {Object.keys(methodEnum).map((key, index) => {
                return <MenuItem key={index} value={key}>{methodEnum[key]}</MenuItem>
              })}
            </TextField>

            <Button
              variant="contained"
              color="secondary"
              style={{ width: 275, marginTop: 10, marginBottom: 10 }}
              sx={{ ml: 1 }}
              disabled={!selectedMethod}
              onClick={async() => {
                getSampleHealthyRangeData();
              }}
            >
              Download Report
            </Button>

          </Card>
        </div>

    </Modal>
  )
}