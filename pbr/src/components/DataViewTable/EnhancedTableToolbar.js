import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AssessmentIcon from '@mui/icons-material/Assessment';
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
  const { numSelected, toolbarButtons, onDelete, onEdit, onSubmit, savedFlag, isSample, setOpenReviewSampleModal} = props;
  let classes = useStyles();

  const handleOpenReviewSampleModal = () => {
    setOpenReviewSampleModal(true);
  };

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

      {numSelected === 0 ? toolbarButtons : <></>}

      {numSelected === 1 ? (
        <Tooltip title="Edit">
          <IconButton sx={{ ml: 1 }} onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      {(numSelected > 0 && savedFlag == true) ? (
        <Tooltip title="Submit">
          <IconButton sx={{ ml: 1 }} onClick={onSubmit}>
            <ArrowUpwardIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      {numSelected > 0  ? (
        <Tooltip title="Delete">
          <IconButton sx={{ ml: 1 }} onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      {numSelected == 1 && isSample ? (
        <Tooltip title="Review Sample">
        <Button
          variant="contained"
          onClick={handleOpenReviewSampleModal}
          startIcon={<AssessmentIcon />}
          sx={{ ml: 1 }}
        >
          Review Sample
        </Button>
      </Tooltip>
      ) : null}

      {numSelected > 1 && isSample ? (
        <Tooltip title="Review Samples">
        <Button
          variant="contained"
          //onClick={handleOpenReviewSampleModal}
          startIcon={<AssessmentIcon />}
          sx={{ ml: 1 }}
        >
          Review Samples
        </Button>
      </Tooltip>
      ) : null}

    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
