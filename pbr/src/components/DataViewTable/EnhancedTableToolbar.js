import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from "@mui/styles";
import {
  Toolbar,
  IconButton,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    "& .MuiButton-root": {
      lineHeight: 1,
      borderRadius: "333px",
      textAlign: "left",
      fontSize: "1em",
      "& .MuiSvgIcon-root": {
        color: "white",
      },
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.secondary,
    },
  },
}));

export default function EnhancedTableToolbar(props) {
  const { numSelected, toolbarButtons, onDelete, onEdit} = props;
  let classes = useStyles();

  return (
    <Toolbar
      className={classes.root}
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      {numSelected === 1 ? (
        <Tooltip title="Edit">
          <IconButton sx={{ ml: 1 }} onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : (
        toolbarButtons
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton sx={{ ml: 1 }} onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
