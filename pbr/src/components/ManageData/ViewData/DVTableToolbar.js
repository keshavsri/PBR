import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Typography,
  InputLabel,
  Box,
  Button,
  Tooltip,
  IconButton,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@mui/styles";
import BulkIcon from "@mui/icons-material/UploadFile";
import ReportIcon from "@mui/icons-material/Assessment";
import FilterListIcon from "@mui/icons-material/FilterList";
import SampleIcon from "@mui/icons-material/Science";
import useDataView from "../../../services/useDataView";

const useStyles = makeStyles({});

export default function DVTableToolbar({
  filterPendingSamples,
  showOnlyPendingSamples,
  turnPendingFilterOff,
  selected,
  organizations,
  currentOrganization,
  currentCartridgeType,
  user,
  setCurrentCartridgeType,
  setCurrentOrganization,
  cartridgeTypes,
  roles
}) {
  const {
    openSampleModal,
    handleOpenFilterModal,
  } = useDataView();
  const classes = useStyles();

  useTheme();

  const selectedLength = async () => {
    console.log(selected.length);
  };

  return (
    <>
      <>
        {user.role === roles["Super_Admin"] ? (
          <Select
            style={{
              width: 500,
              marginTop: 10,
              marginBottom: 10,
              marginleft: 20,
              marginRight: 20,
            }}
            labelId="label-select-organization"
            id="select-organizations"
            value={currentOrganization}
            onChange={(e) => {
              setCurrentOrganization(e.target.value);
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
        ) : (
          <>
            <TextField
              style={{
                width: 1000,
                marginTop: 10,
                marginBottom: 10,
                marginleft: 20,
                marginRight: 20,
              }}
              value={currentOrganization.name}
              disabled
            />
          </>
        )}

        <Select
          labelId="label-select-cartridge-type"
          id="select-cartridge-type"
          value={currentCartridgeType}
          onChange={(e) => {
            setCurrentCartridgeType(e.target.value);
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

      <Tooltip title="Batch Import">
        <Button
          variant="contained"
          color="secondary"
          style={{ width: 275, marginTop: 10, marginBottom: 10 }}
          startIcon={<ReportIcon />}
          sx={{ ml: 1 }}
          // onClick={}
        >
          Generate Report
        </Button>
      </Tooltip>

      <Tooltip title="Batch Import">
        <Button
          variant="contained"
          color="secondary"
          style={{ width: 275, marginTop: 10, marginBottom: 10 }}
          startIcon={<FilterListIcon />}
          sx={{ ml: 1 }}
          onClick={handleOpenFilterModal}
        >
          Filter Samples
        </Button>
      </Tooltip>

      <Tooltip title="Batch Import">
        <Button
          variant="contained"
          style={{ width: 275, marginTop: 10, marginBottom: 10 }}
          startIcon={<BulkIcon />}
          sx={{ ml: 1 }}
        >
          Batch Import
        </Button>
      </Tooltip>
      <Tooltip title="Add Sample Entry">
        <Button
          variant="contained"
          style={{ width: 275, marginTop: 10, marginBottom: 10 }}
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
            startIcon={
              <FontAwesomeIcon
                icon={faDatabase}
                style={{ height: "24px", width: "24px", padding: "3px" }}
              />
            }
            sx={{ ml: 1 }}
          >
            Show All Samples
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="Show Pending Samples">
          <Button
            style={{ width: 275, marginTop: 10, marginBottom: 10 }}
            variant="contained"
            onClick={filterPendingSamples}
            startIcon={
              <FontAwesomeIcon
                icon={faDatabase}
                style={{ height: "24px", width: "24px", padding: "3px" }}
              />
            }
            sx={{ ml: 1 }}
          >
            Pending Samples
          </Button>
        </Tooltip>
      )}
    </>
  );
}
