import * as React from "react";

import { Paper, Chip } from "@mui/material";

import DataViewSampleModal from "./DataViewSample/SampleModal";
import DataViewFilterModal from "./FilterModal";
import DVTableToolbar from "./DVTableToolbar";

import EnhancedTable from "./DataViewTable/EnhancedTable";

import { makeStyles } from "@mui/styles";
import { DataViewProvider } from "../services/useDataView";
import useAuth from "../services/useAuth";

const useStyles = makeStyles({});

const getSamples = () => {
  fetch(`/api/sample/`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // setRowList(data.rows);
      // setHeadCellList(data.types);
    });

  // addApiColumnNamesToHeadCells(headCellNamesFromAPI);
  // console.log(headCellList);
  // denestMachineData(rowList);
  // assignRowHtml();
  // console.log(rows);
};

export default function DataView() {
  const [rowList, setRowList] = React.useState([]);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);

  const { checkResponseAuth } = useAuth();

  const assignRowHtml = (rows) => {
    rows.map((row, index) => {
      row.status = (
        // NEED TO ADD CONDITIONAL FOR COLOR
        <>
          <Chip label={row.status} color="primary" size="small" />
        </>
      );

      // Used for slotting in edit and validation buttons - no functionality implemented yes
      // row.buttons = (
      //   <>
      //     <IconButton aria-label="edit" size="small">
      //       <EditIcon />
      //     </IconButton>
      //     <IconButton aria-label="validate" size="small">
      //       <FactCheckIcon />
      //     </IconButton>
      //   </>
      // );
      row.timestamp_added = new Date(row.timestamp_added).toLocaleString();
      row["flock.birthday"] = new Date(row["flock.birthday"]).toLocaleString();
      // TEMPORARY
      row.deletable = true;
    });
  };

  const getData = async () => {
    await fetch(`/api/sample/`, {method: "GET",})
    .then((response) => {
      return response.json();
    }).then(checkResponseAuth)
    .then((data) => {
      console.log(data);
      denestMachineData(data.rows);
      assignRowHtml(data.rows);
      setRowList(data.rows);
      getHeadCells(data.types);
      
    })
    // denestMachineData(apiRows);
    // assignRowHtml(apiRows);
    // setRowList(apiRows);
  };

  const getHeadCells = (types) => {
    const headCells = [
      {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "ID",
      },
      {
        id: "buttons",
      },
      {
        id: "flock.id",
        numeric: false,
        disablePadding: true,
        label: "Flock ID",
      },
      {
        id: "flock.name",
        numeric: false,
        disablePadding: true,
        label: "Flock Name",
      },
      {
        id: "flock.source_name",
        numeric: false,
        disablePadding: true,
        label: "Source",
      },
      {
        id: "flock.production_type",
        numeric: false,
        disablePadding: true,
        label: "Production Type",
      },
      {
        id: "timestamp_added",
        numeric: false,
        disablePadding: true,
        label: "Date Entered",
      },
      {
        id: "flock.birthday",
        numeric: false,
        disablePadding: true,
        label: "Birthday",
      },
      {
        id: "flock_age_combined",
        numeric: false,
        disablePadding: true,
        label: "Flock Age",
      },
      {
        id: "flock.gender",
        numeric: false,
        disablePadding: true,
        label: "Gender",
      },
      {
        id: "validation_status",
        numeric: false,
        disablePadding: true,
        label: "Status",
      },
      {
        id: "sample_type",
        numeric: false,
        disablePadding: true,
        label: "Sample Type",
      },
    ];

    addApiColumnNamesToHeadCells(types, headCells);
    setHeadCellList(headCells);
    console.log(headCells);

  };


  const addApiColumnNamesToHeadCells = (headCellNamesFromAPI, headCells) => {
    headCellNamesFromAPI.map((item) => {
      item.data.type.map((point, index) => {
        headCells.push(createHeadCell(point, item.machineName, index));
      
      });
    });
  };

  function createHeadCell(point, machineName, index) {
    return {
      machineName: machineName,
      name: point.name,
      id: "measurement." + point.id,
      numeric: false,
      disablePadding: true,
      label: " " + point.abbreviation + " (" + point.units + ")",
      sublabel: "" + machineName,
    };
  }
  const denestMachineData = (rows) => {
    rows.map((row, index) => {
      row["flock_age_combined"] = "" + row.flock_age + " " + row.flock_age_unit;
      row.measurement_values.map((m, index2) => {
          let temp = "measurement." + m.measurement_id;
          row[temp] = m.value + " " + m.measurement.measurementtype.units;
      });
      Object.keys(row.flock).map((key) => {
        let temp = "flock." + key;
        row[temp] = row.flock[key];
        if(key == "source_id"){
          row.organization.sources.map((source) => {
            if(source["id"] == row.flock["id"])
              row["flock.source_name"] = source["name"];
          });
        }
      });
    });
  };

  const onDelete = async () => {
    console.log("DELETE TEST")
    let path = `/api/sample/`
    selected.map(async (id, index) => {
      await fetch(path + id, {method: "DELETE",})
      .then((response) => {
        return response.json();
      })
    })
    // API CALL TO PASS THE "SELECTED" STATE VARIABLE TO DELETE
    // SHOULD BE A LIST OF DELETABLE OBJECTS W/ ID'S
    // NEED TO IMPLEMENT THIS FUNCTION FOR EVERY TABLE
  };
  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?
  React.useEffect(() => {
    getData();
    getSamples();
  }, []);

  return (
    <DataViewProvider>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          toolbarButtons={
            <DVTableToolbar/>
          }
          selected={selected}
          setSelected={setSelected}
          onDelete={onDelete}
        ></EnhancedTable>
      </Paper>
      <DataViewFilterModal setRowList={setRowList} setHeadCellList={setHeadCellList}/>
      <DataViewSampleModal />
    </DataViewProvider>
  );
}
