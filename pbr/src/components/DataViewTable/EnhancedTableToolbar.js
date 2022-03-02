import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import SampleIcon from "@mui/icons-material/Science";
import FilterListIcon from "@mui/icons-material/FilterList";

import {
  Toolbar,
  IconButton,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
export default function EnhancedTableToolbar(props) {
  const { numSelected, handleOpenFilterModal, handleOpenSampleAddModal } =
    props;

  return (
    <Toolbar
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
        >
          Nutrition
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Filter list">
            <IconButton onClick={handleOpenFilterModal}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Sample Entry">
            <Button
              variant="contained"
              onClick={handleOpenSampleAddModal}
              startIcon={<SampleIcon />}
            >
              Add Sample Entry
            </Button>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
