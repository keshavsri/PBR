import * as React from "react";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";

import DataViewFilterContent from "./DataViewFilterContent";
import DataViewSampleModal from "./DataViewSample/SampleModal";
import DataViewAddSample from "./DataViewSample/AddSample";
import DVTableToolbar from "./DVTableToolbar";

import EnhancedTable from "./DataViewTable/EnhancedTable";
import BulkIcon from "@mui/icons-material/UploadFile";
import FilterListIcon from "@mui/icons-material/FilterList";
import ReportIcon from "@mui/icons-material/Assessment";
import EditIcon from "@mui/icons-material/Edit";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import CustomDialog from "./CustomDialog";
import { makeStyles } from "@mui/styles";
import { DataViewProvider } from "../services/useDataView";

const useStyles = makeStyles({});

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

export default function DataView() {
  const [openFilterModal, setOpenFilterModal] = React.useState(false);
  const [openSampleAddModal, setOpenSampleAddModal] = React.useState(false);
  const [rowList, setRowList] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
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

  const assignRowHtml = (rows) => {
    rows.map((row, index) => {
      row.status = (
        // NEED TO ADD CONDITIONAL FOR COLOR
        <>
          <Chip label={row.status} color="primary" size="small" />
        </>
      );

      row.buttons = (
        <>
          <IconButton aria-label="edit" size="small">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="validate" size="small">
            <FactCheckIcon />
          </IconButton>
        </>
      );
      row.timestamp = new Date(row.timestamp).toLocaleString();
      row.age = new Date(row.age).toLocaleString();
    });
  };

  const getData = () => {
    let apiRows = [
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
        deletable: true,
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
        deletable: true,
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
        deletable: true,
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
    denestMachineData(apiRows);
    assignRowHtml(apiRows);
    setRowList(apiRows);
  };

  const getHeadCells = () => {
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

    addApiColumnNamesToHeadCells(headCellNamesFromAPI, headCells);
    setHeadCellList(headCells);
  };

  let machineHeadCells = [];
  const addApiColumnNamesToHeadCells = (headCellNamesFromAPI, headCells) => {
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
      row.machines.map((machine, index2) => {
        machine.data.map((dataPoint, index3) => {
          let temp = machine.machineName + "_" + dataPoint.type.name;
          row[temp] = dataPoint.value + " " + dataPoint.type.units;
          console.log(temp);
        });
      });
    });
  };
  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?
  React.useEffect(() => {
    getData();
    getHeadCells();
    console.log(rowList);
  }, []);

  return (
    <DataViewProvider>
      <Paper>
        <EnhancedTable
          handleOpenFilterModal={handleOpenFilterModal}
          handleCloseFilterModal={handleCloseFilterModal}
          headCells={headCellList}
          rows={rowList}
          toolbarButtons={
            <DVTableToolbar handleOpenFilterModal={handleOpenFilterModal} />
          }
          selected={selected}
          setSelected={setSelected}
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
      <DataViewSampleModal />
    </DataViewProvider>
  );
}
