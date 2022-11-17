import * as React from "react";
import { styled } from "@mui/material/styles";

import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Checkbox,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    lineHeight: 1,
    paddingLeft: "5px",
    paddingRight: "5px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd):not(.Mui-selected)": {
    backgroundColor: "rgba(0,0,0,0.025)",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function generateRows() {
  if (this.props.loading === false) {
    var cols = Object.keys(this.props.books[0]),
      data = this.props.books;
    return data.map(function (item) {
      var cells = cols.map(function (colData) {
        return <td> {item[colData]} </td>;
      });
      return <tr key={item.id}> {cells} </tr>;
    });
  }
}

export default function EnhancedTable(props) {
  const {
    openFilterModal,
    openSampleAddModal,
    handleOpenFilterModal,
    handleOpenSampleAddModal,
    handleCloseFilterModal,
    handleCloseSampleAddModal,
    rows,
    headCells,
    toolbarButtons,
    selected,
    setSelected,
    setSelectedSamples,
    setPendingSamples,
    onDelete,
    onSubmit,
    onEdit,
    isSample,
    setOpenReviewSampleModal,
    selectedSample,
  } = props;

  const [order, setOrder] = React.useState("");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [savedFlag, setSavedFlag] = React.useState(true);
  const [pendingFlag, setPendingFlag] = React.useState(true);

  // let rowComponents = generateRows();

  // function generateRows() {
  //   var cols = Object.keys(rows[0]),
  //     data = rows;
  //   return rows.map(function (item) {
  //     var cells = cols.map(function (colData) {
  //       return <td> {item[colData]} </td>;
  //     });
  //     return <tr key={item.id}> {cells} </tr>;
  //   });
  // }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    setSavedFlag(true);
    setPendingFlag(true);
    if (event.target.checked) {
      let newSelecteds = rows.filter((n) => n.deletable).map((n) => n.id);

      setSelected(newSelecteds);

      // Sample only 

      if (isSample) {
        setPendingFlag(newSelecteds);

        for (let i = 0; i < rows.length; i++) {
          if (rows[i].validation_status != "Saved") {
            setSavedFlag(false);
            break;
          }
        }

        for (let i = 0; i < rows.length; i++) {
          if (rows[i].validation_status != "Pending") {
            setPendingFlag(false);
            break;
          }
        }

        if (pendingFlag) {
          setPendingSamples(rows);
        }
        setSelectedSamples(rows);
      }

      

      return;
    }
    setSavedFlag(true);
    setPendingFlag(true);
    setSelected([]);
  };

  const handleClick = (event, name) => {
    setSavedFlag(true);
    setPendingFlag(true);
    const selectedIndex = selected.indexOf(name);

    let newSelected = [];
    let selectedSamples = [];
    let pendingSamples = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);

    // Sample only logic


    if (isSample) {
      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < newSelected.length; j++) {
          if (newSelected[j] === rows[i].id) {
            if (selectedSamples.indexOf(rows[i]) === -1) {
              selectedSamples.push(rows[i]);
              pendingSamples.push(rows[i]);
            }
          }
        }
      }
  
      if (selectedSamples.length > 0) {
        for (let i = 0; i < selectedSamples.length; i++) {
          if (selectedSamples[i].validation_status != "Saved") {
            setSavedFlag(false);
          }
  
          setSelectedSamples(selectedSamples);
        }
      }
  
      if (pendingSamples.length > 0) {
        for (let i = 0; i < pendingSamples.length; i++) {
          if (pendingSamples[i].validation_status != "Pending") {
            setPendingFlag(false);
            break;
          }
  
          setPendingSamples(pendingSamples);
        }
      }
    }
    
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const findMachineDataPoint = (row, machineName, fieldName) => {
    for (var i = 0, iLen = row.machines.length; i < iLen; i++) {
      if (row.machines[i].machineName == machineName) {
        for (var j = 0, jLen = row.machines[i].data.length; j < jLen; j++) {
          if (row.machines[i].data[j].type.name == fieldName) {
            return row.machines[i].data[j].value;
          }
        }
      }
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedSample={selectedSample}
          toolbarButtons={toolbarButtons}
          onEdit={onEdit}
          savedFlag={savedFlag}
          pendingFlag={pendingFlag}
          onDelete={onDelete}
          onSubmit={onSubmit}
          isSample={isSample}
          setOpenReviewSampleModal={setOpenReviewSampleModal}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
              deletableRowCount={rows.filter((n) => n.deletable).length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  let onClickFxn = (event, deletable, id) => {
                    if (deletable) {
                      handleClick(event, id);
                    }
                  };
                  return (
                    <StyledTableRow
                      hover
                      onClick={(event) =>
                        onClickFxn(event, row.deletable, row.id)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          disabled={!row.deletable}
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </StyledTableCell>

                      {headCells.map((headCell, index) => {
                        return (
                          <StyledTableCell
                            padding="none"
                            align="left"
                            id={index}
                            key={index}
                          >
                            {row[headCell.id]}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );

                  {
                    emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (dense ? 33 : 53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    );
                  }
                  {
                    /* {rowComponents} */
                  }
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
}
