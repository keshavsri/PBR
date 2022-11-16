import React from "react";

import { Paper, Button, Tooltip, IconButton, Chip, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import useAuth from "../../../../services/useAuth";
import EnhancedTable from "../../../EnhancedTable/EnhancedTable";
import AddOrganizationMachines from "./AddOrganizationMachines";

export default function ManageOrganizationMachines({
  organization,
  machines,
  getMachines,
  roles
}) {
  const { checkResponseAuth, user } = useAuth();
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [openAddOrganizationMachineModal, setOpenAddOrganizationMachineModal] = React.useState(false);

  React.useEffect(async () => {
    await getMachines(organization);

    getHeadCells();
  }, []);

  const getHeadCells = () => {
    const headCells = [
      {
        id: "buttons",
      },
      {
        id: "serial_number",
        numeric: false,
        disablePadding: true,
        label: "Serial Number",
      },
      {
        id: "machine_type_id",
        numeric: false,
        disablePadding: true,
        label: "Machine Type",
      }
    ];
    setHeadCellList(headCells);
  };

  const handleOpenAddOrganizationMachinesModal = () => {
    setOpenAddOrganizationMachineModal(true);
  };

  const deleteMachine = async (deletedMachineId) => {
    await fetch(`/api/machine/${deletedMachineId}`, { method: "DELETE" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
    await getMachines(organization);
  };

  const onDelete = async () => {
    if (user.role === roles["Super_Admin"] || user.role === roles["Admin"]) {
      selected.map((deletedMachineId) => {
        deleteMachine(deletedMachineId);
      });
      setSelected([]);
    }
  };

  return (
    <>
      <Paper>
        <Grid item xs={12} sm={12}>
          <Typography variant="h1" align="center">Machines</Typography>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Button variant="contained" onClick={handleOpenAddOrganizationMachinesModal}>Create New Machine</Button>
        </Grid>

        <Grid item xs={12} sm={12}>
            <AddOrganizationMachines
              getMachines={getMachines}
              openAddOrganizationMachineModal={openAddOrganizationMachineModal}
              setOpenAddOrganizationMachineModal={setOpenAddOrganizationMachineModal}
              organization={organization}
            />
          </Grid>

        <EnhancedTable
          headCells={headCellList}
          rows={machines}
          onDelete={onDelete}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

      </Paper>
    </>
  );
}
