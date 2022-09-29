import React from "react";
import OrganizationIcon from "@mui/icons-material/Apartment";
import CustomDialog from "./CustomDialog";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";
import OrgCodeContent from './DataViewOrganization/OrgCodeContent';
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

export default function LoggingView() {
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

  const assignRowHtml = (rows) => {
    rows.map((row, index) => {
      row.buttons = (
        <>
          <IconButton aria-label="edit" size="small">
            <EditIcon />
          </IconButton>
        </>
      );
      row.timestamp = new Date(row.timestamp).toLocaleString();
    });
  };

  const getData = () => {
    let apiRows = [
      {
        deletable: true,
        id: 1,
        user: {
          organization: "NCSU",
          email: "rcrespo@ncsu.edu",
          first_name: "Rosio",
          last_name: "Crespo",
          phone: "9191234567",
          roles: "Super Admin",
          notes: "N/A",
        },
        role: "Data Collector",
        organization: "NCSU",
        timestamp: "2022-12-10T13:45:00.000Z",
        action: "Create",
        target: "Add Sample Data (201)",
      },
      {
        deletable: true,
        id: 2,
        user: {
          organization: "NCSU",
          email: "rcrespo@ncsu.edu",
          first_name: "Rosio",
          last_name: "Crespo",
          phone: "9191234567",
          roles: "Super Admin",
          notes: "N/A",
        },
        role: "Data Collector",
        organization: "NCSU",
        timestamp: "2022-12-10T12:45:00.000Z",
        action: "Read",
        target: "Login (102)",
      },
    ];
    denestMachineData(apiRows);
    assignRowHtml(apiRows);
    setRowList(apiRows);
  };

  const getHeadCells = () => {
    const headCells = [
      {
        id: "buttons",
      },
      {
        id: "user.first_name",
        numeric: false,
        disablePadding: true,
        label: "First Name",
      },
      {
        id: "user.last_name",
        numeric: false,
        disablePadding: true,
        label: "Last Name",
      },
      {
        id: "user.organization",
        numeric: false,
        disablePadding: true,
        label: "Organization",
      },
      {
        id: "role",
        numeric: false,
        disablePadding: true,
        label: "Role",
      },
      {
        id: "timestamp",
        numeric: false,
        disablePadding: true,
        label: "Timestamp",
      },
      {
        id: "action",
        numeric: false,
        disablePadding: true,
        label: "Action",
      },
      {
        id: "target",
        numeric: false,
        disablePadding: true,
        label: "Target",
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

  const denestMachineData = (rows) => {
    rows.map((row, index) => {
      Object.entries(row.user).forEach(([key, value]) => {
        let temp = "user." + key;
        row[temp] = value;
        console.log(temp);
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
