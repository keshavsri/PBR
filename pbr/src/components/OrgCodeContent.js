import React from "react";
import {Typography, Box, FormControl, InputLabel, Select, MenuItem, IconButton} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';


export default function OrgCodeContent() {
  const [selectedOrganization, setSelectedOrganization] = React.useState("");
  const [orgCodeData, setOrgCodeData] = React.useState({});
  const [orgList, setOrgList] = React.useState([]);


  const handleOrgChange = (event) => {
    setSelectedOrganization(event.target.value);
    getOrgCode();
    console.log("New Org Selected: ", selectedOrganization);

  };

  const refreshCode = () => {
    console.log(`Generating new Org Code for ${selectedOrganization.name}`);
    // fetch(`/api/organization/refreshOrgCode/${selectedOrganization.id}`, {
    //   method: "POST",
    // })
    //   .then((response) => {
    //     return response.json();
    //   }).then((data) => {
    //     setOrgCodeData(data);
    //   })

    let mockedOrgCode = {orgCode: "666666", validTill: "2022-12-10T13:45:00.000Z"};
    setOrgCodeData(mockedOrgCode);

  };


  const getOrgList = () => {
  // fetch("/api/user/organizations", {method: "GET",})
  //   .then((response) => {
  //     return response.json();
  //   }).then((data) => {
  //     console.log(data);
  //     setOrgList(data);
  //   })
  
    let mockedOrgList = [
      {id: "1", name: "Organization 1", address: "123 Main Street, Raleigh, NC 27606"},
      {id: "2", name: "Organization 2", address: "69 Hillsborough Street, Raleigh, NC 27607"}
    ];
    console.log(mockedOrgList);
    setOrgList(mockedOrgList);
  }

  const getOrgCode = () => {
    // fetch(`/api/organization/orgCode/${selectedOrganization.id}`, {method: "GET",})
    //   .then((response) => {
    //     return response.json();
    //   }).then((data) => {
    //     console.log(data);
    //     setOrgCodeData(data);
    //   })
    
    let mockedOrgCode = {orgCode: "873450", validTill: "2021-12-10T13:45:00.000Z"};
    console.log(mockedOrgCode);
    setOrgCodeData(mockedOrgCode);
  }

  React.useEffect(() => {
    getOrgList();
  }, []);




  return (
  <>
    <Typography variant="p">
      Select an Organization to display the join code for.
    </Typography>
    <Box>
      <FormControl  sx={{ m: 1, width: 300, mt: 3 }}>
        <InputLabel>Select Organization</InputLabel>
        <Select
          value={selectedOrganization}
          label="Select Organization"
          onChange={handleOrgChange}
        >
          {orgList
            .map((org, index) => {
              return(
                <MenuItem value={org} key={index}>{org.name} ({org.address})</MenuItem>
              );
            })
          }
        </Select>
      </FormControl>
    </Box>
    { orgCodeData.orgCode &&
      <Box>
        <Typography variant="p">
          The join code for {selectedOrganization.name} is:
        </Typography>

        <Typography variant="h4">
          {orgCodeData.orgCode}
          <IconButton aria-label="Refresh Code" onClick={refreshCode}>
            <RestoreIcon/>
          </IconButton>
        </Typography>

        <Typography variant="p">
          Valid till: {new Date(orgCodeData.validTill).toLocaleString()}
        </Typography>

      </Box>
    }
  </>);
}
