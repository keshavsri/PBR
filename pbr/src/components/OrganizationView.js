import * as React from "react";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";

import SampleIcon from "@mui/icons-material/Science";
// Might need to change
import EnhancedTable from "./DataViewTable/EnhancedTable";
import EditIcon from "@mui/icons-material/Edit";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

// const getSomethingAPICall = () => {
//   fetch(`/api/sample`, {method: "GET",})
//     .then((response) => {
//       return response.json();
//     }).then((data) => {
//       console.log(data);
//       setRowList(data.row);
//       setHeadCellList(data.types);
//     })
//     addApiColumnNamesToHeadCells();
//     console.log(headCells)
//     denestMachineData(rows)
//     assignRowHtml()
//     console.log(rows)
// console.log(headCells)
// };

export default function OrganizationView() {
  const [rowList, setRowList] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const assignRowHtml = (rows) => {
    rows.map((row, index) => {
      return (row.buttons = (
        <>
          <IconButton aria-label="edit" size="small">
            <EditIcon />
          </IconButton>
        </>
      ));
    });
  };

  const getData = () => {
    let apiRows = [
      {
        deletable: true,
        id: 1,
        name: "NCSU",
        street_address: "123 Main St.",
        city: "Raleigh",
        state: "NC",
        zip: "27607",
        maincontact: {
          id: "",
          organization: "",
          email: "",
          name: "Rosio Crespo",
          phone: "",
          notes: "",
        },
        org_signup_code: "123456",
        notes: "N/A",
      },
      {
        deletable: true,
        id: 2,
        name: "UNC",
        street_address: "456 Main St.",
        city: "Chapel Hill",
        state: "NC",
        zip: "27607",
        maincontact: {
          id: "",
          organization: "",
          email: "",
          name: "Other Name",
          phone: "",
          notes: "",
        },
        org_signup_code: "654321",
        notes: "N/A",
      },
    ];
    denestMachineData(apiRows);
    assignRowHtml(apiRows);
    setRowList(apiRows);
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
        label: "Zip",
      },
      {
        id: "maincontact.name",
        numeric: false,
        disablePadding: true,
        label: "Main Contact",
      },
      {
        id: "org_signup_code",
        numeric: false,
        disablePadding: true,
        label: "Org Signup Code",
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


  const denestMachineData = (rows) => {
    rows.map((row, index) => {
      Object.entries(row.maincontact).forEach(([key, value]) => {
        let temp = "maincontact." + key;
        row[temp] = value;
      });
    });
  };
  const onDelete = () => {
    console.log("DELETE TEST")

    // API CALL TO PASS THE "SELECTED" STATE VARIABLE TO DELETE
    // SHOULD BE A LIST OF DELETABLE OBJECTS W/ ID'S
    // NEED TO IMPLEMENT THIS FUNCTION FOR EVERY TABLE
  }
  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?

  React.useEffect(() => {
    getData();
    getHeadCells();
    console.log(rowList);
  }, []);

  return (
    <>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          toolbarButtons={
            <>
              <Tooltip title="Add Organization">
                <Button
                  variant="contained"
                  //Need to create on click modal for organization
                  startIcon={<SampleIcon />}
                  sx={{ ml: 1 }}
                >
                  Add Organization
                </Button>
              </Tooltip>
            </>
          }
          selected={selected}
          setSelected={setSelected}
          onDelete={onDelete}
        ></EnhancedTable>
      </Paper>
    </>
  );
}
