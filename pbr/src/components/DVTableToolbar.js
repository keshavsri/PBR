import React from "react";
import { useTheme } from "@mui/material/styles";

import { Typography, Box, Button, Tooltip, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import BulkIcon from "@mui/icons-material/UploadFile";
import ReportIcon from "@mui/icons-material/Assessment";
import FilterListIcon from "@mui/icons-material/FilterList";
import SampleIcon from "@mui/icons-material/Science";
import useDataView from "../services/useDataView";

const useStyles = makeStyles({});

export default function DVTableToolbar({
    filterPendingSamples,
    showOnlyPendingSamples,
    turnPendingFilterOff
}) {
  const {
    samplePayload,
    setSamplePayload,
    generalDetails,
    setGeneralDetails,
    machineDetails,
    setMachineDetails,
    sampleModalVisibility,
    sampleModalScreen,
    setSampleModalScreen,
    openSampleModal,
    closeSampleModal,
    samplePrevAction,
    sampleNextAction,
    error,
    setError,
    restartSample,
    timestamp,
    setTimestamp,
    generalFilterState,
    setGeneralFilterState,
    openFilterModal, 
    setOpenFilterModal,
    handleOpenFilterModal,
    handleCloseFilterModal  
  } = useDataView();
  const classes = useStyles();


  useTheme();

  return (
    <>
      <Tooltip title="Generate Group Report">
        <IconButton sx={{ ml: -0.5 }}>
          <ReportIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Filter list">
        <IconButton onClick={handleOpenFilterModal} sx={{ ml: -0.5 }}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Batch Import">
        <Button variant="contained" startIcon={<BulkIcon />} sx={{ ml: 1 }}>
          Batch Import
        </Button>
      </Tooltip>
      <Tooltip title="Add Sample Entry">
        <Button
          variant="contained"
          onClick={openSampleModal}
          startIcon={<SampleIcon />}
          sx={{ ml: 1 }}
        >
          Add Sample
        </Button>
      </Tooltip>
      {showOnlyPendingSamples ? (      
      <Tooltip title="Show All Samples">
        <Button
          variant="contained"
          onClick={turnPendingFilterOff}
          startIcon={<FontAwesomeIcon
            icon={faDatabase}
            style={{ height: "24px", width: "24px", padding: "3px" }}
          />}
          sx={{ ml: 1 }}
        >
          Show All Samples
        </Button>
      </Tooltip>) : (      
      <Tooltip title="Show Pending Samples">
        <Button style={{ width: 275, marginTop: 10, marginBottom: 10 }}
          variant="contained"
          onClick={filterPendingSamples}
          startIcon={<FontAwesomeIcon
            icon={faDatabase}
            style={{ height: "24px", width: "24px", padding: "3px" }}
          />}
          sx={{ ml: 1 }}
        >
          Show Pending Samples
        </Button>
      </Tooltip>) }

    </>
  );
}
