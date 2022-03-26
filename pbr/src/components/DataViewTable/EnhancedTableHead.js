import * as React from "react";
import { styled } from "@mui/material/styles";

import PropTypes from "prop-types";
import { visuallyHidden } from "@mui/utils";
import { makeStyles } from "@mui/styles";

import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Checkbox,
  Chip,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTableCell-head": {
      color: theme.palette.secondaryLight.main,
      textTransform: "uppercase",
      fontWeight: 700,
      lineHeight: 1,
      paddingLeft: "5px",
      paddingRight: "5px",
      backgroundColor: theme.palette.primary.main,
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.secondaryLight.main,
    },
    "& .MuiTableSortLabel-root.Mui-active": {
      color: "white",
      "& .MuiTableSortLabel-icon": {
        color: "white",
      },
    },
    "& .MuiTableSortLabel-root:hover": {
      color: "rgba(255,255,255,0.95)",
    },
  },
}));

export default function EnhancedTableHead(props) {
  let classes = useStyles();
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    deletableRowCount,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.root}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === deletableRowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all rows",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              sx={{ color: "#ffffff" }}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {headCell.sublabel && (
                <Chip label={headCell.sublabel} size="small" />
              )}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
