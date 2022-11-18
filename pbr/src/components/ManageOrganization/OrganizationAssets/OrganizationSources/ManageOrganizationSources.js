import React from "react";

import { Paper, Button, Tooltip, IconButton, Chip, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import useAuth from "../../../../services/useAuth";
import EnhancedTable from "../../../EnhancedTable/EnhancedTable";
import AddOrganizationSources from "./AddOrganizationSources";


export default function ManageOrganizationSources({
  organization,
  sources,
  getSources,
  getFlocks,
  roles
}) {
  const { checkResponseAuth, user } = useAuth();
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [openAddOrganizationSourceModal, setOpenAddOrganizationSourceModal] = React.useState(false);

  React.useEffect(async () => {
    await (getSources.id);

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

  const handleOpenAddOrganizationSourcesModal = () => {
    setOpenAddOrganizationSourceModal(true);
  };

  const deleteSource = async (deletedSourceId) => {
    await fetch(`/api/source/${deletedSourceId}`, { method: "DELETE" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
    await getSources(organization.id);
    await getFlocks(organization.id);
  };

  const onDelete = async () => {
    if (user.role === roles["Super_Admin"] || user.role === roles["Admin"]) {
      selected.map((deletedSourceId) => {
        deleteSource(deletedSourceId);
      });
      setSelected([]);
    }
  };

  return (
    <>
      <Paper>

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
          onDelete={onDelete}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

      </Paper>
    </>
  );
}
