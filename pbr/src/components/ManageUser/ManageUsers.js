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

  React.useEffect(async () => {
    await getOrganizations();
    await getUsers();
    getHeadCells();
  }, []);

  React.useEffect(async () => {
    await getUsers();
  }, [organization]);

  const getUsers = async () => {
    let orgId = user.organization_id;
    if (user.role === 0) {
      orgId = organization;
    }
    await fetch(`/api/user/organization/${orgId}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        assignRowHtml(data.rows);
        setRowList(data.rows);
        console.log(rowList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getOrganizations = async () => {
    if (user.role === 0) {
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
    console.log("sending request for edit user");
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
    if (user.role === 0 || user.role === 1) {
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
          toolbarButtons={<>{user.role === 0 && <OrganizationDropdown />}</>}
          onEdit={onEdit}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {openEditUsersModal ? (
              <EditUsers
                roleMap={roleMap}
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
