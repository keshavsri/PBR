import * as React from "react";

import { Button, Stack, Box, CircularProgress, Select, MenuItem, InputLabel, TextField , Autocomplete, FormControl} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import PrevIcon from "@mui/icons-material/ArrowBackIos";
import SubmitIcon from "@mui/icons-material/Publish";
import { createFilterOptions } from "@mui/material/Autocomplete";

import NewAddSample from "./NewAddSample";

import CustomDialog from "../../CustomDialog";
import { makeStyles } from "@mui/styles";
import useAuth from "../../../services/useAuth";
import useDataView from "../../../services/useDataView";

const useStyles = makeStyles({});
const filter = createFilterOptions();

export default function DataViewSampleModal({ getData }) {
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
  let onSubmit = async () => {};

  const [organizations, setOrganizations] = React.useState([]);
  const [flocks, setFlocks] = React.useState([]);
  const [sources, setSources] = React.useState([]);
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);
  const [cartridgeType, setCartridgeType] = React.useState({});
  const [flock, setFlock] = React.useState({});
  const [flockInput, setFlockInput] = React.useState("");
  const [source, setSource] = React.useState({});
  const [organization, setOrganization] = React.useState({});



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
        })
        setFlocks(data);
        setFlock(data[0]);
      });
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
        console.log(data)
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

  return (
      <>
        <CustomDialog
          open={sampleModalVisibility}
          icon={<SampleIcon />}
          title="Sample"
          subtitle="Add"
          handleClose={closeSampleModal}
        >
          <>
            <InputLabel id="label-select-organization">Cartridge Type</InputLabel>
            <Select
              labelId="label-select-cartridge-type"
              id="select-cartridge-types"
              value={cartridgeType}
              label="Cartridge Type"
              onChange={(e)=> {
                setCartridgeType(e.target.value);
              }}
            >
              {cartridgeTypes.map((ct) => {
                return (
                  <MenuItem key={ct.id} value={ct}>{ct.name}</MenuItem>
                )
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
              onChange={(e)=> {
                setSource(e.target.value);
              }}
            >
              {sources.map((s) => {
                return (
                  <MenuItem key={s.id} value={s}>{s.name}</MenuItem>
                )
              })}
            </Select>
          </>


          {user.role === 0 &&
            <>
              <InputLabel id="label-select-organization">Organization</InputLabel>
              <Select
                labelId="label-select-organization"
                id="select-organization"
                value={organization}
                label="Source"
                onChange={(e)=> {
                  setOrganization(e.target.value);
                }}
              >
                {organizations.map((org) => {
                  return (
                    <MenuItem key={org.id} value={org}>{org.name}</MenuItem>
                  )
                })}
              </Select>
            </>
          }

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
                renderInput={(params) => <TextField {...params}   />}
              />

          {cartridgeType.analytes &&
          cartridgeType.analytes.map((a) => {
            return (
              <>
                <TextField label={a.abbreviation}  />
              </>

            )

          })
          }

        </CustomDialog>


      </>

  )
}
