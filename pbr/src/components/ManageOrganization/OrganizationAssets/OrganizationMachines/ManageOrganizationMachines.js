import React from "react";

import { Paper, Button, Tooltip, IconButton, Chip, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import useAuth from "../../../../services/useAuth";
import EnhancedTable from "../../../EnhancedTable/EnhancedTable";
import AddOrganizationMachines from "./AddOrganizationMachines";


export default function ManageOrganizationMachines({
  organization
}) {
  const { checkResponseAuth, user } = useAuth();
  const [machines, setMachines] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [openAddOrganizationMachineModal, setOpenAddOrganizationMachineModal] = React.useState(false);

  React.useEffect(async () => {
    await getMachines();

    getHeadCells();
  }, []);

  const getMachines = async () => {
    await fetch(`/api/machine/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachines(data)
        assignRowHtml(data);
      });
  };


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

  const assignRowHtml = (rows) => {
    rows.map((row) => {
      row.status = (
        <>
          <Chip label={row.status} color="primary" size="small" />
        </>
      );
    });
  };

  const handleOpenAddOrganizationMachinesModal = () => {
    setOpenAddOrganizationMachineModal(true);
  };

  return (
    <>
      <Paper>
        <Grid item sm={12}>
          <Typography variant="h1" align="center">Machines</Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
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
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

      </Paper>
    </>
  );
}
