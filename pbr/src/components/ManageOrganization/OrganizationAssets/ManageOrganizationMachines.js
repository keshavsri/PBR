import React from "react";

import { Paper, Button, Tooltip, IconButton, Chip, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import useAuth from "../../../services/useAuth";
import EnhancedTable from "../../EnhancedTable/EnhancedTable";

export default function ManageOrganizationMachines({
  organization
}) {
  const { checkResponseAuth, user } = useAuth();
  const [machines, setMachines] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

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
        id: "machine_type_name",
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

  return (
    <>
      <Paper>
        <Grid item sm={12}>
          <Typography variant="h1" align="center">Machines</Typography>
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
