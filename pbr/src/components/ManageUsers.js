import React from "react";
import OrganizationIcon from "@mui/icons-material/Apartment";
import CustomDialog from "./CustomDialog";
import OrgCodeContent from "./DataViewOrganization/OrgCodeContent";
import {EditUserForm} from "./EditUsers"

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
  const [editForm, setEditForm] = React.useState([false])

  const roleMap = {
    0: "Super Admin",
    1: "Admin",
    2: "Supervisor",
    3: "Data Collector",
    4: "Guest"
  }

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

  const deleteUser = (deletedUser) => {
    fetch(`/api/user/${deletedUser.id}`, { method: "DELETE", })
      .then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      })
  }

  const editUser = (editedUser) => {
    fetch(`/api/user/users/${editedUser.id}`,
          { method: "PUT",
            body: JSON.stringify(editedUser),
            headers: {"Content-Type" : "application/json"}})
      .then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      })
      setEditForm(false);
      console.log(editForm)
  }

  const onDelete = () => {
    if (user.role === 0 || user.role === 1) {
      selected.map((deletedUser) => {
        deleteUser(deletedUser);
      }, () => {
        getUsers();
      })
    }
  }

  const onEdit = () => {
    setEditForm(true);
    renderEditForm()
  }

  const assignRowHtml = (rows) => {
    rows.map((row, index) => {
      console.log(row.id);
      console.log(user);
      if (user.role === 0 || user.role === 1) {
        row.deletable = true;
      } else {
        row.deletable = false;
      }
      row.role = roleMap[Number(row.role)];
    });
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

  const renderToolbar = () => {
    return (
      <>
        {user.role === 0 &&
          organizationDropdown()
        }
      </>
    );
  }

  const renderEditForm = () => {
    return (
      <EditUserForm
        user={rowList.find(x => x.id === selected[0])}
        editUser={editUser}
        setEditForm={setEditForm}
      />
    );
  }

  return (
    <>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          onDelete={onDelete}
          toolbarButtons={() => {
            return (
              <>
                {renderToolbar()}
              </>
            )
          }}
          onEdit={onEdit}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>
      </Paper>
    </>
  );
}