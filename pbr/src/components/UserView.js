import * as React from "react";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";

import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import FilterListIcon from "@mui/icons-material/FilterList";
// Might need to change
import DataViewFilterContent from "./DataViewFilterContent";
// Might need to change
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
        name: "NCSU",
        street_address: "123 Main St.",
        city: "Raleigh",
        state: "NC",
        zip: "27607",
        maincontact: {
          id: "",
          organization: "",
          email: "",
          name: "Rosio Crespo", 
          phone: "",
          notes: "",
        },
        org_signup_code: "123456",  
        notes: "N/A",
    },
    {
      name: "UNC",
      street_address: "456 Main St.",
      city: "Chapel Hill",
      state: "NC",
      zip: "27607",
      maincontact: {
        id: "",
        organization: "",
        email: "",
        name: "Other Name", 
        phone: "",
        notes: "",
      },
      org_signup_code: "654321",  
      notes: "N/A",
  },
]

const headCells = [
  {
    id: "buttons",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "street_address",
    numeric: false,
    disablePadding: true,
    label: "Street Address",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: true,
    label: "City",
  },
  {
    id: "state",
    numeric: false,
    disablePadding: true,
    label: "State",
  },
  {
    id: "zip",
    numeric: false,
    disablePadding: true,
    label: "Zip",
  },
  {
    id: "maincontact.name",
    numeric: false,
    disablePadding: true,
    label: "Main Contact",
  },
  {
    id: "org_signup_code",
    numeric: false,
    disablePadding: true,
    label: "Org Signup Code",
  },
  {
    id: "notes",
    numeric: false,
    disablePadding: true,
    label: "Notes",
  },
];



const assignRowHtml = () => {

  rows.map((row, index) => {
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
  })
}



const denestMachineData = (rows) => {
  rows.map((row, index) => {
    Object.entries(row.maincontact).forEach(([key, value]) => {
      let temp = "maincontact." + key
      row[temp] = value
      })
    }
  )
}

assignRowHtml()
denestMachineData(rows)
console.log(rows)

// const getSomethingAPICall = () => {
//   fetch(`/api/sample`, {method: "GET",})
//     .then((response) => {
//       return response.json();
//     }).then((data) => {
//       console.log(data);
//       setRowList(data.row);
//       setHeadCellList(data.types);
//     })
//     addApiColumnNamesToHeadCells();
//     console.log(headCells)
//     denestMachineData(rows)
//     assignRowHtml()
//     console.log(rows)  
// console.log(headCells)
// };

export default function OrganizationView() {
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
          toolbarButtons={
            <>
             
              <Tooltip title="Filter list">
                <IconButton onClick={handleOpenFilterModal} sx={{ ml: -0.5 }}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              
              
            </>
          }
        ></EnhancedTable>
      </Paper>
      <CustomDialog
        open={openFilterModal}
        icon={<FilterListIcon />}
        title="Organization View"
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
