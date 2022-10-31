import * as React from "react";

import {
  Button,
  Stack,
  Box,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Typography,
  Card,
  Modal,
  Autocomplete,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import PrevIcon from "@mui/icons-material/ArrowBackIos";
import SubmitIcon from "@mui/icons-material/Publish";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import NewAddSample from "./NewAddSample";

import CustomDialog from "../../CustomDialog";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

import useAuth from "../../../services/useAuth";
import useDataView from "../../../services/useDataView";

function getModalStyle() {
  const top = 55;
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
    height: 800,
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "1em",
    "overflow-y": "auto",
  },
}));

const filter = createFilterOptions();

export default function DataViewSampleModal({ getData }) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  useTheme();

  const {
    sampleModalVisibility,
    sampleModalScreen,
    closeSampleModal,
    samplePrevAction,
    sampleNextAction,
    error,
    setError,
    restartSample,
    timestamp,
    generalDetails,
    machineDetails,
    setSamplePayload,
    setSampleValidationErrors,
    setGeneralDetails,
    sampleType,
    sampleLoading,
    setSampleLoading,
  } = useDataView();

  const { checkResponseAuth, user } = useAuth();

  const [organizations, setOrganizations] = React.useState([]);
  const [flocks, setFlocks] = React.useState([]);
  const [sources, setSources] = React.useState([]);
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);
  const [cartridgeType, setCartridgeType] = React.useState({});
  const [flock, setFlock] = React.useState({});
  const [flockInput, setFlockInput] = React.useState("");
  const [source, setSource] = React.useState({});
  const [organization, setOrganization] = React.useState({});
  const [expanded, setExpanded] = React.useState(true);
  const [errorSubmission, setErrorSubmission] = React.useState(false);

  const getOrganizations = async () => {
    const response = await fetch(`/api/organization/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    console.log(data);
    setOrganizations(data);
    setOrganization(data[0]);
  };

  const getFlocks = async () => {
    await fetch(`/api/flock/source/${source.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("NEW FLOCKS:", data);
        data.forEach((flock) => {
          flock.label = flock.name;
        });
        setFlocks(data);
        setFlock(data[0]);
      });
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const sampleMeasurements = () => {
    return (
      <>
        <Accordion
          defaultExpanded={true}
          expanded={expanded === 1}
          onChange={handleChange(1)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            {" "}
            <Typography variant="button" sx={{ width: "33%", flexShrink: 0 }}>
              Manual Entry:
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {cartridgeType.analytes &&
              cartridgeType.analytes.map((a) => {
                return (
                  <>
                    <TextField label={a.abbreviation} />
                  </>
                );
              })}
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 2} onChange={handleChange(2)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            {" "}
            <Typography variant="button" sx={{ width: "33%", flexShrink: 0 }}>
              Via OCR:
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="body2"> Coming Soon! </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 3} onChange={handleChange(3)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            {" "}
            <Typography variant="button" sx={{ width: "33%", flexShrink: 0 }}>
              Via File Upload:
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="body2"> Coming Soon! </Typography>
          </AccordionDetails>
        </Accordion>
      </>
    );
  };

  const getSources = async () => {
    await fetch(`/api/source/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("NEW Source:", data);
        setSource(data[0]);
        setSources(data);
      });
  };

  const getCartridgeTypes = async () => {
    await fetch(`/api/cartridge-type`)
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setCartridgeTypes(data);
        console.log(data);
        setCartridgeType(data[0]);
      });
  };

  React.useEffect(async () => {
    if (sampleModalVisibility) {
      await getOrganizations();
      await getCartridgeTypes();
      // await getFlocks();
    }
  }, [sampleModalVisibility]);

  React.useEffect(async () => {
    if (sampleModalVisibility) {
      await getSources();
    }
  }, [organization]);

  React.useEffect(async () => {
    if (sampleModalVisibility) {
      await getFlocks();
    }
  }, [source]);

  function handleFlockInputChange(event, value) {
    setFlockInput(value);
  }

  function handleFlockChange(event, value) {
    setFlock(value);
  }

  const onSubmit = async () => {};

  return (
    <>
      <Modal
        open={sampleModalVisibility}
        icon={<SampleIcon />}
        title="Sample"
        subtitle="Add"
        handleClose={closeSampleModal}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card>
            <>
              <InputLabel id="label-select-organization">
                Cartridge Type
              </InputLabel>
              <Select
                labelId="label-select-cartridge-type"
                id="select-cartridge-types"
                value={cartridgeType}
                label="Cartridge Type"
                onChange={(e) => {
                  setCartridgeType(e.target.value);
                }}
              >
                {cartridgeTypes.map((ct) => {
                  return (
                    <MenuItem key={ct.id} value={ct}>
                      {ct.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </>

            <>
              <InputLabel id="label-select-organization">Source</InputLabel>
              <Select
                labelId="label-select-source"
                id="select-sources"
                value={source}
                label="Source"
                onChange={(e) => {
                  setSource(e.target.value);
                }}
              >
                {sources.map((s) => {
                  return (
                    <MenuItem key={s.id} value={s}>
                      {s.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </>

            {user.role === 0 && (
              <>
                <InputLabel id="label-select-organization">
                  Organization
                </InputLabel>
                <Select
                  labelId="label-select-organization"
                  id="select-organization"
                  value={organization}
                  label="Source"
                  onChange={(e) => {
                    setOrganization(e.target.value);
                  }}
                >
                  {organizations.map((org) => {
                    return (
                      <MenuItem key={org.id} value={org}>
                        {org.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </>
            )}

            <InputLabel id="label-select-flock">Flock</InputLabel>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={flocks}
              sx={{ width: 300 }}
              value={flock}
              onChange={handleFlockChange}
              getOptionLabel={(option) => `${option.name}`}
              inputValue={flockInput}
              defaultValue={flock}
              onInputChange={handleFlockInputChange}
              renderInput={(params) => <TextField {...params} />}
            />

            <Grid>
              <Typography> testing accordion </Typography>
              {sampleMeasurements()}
            </Grid>
          </Card>

          <br></br>

          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="secondary"
              // style={{
              //   position: "relative",
              //   bottom: 50,
              // }}
              onClick={() => {
                closeSampleModal();
              }}
            >
              Cancel
            </Button>
          </Grid>
          <br></br>

          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              style={{
                position: "relative",
                // bottom: 50,
                // left: 150,
              }}
              onClick={() => {
                onSubmit();
              }}
            >
              Save
            </Button>
          </Grid>
          <br></br>

          <Grid>
            <br />
            {errorSubmission ? (
              <Typography
                gutterBottom
                variant="button"
                style={{
                  color: "red",
                  position: "relative",
                  // bottom: 50,
                  // left: 280,
                }}
              >
                Sample has missing fields.
              </Typography>
            ) : null}
          </Grid>
        </div>
      </Modal>
    </>
  );
}
