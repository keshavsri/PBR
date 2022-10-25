import React from "react";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

import {
  Menu,
  Button,
  MenuItem,
  IconButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import PhotoCamera from "@mui/icons-material/PhotoCamera";

const Input = styled("input")({
  display: "none",
});

const useStyles = makeStyles({
  root: {},
});

export default function IStatUpload({
  expandPanel,
  parseFilesAndAddData,
  machine,
}) {
  const classes = useStyles();
  useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  const uploadMachineFile = (event) => {
    console.log("HIT");
    console.log("uploading machine file for: ", machine.name);
    console.log(event);
    let files = event.target.files;
    parseFilesAndAddData(files, machine);
  };

  return (
    <>
      {/* <Button
        variant="contained"
        size="small"
        component="span"
        onClick={handleClick}
      >
        Upload
      </Button> */}

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Input
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
            <ListItemText>Photo of First Page</ListItemText>
          </MenuItem>
        </label>
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
              <PhotoCamera fontSize="small" />
            </ListItemIcon>
            <ListItemText>Photo of Second Page</ListItemText>
          </MenuItem>
        </label>
      </Menu>
    </>
  );
}
