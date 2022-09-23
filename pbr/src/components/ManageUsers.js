import React from "react";
import OrganizationIcon from "@mui/icons-material/Apartment";
import CustomDialog from "./CustomDialog";
import OrgCodeContent from "./OrgCodeContent";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";

import SampleIcon from "@mui/icons-material/Science";
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import FilterListIcon from "@mui/icons-material/FilterList";
import useAuth from "../services/useAuth";

// Might need to change
import DataViewAddSample from "./DataViewSample/AddSample";
import EnhancedTable from "./DataViewTable/EnhancedTable";
import BulkIcon from "@mui/icons-material/UploadFile";
import ReportIcon from "@mui/icons-material/Assessment";
import EditIcon from "@mui/icons-material/Edit";
import FactCheckIcon from "@mui/icons-material/FactCheck";

export default function ManageUsers() {
  const [openModal, setOpenModal] = React.useState(false);
  const { checkResponseAuth, user } = useAuth();
  const [rowList, setRowList] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const [organization, setOrganization] = React.useState(1);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  React.useEffect(() => {
    getOrganizations();
    getUsers();
    getHeadCells();
    console.log(rowList);
  }, []);

  const getUsers = () => {
    let orgId = user.organization_id;
    if (user.role === 0) {
      orgId = organization;
    }
    fetch(`/api/user/users/${orgId}`, { method: "GET", })
      .then((response) => {
        console.log(response);
        return response.json();
      }).then((data) => {
        console.log(data);
        assignRowHtml(data.rows);
        setRowList(data.rows);
      }).catch((error) => {
        console.log(error);
      })
  };

  const getOrganizations = () => {
    if (user.role === 0) {
      fetch(`/api/organization`, { method: "GET", })
        .then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          setOrganizations(data);
        }).catch((error) => {
          console.log(error);
        })
    }
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

  const organizationDropdown = () => {
    return (
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={organization}
            label="Organization"

          >
            {organizations.map((org) => {
              console.log(organizations);
              return (
<MenuItem value={org.id}>{org.name}</MenuItem>
              )
              
            })}
          </Select>
          <InputLabel id="demo-simple-select-label">Organization</InputLabel>
        </FormControl>
      </Grid>
    )

  }


  return (
    <>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          toolbarButtons={
            (user.role === 0) && (
              <>
                {organizationDropdown()}
              </>
            )

          }
          selected={selected}
          setSelected={setSelected}
          onDelete={onDelete}
        ></EnhancedTable>
      </Paper>
    </>
  );
}
