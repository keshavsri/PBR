import React from "react";
import { useTheme } from "@mui/material/styles";

import { Typography, Box, Button, Tooltip, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DataViewConsumer from "../services/useDataView";
import BulkIcon from "@mui/icons-material/UploadFile";
import ReportIcon from "@mui/icons-material/Assessment";
import FilterListIcon from "@mui/icons-material/FilterList";
import SampleIcon from "@mui/icons-material/Science";

const useStyles = makeStyles({});

export default function DVTableToolbar() {
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
  } = DataViewConsumer();
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
    </>
  );
}
