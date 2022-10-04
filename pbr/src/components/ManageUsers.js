import React from "react";
import OrganizationIcon from "@mui/icons-material/Apartment";
import CustomDialog from "./CustomDialog";
import EditUsers from "./EditUsers"

import { Paper, Button, Tooltip, IconButton, Chip, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
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
import EnhancedTable from "./DataViewTable/EnhancedTable";

export default function ManageUsers() {
  const { checkResponseAuth, user } = useAuth();
  const [rowList, setRowList] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);
  const [openEditUsersModal, setOpenEditUsersModal] = React.useState(false);
  const [organization, setOrganization] = React.useState(user.organization_id);


  const roleMap = {
    0: "Super Admin",
    1: "Admin",
    2: "Supervisor",
    3: "Data Collector",
    4: "Guest"
  }

  React.useEffect(() => {
    getOrganizations();
    getUsers();
    getHeadCells();
  }, []);

  React.useEffect(() => {
    getUsers();
  }, [organization]);

  const getUsers = () => {
    let orgId = user.organization_id;
    if (user.role === 0) {
      orgId = organization;
    }
    fetch(`/api/user/users/${orgId}`, { method: "GET", })
      .then((response) => {
        return response.json();
      }).then((data) => {
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
          setOrganizations(data);
        }).catch((error) => {
          console.log(error);
        })
    }
  };

  const deleteUser = (deletedUserId) => {
    fetch(`/api/user/${deletedUserId}`, { method: "DELETE", })
      .then((response) => {
        return response.json();
      }).then((data) => {
      }).catch((error) => {
        console.log(error);
      })
  }

  const editUser = (editedUser) => {
    fetch(`/api/user/users/${selected[0]}`,
          { method: "PUT",
            body: JSON.stringify(editedUser),
            headers: {"Content-Type" : "application/json"}})
      .then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
      setOpenEditUsersModal(false);
      getUsers();
      setSelected([])
  }

  const onDelete = () => {
    if (user.role === 0 || user.role === 1) {
      selected.map((deletedUserId) => {
        deleteUser(deletedUserId);
      }, () => {
        getUsers();
      })
    }
  }
  
  const onChangeOrganization = (event) => {
    setOrganization(event.target.value);
  }

  const onEdit = () => {
    setOpenEditUsersModal(true);
  }
 
  const assignRowHtml = (rows) => {
    rows.map((row, index) => { 
      console.log(row.id);
      console.log(user.role);  
      row.role_id = row.role;
      row.role = roleMap[Number(row.role)];
      row.deletable = isDeletable(row);
      
    });
  };

  const isDeletable = (row) => {
    console.log(user.id, row.id);
    console.log(user.id === row.id);
    if (user.role < row.role_id && user.role != 3) {
      return true;
    } else if (user.id === row.id) {
      return true;
    }
      else {
      return false;
    }
  }

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

  const OrganizationDropdown = () => {
    return (
      <Grid item xs={12} sm={6} >
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={organization}
            onChange={onChangeOrganization}
            label="Organization"
          >
            {organizations.map((org) => {
              return (
                <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
              )
            })}
          </Select>
          <InputLabel id="demo-simple-select-label">Organization</InputLabel>
        </FormControl>
      </Grid >
    )
  }

  return (
    <>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          onDelete={onDelete}
          toolbarButtons={
            <>
            {
              user.role === 0 &&
              <OrganizationDropdown/>
            }     
            </>
          }

          onEdit={onEdit}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            { openEditUsersModal ? (
              <EditUsers
              roleMap = {roleMap}
              currentUser = {user}
              user = {rowList.find(user => user.id === selected[0])}
              editUser={editUser}
              openEditUsersModal={openEditUsersModal}
              setOpenEditUsersModal={setOpenEditUsersModal}
            />) : null
            }
          </Grid>
        </Grid>

      </Paper>
    </>
  );
}
