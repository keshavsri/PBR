import React from "react";

import { Paper, Button, Tooltip, IconButton, Chip, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import useAuth from "../../../../services/useAuth";
import EnhancedTable from "../../../EnhancedTable/EnhancedTable";
import AddOrganizationFlocks from "./AddOrganizationFlocks";


export default function ManageOrganizationFlocks({
  organization,
  flocks,
  getFlocks,
  sources,
  roles
}) {
  const { checkResponseAuth, user } = useAuth();
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [openAddOrganizationFlockModal, setOpenAddOrganizationFlockModal] = React.useState(false);

  React.useEffect(async () => {
    await getFlocks(organization);

    getHeadCells();
  }, []);

  const getHeadCells = () => {
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
        id: "strain",
        numeric: false,
        disablePadding: true,
        label: "Strain",
      },
      {
        id: "species",
        numeric: false,
        disablePadding: true,
        label: "Species",
      },
      {
        id: "production_type",
        numeric: false,
        disablePadding: true,
        label: "Production Type",
      },
      {
        id: "gender",
        numeric: false,
        disablePadding: true,
        label: "Gender",
      },
      {
        id: "birthday",
        numeric: false,
        disablePadding: true,
        label: "Birthday",
      },
      {
        id: "source_name",
        numeric: false,
        disablePadding: true,
        label: "Source",
      }
    ];
    setHeadCellList(headCells);
  };

  const handleOpenAddOrganizationFlocksModal = () => {
    setOpenAddOrganizationFlockModal(true);
  };

  const deleteFlock = async (deletedFlockId) => {
    await fetch(`/api/flock/${deletedFlockId}`, { method: "DELETE" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
    await getFlocks();
  };

  const onDelete = async () => {
    if (user.role === roles["Super_Admin"] || user.role === roles["Admin"]) {
      selected.map((deletedFlockId) => {
        deleteFlock(deletedFlockId);
      });
      setSelected([]);
    }
  };

  return (
    <>
      <Paper>
        <Grid item sm={12}>
          <Typography variant="h1" align="center">Flocks</Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button variant="contained" onClick={handleOpenAddOrganizationFlocksModal}>Create New Flock</Button>
        </Grid>

        <Grid item xs={12} sm={12}>
            <AddOrganizationFlocks
              getFlocks={getFlocks}
              openAddOrganizationFlockModal={openAddOrganizationFlockModal}
              setOpenAddOrganizationFlockModal={setOpenAddOrganizationFlockModal}
              sources={sources}
            />
          </Grid>

        <EnhancedTable
          headCells={headCellList}
          rows={flocks}
          onDelete={onDelete}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

      </Paper>
    </>
  );
}
