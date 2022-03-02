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

const rows2 = [
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Donut", 452, 25.0, 51, 4.9),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Honeycomb", 408, 3.2, 87, 6.5),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Jelly Bean", 375, 0.0, 94, 0.0),
  createData("KitKat", 518, 26.0, 65, 7.0),
  createData("Lollipop", 392, 0.2, 98, 0.0),
  createData("Marshmallow", 318, 0, 81, 2.0),
  createData("Nougat", 360, 19.0, 9, 37.0),
  createData("Oreo", 437, 18.0, 63, 4.0),
];

let rows = [
  {
    id: "1",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "2",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "3",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "4",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "5",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "6",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "7",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "8",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
  {
    id: "9",
    bird_type: "Turkey",
    source: "USERNAME",
    timestamp: "2022-12-10T13:45:00.000Z",
    age: "2022-11-13T11:30:00.000Z",
    gender: "Male",
    comments: "days",
    status: "Validated",
    sample_type: "Reference",
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
  },
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
    machines: [
      {
        machineName: "",
        measurement: [{ type: { name: "", units: "" }, value: "40" }],
      },
    ],
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
