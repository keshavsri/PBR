import * as React from "react";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";

import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import FilterListIcon from "@mui/icons-material/FilterList";
import DataViewFilterContent from "./DataViewFilterContent";
import DataViewAddSample from "./DataViewAddSample";
import EnhancedTable from "./DataViewTable/EnhancedTable";
import BulkIcon from "@mui/icons-material/UploadFile";
import ReportIcon from "@mui/icons-material/Assessment";
import EditIcon from '@mui/icons-material/Edit';
import FactCheckIcon from '@mui/icons-material/FactCheck';


import CustomDialog from "./CustomDialog";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

// Mocked API JSON Object
let rows = [
  {
    deletable: true,
    id: "1",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    deletable: false,
    id: "2",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Pending Validation",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    deletable: false,
    id: "3",
    bird_type: "Turkey",
    source: "SOURCE B",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    deletable: false,
    id: "4",
    bird_type: "Chicken",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Female",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    deletable: false,
    id: "5",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    deletable: false,
    id: "6",
    bird_type: "Chicken",
    source: "SOURCE A",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    deletable: false,
    id: "7",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    id: "8",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
  {
    id: "9",
    bird_type: "Chicken",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Pending Validation",
    sample_type: "Diagnostic",
    machines: [
      {
        machineName: "iStat",
        data: [
          { type: { name: "PH", units: "mg" }, value: "0" },
          { type: { name: "PC02", units: "mg" }, value: "47" },
          { type: { name: "BE", units: "mg" }, value: "20" },
          { type: { name: "HC03", units: "mg" }, value: "40" },
          { type: { name: "TCO2", units: "mg" }, value: "40" },
          { type: { name: "S02", units: "mg" }, value: "4" },
          { type: { name: "NAK", units: "mg" }, value: "85" },
          { type: { name: "ICA", units: "mg" }, value: "40" },
          { type: { name: "GLU", units: "mg" }, value: "85" },
          { type: { name: "HCT", units: "mg" }, value: "674" },
          { type: { name: "HB", units: "mg" }, value: "40" },
        ],
      },
    ],
  },
  {
    id: "10",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Surveillance",
    machines: [
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
        ],
      },
    ],
  },
];

let headCellNamesFromAPI = [
  {
    machineName: "iStat",
    data: [
      { type: { name: "PH", units: "mg" } },
      { type: { name: "PC02", units: "mg" } },
      { type: { name: "BE", units: "mg" } },
      { type: { name: "HC03", units: "mg" } },
      { type: { name: "TCO2", units: "mg" } },
      { type: { name: "S02", units: "mg" } },
      { type: { name: "NAK", units: "mg" } },
      { type: { name: "ICA", units: "mg" } },
      { type: { name: "GLU", units: "mg" } },
      { type: { name: "HCT", units: "mg" } },
      { type: { name: "HB", units: "mg" } },
    ],
  },
];

let newRows = [
  {
    deletable: true,
    id: "1",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: (
      <>
        <Chip label={"Validated"} size="small" />
      </>
    ),
    sample_type: "Surveillance",
    iStat_PH: "12" + "mg",
    iStat_PH2: "14312" + "mg",
    iStat_PH3: "1422" + "mg",
    iStat_PH4: "142" + "mg",
    iStat_PH5: "132" + "mg",
    iStat_PH6: "142" + "mg",
  },
  {
    deletable: false,
    id: "2",
    bird_type: "Turkey",
    source: "SOURCE C",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: (
      <>
        <Chip label={"Validated"} size="small" />
      </>
    ),
    sample_type: "Surveillance",
    iStat_PH: "142" + "mg",
    iStat_PH2: "" + "mg",
    iStat_PH3: "142" + "mg",
    iStat_PH4: "142" + "mg",
    iStat_PH5: "132" + "mg",
    iStat_PH6: "142" + "mg",
  },
];

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "buttons",
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

let machineHeadCells = [];
const addApiColumnNamesToHeadCells = (headCellNamesFromAPI) => {
  headCellNamesFromAPI.map((item) => {
    item.data.map((point, index) => {
      headCells.push(createHeadCell(point, item.machineName, index));
      machineHeadCells.push(createHeadCell(point, item.machineName, index));
    });
  });
};

function createHeadCell(point, machineName, index) {
  return {
    machineName: machineName,
    name: point.type.name,
    id: machineName + "_" + point.type.name,
    numeric: false,
    disablePadding: true,
    label: " " + point.type.name + " (" + point.type.units + ")",
    sublabel: "" + machineName,
  };
}

const denestMachineData = (rows) => {
  rows.map((row, index) => {
      row.machines.map((machine, index2)=> {
        machine.data.map((dataPoint, index3) => {
          let temp = machine.machineName + '_' + dataPoint.type.name
          row[temp] = dataPoint.value + " " + dataPoint.type.units 
        })
      })
    }
  )
}

const assignRowHtml = () => {

  rows.map((row, index) => {
    if(row.status.toUpperCase() === "VALIDATED") {
      row.status = (
        <>
          <Chip label={"Validated"} color = "primary" size="small" />
        </>
      )
    } else {
      row.status = (
        <>
          <Chip label={"Pending Validation"} color = "secondary" size="small" />
        </>
      )
    }
    row.buttons = (
      <>
      <IconButton aria-label="edit" size="small">
          <EditIcon />
      </IconButton>
      <IconButton aria-label="validate" size="small">
          <FactCheckIcon />
      </IconButton>
      </>
      
    )
    row.timestamp = new Date(row.timestamp).toLocaleString()
    row.age = new Date(row.age).toLocaleString()
  })
}


// const getAPICall = () => {
//   fetch(`/api/sample`, {method: "GET",})
//     .then((response) => {
//       return response.json();
//     }).then((data) => {
//       console.log(data);
//       setRowList(data.row);
//       setHeadCellList(data.types);
//     })

//     addApiColumnNamesToHeadCells(headCellNamesFromAPI);
//     console.log(headCellList)
//     denestMachineData(rowList)
//     assignRowHtml()
//     console.log(rows)  
// };

addApiColumnNamesToHeadCells(headCellNamesFromAPI);
console.log(headCells)
denestMachineData(rows)
assignRowHtml()
console.log(rows)  




export default function DataView() {
  const [openFilterModal, setOpenFilterModal] = React.useState(false);
  const [openSampleAddModal, setOpenSampleAddModal] = React.useState(false);
  // const [rowList, setRowList] = React.useState([]);
  // const [headCellList, setHeadCellList] = React.useState([]);
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
          toolbarButtons={
            <>
              <Tooltip title="Generate Group Report">
                <IconButton sx={{ ml: -0.5 }}>
                  <ReportIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter list">
                <IconButton onClick={handleOpenFilterModal} sx={{ ml: -0.5 }}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Batch Import">
                <Button
                  variant="contained"
                  startIcon={<BulkIcon />}
                  sx={{ ml: 1 }}
                >
                  Batch Import
                </Button>
              </Tooltip>
              <Tooltip title="Add Sample Entry">
                <Button
                  variant="contained"
                  onClick={handleOpenSampleAddModal}
                  startIcon={<SampleIcon />}
                  sx={{ ml: 1 }}
                >
                  Add Sample
                </Button>
              </Tooltip>
            </>
          }
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
      >
        <DataViewAddSample />
      </CustomDialog>
    </>
  );
}
