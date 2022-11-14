import React from "react";

import { Paper, Button, Tooltip, IconButton, Chip, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import useAuth from "../../../../services/useAuth";
import EnhancedTable from "../../../EnhancedTable/EnhancedTable";
import AddOrganizationSources from "./AddOrganizationSources";


export default function ManageOrganizationSources({
  organization,
  sources,
  setSources
}) {
  const { checkResponseAuth, user } = useAuth();
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [openAddOrganizationSourceModal, setOpenAddOrganizationSourceModal] =
  React.useState(false);

  React.useEffect(async () => {
    await getSources();

    getHeadCells();
  }, []);

  const getSources = async () => {
    await fetch(`/api/source/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSources(data)
        assignRowHtml(data);
      });
  };

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
        id: "street_address",
        numeric: false,
        disablePadding: true,
        label: "Street Address",
      },
      {
        id: "city",
        numeric: false,
        disablePadding: true,
        label: "City",
      },
      {
        id: "state",
        numeric: false,
        disablePadding: true,
        label: "State",
      },
      {
        id: "zip",
        numeric: false,
        disablePadding: true,
        label: "Zip Code",
      },
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

  const handleOpenAddOrganizationSourcesModal = () => {
    setOpenAddOrganizationSourceModal(true);
  };

  return (
    <>
      <Paper>
        <Grid item sm={12}>
          <Typography variant="h1" align="center">Sources</Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button variant="contained" onClick={handleOpenAddOrganizationSourcesModal}>Create New Source</Button>
        </Grid>

        <Grid item xs={12} sm={12}>
            <AddOrganizationSources
              getSources={getSources}
              openAddOrganizationSourceModal={openAddOrganizationSourceModal}
              setOpenAddOrganizationSourceModal={setOpenAddOrganizationSourceModal}
              organization={organization}
            />
          </Grid>

        <EnhancedTable
          headCells={headCellList}
          rows={sources}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

      </Paper>
    </>
  );
}
