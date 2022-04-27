import * as React from "react";

import { Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

import DataViewConsumer from "../services/useDataView";
import DataViewFilterContent from "./DVFilterContent";

import CustomDialog from "./CustomDialog";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

export default function DataViewFilterModal(props) {
  const {
    rows,
    setRowList,
    setHeadCellList,
    getData
  } = props;
  const {
    generalFilterState,
    setGeneralFilterState,
    openFilterModal, 
    setOpenFilterModal,
    handleOpenFilterModal,
    handleCloseFilterModal  
  } = DataViewConsumer();


  let applyFilter = async () => {
    fetch(`/api/sample/filter`, {      method: "POST",
       body: generalFilterState,})
      .then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
        setRowList(data.row);
        setHeadCellList(data.types);
      })
      // Future API call for filtering (passsed in from dataview.js)
      // getData(generalFilterState);
      console.log("Filtering!");
      console.log(generalFilterState);
      handleCloseFilterModal();
    };
    

  // Define the footer for the modal. By default, there's no footer.
  let footer = (
    <>
    <Button
      variant="contained"
      color="secondaryLight"
      onClick={handleCloseFilterModal}
    >
      Cancel
    </Button>
    <Button
      onClick={applyFilter}
      variant="contained"
      autoFocus
    >
      Apply
    </Button>
  </>
  );

  return (
    <>
      <CustomDialog
        open={openFilterModal}
        icon={<FilterListIcon />}
        title="Data View"
        subtitle="Filter Settings"
        handleClose={handleCloseFilterModal}
        footer={footer}
      >
        <DataViewFilterContent rows={rows} />
      </CustomDialog>
    </>
  );
}
