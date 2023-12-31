import React from "react";
import EditUsers from "./EditUsers";

import { Paper, Button, Tooltip, IconButton, Chip, Box } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useAuth from "../../services/useAuth";
import EnhancedTable from "../EnhancedTable/EnhancedTable";

export default function ManageUsers() {
  const { checkResponseAuth, user } = useAuth();
  const [rowList, setRowList] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [roles, setRoles] = React.useState({});
  const [organizations, setOrganizations] = React.useState([]);
  const [openEditUsersModal, setOpenEditUsersModal] = React.useState(false);
  const [organization, setOrganization] = React.useState(user.organization_id);

  const roleMap = {
    0: "Super Admin",
    1: "Admin",
    2: "Supervisor",
    3: "Data Collector",
    4: "Guest",
  };

  React.useEffect( async () => {
     getRoles();
     getHeadCells();
  }, []);

  React.useEffect( () => {
     getUsers();
     getRoles();
  }, [organization]);

  React.useEffect( () => {
    getOrganizations();
  }, [roles]);

  const getRoles = async () => {
    const response = await fetch(`/api/enum/roles`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    console.log(data);
    setRoles(data);
  };

  const getUsers = async () => {
    let orgId = user.organization_id;
    if (user.role === roles["Super_Admin"]) {
      orgId = organization;
    }
    await fetch(`/api/user/organization/${orgId}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        assignRowHtml(data.rows);
        setRowList(data.rows);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  const getOrganizations = async () => {
    if (user.role === roles["Super_Admin"]) {
      await fetch(`/api/organization`, { method: "GET" })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setOrganizations(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteUser = async (deletedUserId) => {
    await fetch(`/api/user/${deletedUserId}`, { method: "DELETE" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
    await getUsers();
  };

  const editUser = async (editedUser) => {
    await fetch(`/api/user/${selected[0]}`, {
      method: "PUT",
      body: JSON.stringify(editedUser),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setOpenEditUsersModal(false);
        getUsers();
        setSelected([]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = async () => {
    if (user.role === roles["Super_Admin"] || user.role === roles["Super_Admin"]) {
      selected.map((deletedUserId) => {
        deleteUser(deletedUserId);
      });
      setSelected([]);
    }
  };

  const onChangeOrganization = (event) => {
    setOrganization(event.target.value);
    setSelected([]);
  };

  const onEdit = () => {
    setOpenEditUsersModal(true);
  };

  const assignRowHtml = (rows) => {
    rows.map((row, index) => {
      row.role_id = row.role;
      row.role = Object.keys(roles).find(key => roles[key] === user.role);
      row.deletable = isDeletable(row);
    });
  };

  const isDeletable = (row) => {
    if (user.role < row.role_id && user.role === roles["Data_Collector"]) {
      return true;
    } else if (user.id === row.id) {
      return true;
    } else {
      return false;
    }
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
      /**
      {
        id: "organization",
        numeric: false,
        disablePadding: true,
        label: "Organization",
      },
      */
      {
        id: "email",
        numeric: false,
        disablePadding: true,
        label: "Email",
      },
      {
        id: "phone_number",
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
      <Grid item xs={12} sm={6}>
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
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              );
            })}
          </Select>
          <InputLabel id="demo-simple-select-label">Organization</InputLabel>
        </FormControl>
      </Grid>
    );
  };


  return (
    <>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          onDelete={onDelete}
          toolbarButtons={<>{user.role === roles["Super_Admin"] && <OrganizationDropdown />}</>}
          onEdit={onEdit}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {openEditUsersModal ? (
              <EditUsers
                roleMap={roleMap}
                roles={roles}
                currentUser={user}
                user={rowList.find((user) => user.id === selected[0])}
                editUser={editUser}
                openEditUsersModal={openEditUsersModal}
                setOpenEditUsersModal={setOpenEditUsersModal}
              />
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
