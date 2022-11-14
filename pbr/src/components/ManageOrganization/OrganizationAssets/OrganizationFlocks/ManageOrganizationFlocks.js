import React from "react";

import { Paper, Button, Tooltip, IconButton, Chip, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import useAuth from "../../../../services/useAuth";
import EnhancedTable from "../../../EnhancedTable/EnhancedTable";
import AddOrganizationFlocks from "./AddOrganizationFlocks";


export default function ManageOrganizationFlocks({
  organization,
  sources
}) {
  const { checkResponseAuth, user } = useAuth();
  const [flocks, setFlocks] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [openAddOrganizationFlockModal, setOpenAddOrganizationFlockModal] =
  React.useState(false);

  React.useEffect(async () => {
    await getFlocks();

    getHeadCells();
  }, []);

  const getFlocks = async () => {
    await fetch(`/api/flock/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFlocks(data);
        console.log(flocks);
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

  const assignRowHtml = (rows) => {
    rows.map((row) => {
      row.status = (
        <>
          <Chip label={row.status} color="primary" size="small" />
        </>
      );
      row.birthday = new Date(row.birthday).toLocaleString(
        "en-US",
        {
          timeZone: "America/New_York",
        }
      );
    });
  };

  const handleOpenAddOrganizationFlocksModal = () => {
    setOpenAddOrganizationFlockModal(true);
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
              organization={organization}
              sources={sources}
              //Remove this later when I figure out how to input birthday
              birthday={"sfdf"}
            />
          </Grid>

        <EnhancedTable
          headCells={headCellList}
          rows={flocks}
          selected={selected}
          setSelected={setSelected}
        ></EnhancedTable>

      </Paper>
    </>
  );
}
