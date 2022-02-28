import React from "react";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

export default function OrgCodeContent() {
  const [filterState, setFilterState] = React.useState({});

  const getOrgCode = () => {
    // fetch(`/api/organization/orgCode/${selectedOrganization.id}`, {method: "GET",})
    //   .then((response) => {
    //     return response.json();
    //   }).then((data) => {
    //     console.log(data);
    //     setOrgCodeData(data);
    //   })
    // let mockedOrgCode = {
    //   orgCode: "873450",
    //   validTill: "2021-12-10T13:45:00.000Z",
    // };
    // console.log(mockedOrgCode);
    // setOrgCodeData(mockedOrgCode);
  };

  React.useEffect(() => {}, []);

  return (
    <>
      <Typography variant="h3">Filter Table Data</Typography>
      <Typography variant="p">General</Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
              <InputLabel>Select Organization</InputLabel>
              <Select
                value={selectedOrganization}
                label="Select Organization"
                onChange={handleOrgChange}
              ></Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box></Box>
      {orgCodeData.orgCode && (
        <Box>
          <Typography variant="p">
            The join code for {selectedOrganization.name} is:
          </Typography>

          <Typography variant="h4">
            {orgCodeData.orgCode}
            <IconButton aria-label="Refresh Code" onClick={refreshCode}>
              <RestoreIcon />
            </IconButton>
          </Typography>

          <Typography variant="p">
            Valid till: {new Date(orgCodeData.validTill).toLocaleString()}
          </Typography>
        </Box>
      )}
    </>
  );
}
