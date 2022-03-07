import * as React from "react";

import { Paper, Button } from "@mui/material";

import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import FilterListIcon from "@mui/icons-material/FilterList";
import DataViewFilterContent from "./DataViewFilterContent";
import EnhancedTable from "./DataViewTable/EnhancedTable";

import CustomDialog from "./CustomDialog";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

// Mocked API JSON Object
let rows = [
  {
    id: "10",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines:[
      {
        machineName: "iStat",
        data: [
          { type: { name: "PH", units: "mg" }, value: "40" },
          { type: { name: "PC02", units: "mg" }, value: "40" },
          { type: { name: "BE", units: "mg" }, value: "40" },
          { type: { name: "HC03", units: "mg" }, value: "40" },
          { type: { name: "TCO2", units: "mg" }, value: "40" },
          { type: { name: "S02", units: "mg" }, value: "40" },
          { type: { name: "NAK", units: "mg" }, value: "40" },
          { type: { name: "ICA", units: "mg" }, value: "40" },
          { type: { name: "GLU", units: "mg" }, value: "40" },
          { type: { name: "HCT", units: "mg" }, value: "40" },
          { type: { name: "HB", units: "mg" }, value: "40" },
        ]
      },
    ] ,
  },
];

let headCellNamesFromAPI = [
      {
        machineName: "iStat",
        data: [
          { type: { name: "PH", units: "mg" }},
          { type: { name: "PC02", units: "mg" }},
          { type: { name: "BE", units: "mg" }},
          { type: { name: "HC03", units: "mg" }},
          { type: { name: "TCO2", units: "mg" } },
          { type: { name: "S02", units: "mg" }},
          { type: { name: "NAK", units: "mg" }},
          { type: { name: "ICA", units: "mg" }},
          { type: { name: "GLU", units: "mg" }},
          { type: { name: "HCT", units: "mg" }},
          { type: { name: "HB", units: "mg" }},
        ]
      },
]

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "bird_type",
    numeric: false,
    disablePadding: true,
    label: "Bird Type",
  },
  {
    id: "source",
    numeric: false,
    disablePadding: true,
    label: "Source",
  },
  {
    id: "timestamp",
    numeric: false,
    disablePadding: true,
    label: "Date Entered",
  },
  {
    id: "age",
    numeric: false,
    disablePadding: true,
    label: "Age",
  },
  {
    id: "gender",
    numeric: false,
    disablePadding: true,
    label: "Gender",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: true,
    label: "Status",
  },
  {
    id: "sample_type",
    numeric: false,
    disablePadding: true,
    label: "Sample Type",
  },
];

let machineHeadCells = []
const addApiColumnNamesToHeadCells = () => {
  headCellNamesFromAPI.map(item => {
    item.data.map((point, index) => {
      headCells.push(createHeadCell(point, item.machineName))
      machineHeadCells.push(createHeadCell(point, item.machineName))
      }

    )
  })
}

function createHeadCell(point, machineName) {
  return {
    machineName: machineName,
    name: point.type.name,
    numeric: false,
    disablePadding: true,
    label: "" + point.type.name + " (" + point.type.units + ")",
  }

}

addApiColumnNamesToHeadCells()


const getSomethingAPICall = () => {
  // fetch(`/api/organization/orgCode/${selectedOrganization.id}`, {method: "GET",})
  //   .then((response) => {
  //     return response.json();
  //   }).then((data) => {
  //     console.log(data);
  //     setOrgCodeData(data);
  //   })
  // let mockedOrgCode = {
  //   orgCode: "873450",
  //   validTill: "2021-12-10T13:45:00.000Z",
  // };
  // console.log(mockedOrgCode);
  // setOrgCodeData(mockedOrgCode);
};
export default function DataView() {
  const [openFilterModal, setOpenFilterModal] = React.useState(false);
  const [openSampleAddModal, setOpenSampleAddModal] = React.useState(false);

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };
  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const handleOpenSampleAddModal = () => {
    setOpenSampleAddModal(true);
  };
  const handleCloseSampleAddModal = () => {
    setOpenSampleAddModal(false);
  };

  // PH
  // PCO2
  // BE
  // HCO3
  // TCO2
  // SO2
  // NAK
  // ICA
  // GLU
  // HCT
  // HB
  // function addHeadCellsFromAPI(measurements){
  //   headCellsToAdd = measurements.map((measurement) => [measurement]);
  // }

  return (
    <>
      <Paper>
        <EnhancedTable
          openFilterModal={openFilterModal}
          openSampleAddModal={openSampleAddModal}
          handleOpenFilterModal={handleOpenFilterModal}
          handleOpenSampleAddModal={handleOpenSampleAddModal}
          handleCloseFilterModal={handleCloseFilterModal}
          handleCloseSampleAddModal={handleCloseSampleAddModal}
          headCells={headCells}
          rows={rows}
          machineHeadCells={machineHeadCells}
        ></EnhancedTable>
      </Paper>
      <CustomDialog
        open={openFilterModal}
        icon={<FilterListIcon />}
        title="Data View"
        subtitle="Filter Settings"
        handleClose={handleCloseFilterModal}
        footer={
          <>
            <Button
              variant="contained"
              color="secondaryLight"
              onClick={handleCloseFilterModal}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseFilterModal}
              variant="contained"
              autoFocus
            >
              Apply
            </Button>
          </>
        }
      >
        <DataViewFilterContent />
      </CustomDialog>
      <CustomDialog
        open={openSampleAddModal}
        icon={<SampleIcon />}
        title="Sample"
        subtitle="Add"
        handleClose={handleCloseSampleAddModal}
        footer={
          <>
            <Button
              variant="contained"
              color="secondaryLight"
              onClick={handleCloseSampleAddModal}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseSampleAddModal}
              variant="contained"
              autoFocus
              endIcon={<NextIcon />}
            >
              Next
            </Button>
          </>
        }
      ></CustomDialog>
    </>
  );
}
