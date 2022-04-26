import React from "react";
import OrganizationIcon from "@mui/icons-material/Apartment";
import CustomDialog from "./CustomDialog";
import OrgCodeContent from "./OrgCodeContent";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";

import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import FilterListIcon from "@mui/icons-material/FilterList";

// Might need to change
import DataViewAddSample from "./DataViewSample/AddSample";
import EnhancedTable from "./DataViewTable/EnhancedTable";
import BulkIcon from "@mui/icons-material/UploadFile";
import ReportIcon from "@mui/icons-material/Assessment";
import EditIcon from "@mui/icons-material/Edit";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export default function ManageUsers() {
  const [openModal, setOpenModal] = React.useState(false);

  const [rowList, setRowList] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
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
      row.buttons = (
        <>
          <IconButton aria-label="edit" size="small">
            <EditIcon />
          </IconButton>
        </>
      );
    });
  };

  const getData = () => {
    let apiRows = [
      {
        deletable: true,
        id: 1,
        organization: "NCSU",
        email: "rcrespo@ncsu.edu",
        first_name: "Rosio",
        last_name: "Crespo",
        phone: "9191234567",
        role: "Super Admin",
        notes: "N/A",
      },
      {
        deletable: false,
        id: 2,
        organization: "UNC",
        email: "jwalker@unc.edu",
        first_name: "John",
        last_name: "Walker",
        phone: "1234567890",
        role: "Data Collector",
        notes: "N/A",
      },
    ];
    // denestMachineData(apiRows);
    assignRowHtml(apiRows);
    setRowList(apiRows);
  };

  const getHeadCells = () => {
    const headCells = [
      {
        id: "buttons",
      },
      {
        id: "first_name",
        numeric: false,
        disablePadding: true,
        label: "First Name",
      },
      {
        id: "last_name",
        numeric: false,
        disablePadding: true,
        label: "Last Name",
      },
      {
        id: "organization",
        numeric: false,
        disablePadding: true,
        label: "Organization",
      },
      {
        id: "email",
        numeric: false,
        disablePadding: true,
        label: "Email",
      },
      {
        id: "phone",
        numeric: false,
        disablePadding: true,
        label: "Phone",
      },
      {
        id: "role",
        numeric: false,
        disablePadding: true,
        label: "Role",
      },
      {
        id: "notes",
        numeric: false,
        disablePadding: true,
        label: "Notes",
      },
    ];

    setHeadCellList(headCells);
  };

  const onDelete = () => {
    console.log("DELETE TEST");

    // API CALL TO PASS THE "SELECTED" STATE VARIABLE TO DELETE
    // SHOULD BE A LIST OF DELETABLE OBJECTS W/ ID'S
    // NEED TO IMPLEMENT THIS FUNCTION FOR EVERY TABLE
  };

  // const denestMachineData = (rows) => {
  //   rows.map((row, index) => {
  //     Object.entries(row.maincontact).forEach(([key, value]) => {
  //       let temp = "maincontact." + key
  //       row[temp] = value
  //       })
  //     }
  //   )
  // }
  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?
  React.useEffect(() => {
    getData();
    getHeadCells();
    console.log(rowList);
  }, []);

  return (
    <>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          toolbarButtons={
            <>
              <Button
                variant="contained"
                onClick={handleOpenModal}
                startIcon={<OrganizationIcon />}
              >
                Get Org Share Code
              </Button>

              <CustomDialog
                open={openModal}
                icon={<OrganizationIcon />}
                title="Get Organization Share Code"
                handleClose={handleCloseModal}
              >
                <OrgCodeContent />
              </CustomDialog>
              <Tooltip title="Add Organization">
                <Button
                  variant="contained"
                  //Need to create on click modal for organization
                  startIcon={<SampleIcon />}
                  sx={{ ml: 1 }}
                >
                  Add Organization
                </Button>
              </Tooltip>
            </>
          }
          selected={selected}
          setSelected={setSelected}
          onDelete={onDelete}
        ></EnhancedTable>
      </Paper>
    </>
  );
}
