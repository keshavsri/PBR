import React from "react";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

import {
  Menu,
  Button,
  Tooltip,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ClearIcon from "@mui/icons-material/Backspace";

import { makeStyles } from "@mui/styles";

import PhotoCamera from "@mui/icons-material/PhotoCamera";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const Input = styled("input")({
  display: "none",
});

const useStyles = makeStyles({
  root: {},
});

export default function VetScanUpload({
  expandPanel,
  parseFilesAndAddData,
  machine,
  clearMachineData,
}) {
  const classes = useStyles();
  useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    expandPanel(machine.id);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event = null) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const clearParsedData = (event = null) => {
    if (event) {
      event.stopPropagation();
    }
    clearMachineData(machine, true);
    setLoaded(false);
  };

  const uploadMachineFile = (event) => {
    console.log("HIT");
    console.log("uploading machine file for: ", machine.name);
    console.log(event);
    setLoaded(true);
    let files = event.target.files;
    parseFilesAndAddData(files, machine);
  };

  return (
    <>
      {loaded && (
        <>
          <Tooltip title="Undo Upload File">
            <IconButton aria-label="delete" onClick={clearParsedData}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}
      <Button
        variant="contained"
        size="small"
        component="span"
        onClick={handleClick}
      >
        {loaded ? "Re-Upload" : "Upload"}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {/* <Input
          accept="image/*"
          id="icon-button-file"
          type="file"
          onChange={(event) => {
            handleClose();
            uploadMachineFile(event);
          }}
        />
        <label htmlFor="icon-button-file">
          <MenuItem>
            <ListItemIcon>
              <PhotoCamera fontSize="small" />
            </ListItemIcon>
            <ListItemText>Take a Photo</ListItemText>
          </MenuItem>
        </label> */}
        <Input
          accept=".txt"
          id="contained-button-file"
          type="file"
          onChange={(event) => {
            handleClose();
            uploadMachineFile(event);
          }}
        />
        <label htmlFor="contained-button-file">
          <MenuItem>
            <ListItemIcon>
              <UploadFileIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Upload a .txt File</ListItemText>
          </MenuItem>
        </label>
      </Menu>
    </>
  );
}
