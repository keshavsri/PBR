import * as React from "react";

import { Paper, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import SavedToPendingModal from "./SavedToPendingModal";

import DataViewSampleModal from "./DataViewSample/SampleModal";
import DataViewFilterModal from "./FilterModal";
import DVTableToolbar from "./DVTableToolbar";

import EnhancedTable from "./DataViewTable/EnhancedTable";

import { makeStyles } from "@mui/styles";
import { DataViewProvider } from "../services/useDataView";
import useAuth from "../services/useAuth";
import ReviewSampleModal from "./DataViewSample/ReviewSampleModal";

const useStyles = makeStyles({});

export default function DataView() {
  const [rowList, setRowList] = React.useState([]);
  const [pendingRowList, setPendingRowList] = React.useState([]);
  const [fullRowList, setFullRowList] = React.useState([]);
  const [showOnlyPendingSamples, setShowOnlyPendingSamples] = React.useState(false);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [isSample] = React.useState(true);
  const [openReviewSampleModal, setOpenReviewSampleModal] = React.useState(false);

  const [selectedSamples, setSelectedSamples] = React.useState([]);
  const [pendingSamples, setPendingSamples] = React.useState([]);


  const [SavedToPendingVisibility, setSavedToPendingVisibility] =
    React.useState(false);

  const openSavedToPendingVisibility = () => setSavedToPendingVisibility(true);
  const closeSavedToPendingVisibility = () =>
    setSavedToPendingVisibility(false);

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
      row.timestamp_added = new Date(row.timestamp_added).toLocaleString(
        "en-US",
        {
          timeZone: "America/New_York",
        }
      );
      // TEMPORARY
      row.deletable = true;
    });
  };


  const turnPendingFilterOff = async () => {
    setShowOnlyPendingSamples(false);
    setRowList(fullRowList);
    setPendingRowList([]);
  };

  const filterPendingSamples = async () => {
    
    rowList.map((row) => {
      if (row.validation_status == "Pending") {
        pendingRowList.push(row)
      }
    });
    setFullRowList(rowList);
    setRowList(pendingRowList);
    setShowOnlyPendingSamples(true);
  };

  const getData = async () => {
    await fetch(`/api/sample/`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        denestMachineData(data.rows);
        assignRowHtml(data.rows);
        setRowList(data.rows);
        getHeadCells(data.types);
      });
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
  };

  const addApiColumnNamesToHeadCells = (headCellNamesFromAPI, headCells) => {
    headCellNamesFromAPI.map((machine) => {
      machine.data.map((point, index) => {
        headCells.push(createHeadCell(point.type, machine.machineName, index));
      });
    });
  };

  function createHeadCell(point, machineName, index) {
    let headerLabel = "";
    if (point.abbreviation) {
      headerLabel += point.abbreviation;
    } else {
      headerLabel += point.name;
    }
    if (point.units) {
      headerLabel += ` (${point.units})`;
    }
    return {
      machineName: machineName,
      name: point.name,
      id: "measurement." + point.id,
      numeric: false,
      disablePadding: true,
      label: headerLabel,
      sublabel: "" + machineName,
    };
  }
  const denestMachineData = (rows) => {
    rows.map((row, index) => {
      row["flock_age_combined"] = "" + row.flock_age + " " + row.flock_age_unit;
      row.measurement_values.map((m, index2) => {
        let temp = "measurement." + m.measurement_id;
        row[temp] = m.value;
        if (m.measurement.measurementtype.units) {
          row[temp] += ` ${m.measurement.measurementtype.units}`;
        }
      });
      Object.keys(row.flock).map((key) => {
        let temp = "flock." + key;
        row[temp] = row.flock[key];
        if (key == "source_id") {
          row.organization.sources.map((source) => {
            if (source["id"] == row.flock["id"])
              row["flock.source_name"] = source["name"];
          });
        }
      });
    });
  };

  const onSubmit = () => {
    openSavedToPendingVisibility();
  };




const submitOne = async (id) => {



  
    let path = `/api/sample/datapoint/submit/`;
    
      let temp = path + id;
      await fetch(temp, { method: "PUT" })
        .then((response) => {
          console.log(response.json());
        })
        .then(() => {
          getData();
        });

    setSelected([]);
};

  console.log("Selected samples From Data View: ", selectedSamples);


  const submitAll = async () => {
    let path = `/api/sample/datapoint/submit/`;
    selected.map(async (id, index) => {
      let temp = path + id;
      await fetch(temp, { method: "PUT" })
        .then((response) => {
          console.log(response.json());
        })
        .then(() => {
          getData();
        });
    });
    setSelected([]);
  };

  const acceptSample = async (id) => {
    let path = `/api/sample/datapoint/accept/`;

      let temp = path + id;
      await fetch(temp, { method: "PUT" })
        .then((response) => {
          console.log(response.json());
        })
        .then(() => {
          getData();
        });

        setSelected([]);
  };

const rejectSample = async (id) => {
  let path = `/api/sample/datapoint/reject/`;

    let temp = path + id;
    await fetch(temp, { method: "PUT" })
      .then((response) => {
        console.log(response.json());
      })
      .then(() => {
        getData();
      });

      setSelected([]);
  };

  const onDelete = async () => {
    let path = `/api/sample/datapoint/`;
    selected.map(async (id, index) => {
      let temp = path + id;
      await fetch(temp, { method: "DELETE" })
        .then((response) => {
          // return response.json();
        })
        .then(() => {
          getData();
        });
    });
    setSelected([]);

    // API CALL TO PASS THE "SELECTED" STATE VARIABLE TO DELETE
    // SHOULD BE A LIST OF DELETABLE OBJECTS W/ ID'S
    // NEED TO IMPLEMENT THIS FUNCTION FOR EVERY TABLE
  };

  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?
  React.useEffect(() => {
    getData();
    //setSelected([]);
  }, []);

  return (
    
    <DataViewProvider>
      <Paper>
        <EnhancedTable
          headCells={headCellList}
          rows={rowList}
          toolbarButtons={
            <DVTableToolbar
              filterPendingSamples={filterPendingSamples}
              showOnlyPendingSamples={showOnlyPendingSamples}
              turnPendingFilterOff={turnPendingFilterOff}
            />
          }
          selected={selected}
          setSelected={setSelected}
          setSelectedSamples={setSelectedSamples}
          setPendingSamples={setPendingSamples}
          onDelete={onDelete}
          isSample={isSample}
          setOpenReviewSampleModal={setOpenReviewSampleModal}
          onSubmit={onSubmit}
        ></EnhancedTable>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {SavedToPendingVisibility ? (
              <SavedToPendingModal
                selected={selected}
                submitAll={submitAll}
                submitOne={submitOne}
                rows={rowList}
                selectedSamples={selectedSamples}
                setSelectedSamples={setSelectedSamples}
                SavedToPendingVisibility={SavedToPendingVisibility}
                setSavedToPendingVisibility={setSavedToPendingVisibility}
              />
            ) : null}
          </Grid>
        </Grid>
      </Paper>
      <DataViewFilterModal
        setRowList={setRowList}
        setHeadCellList={setHeadCellList}
        getData={getData}
        rows={rowList}
      />
      <DataViewSampleModal getData={getData} />
      <ReviewSampleModal 
        openReviewSampleModal={openReviewSampleModal}
        setOpenReviewSampleModal={setOpenReviewSampleModal}
        pendingSamples={pendingSamples}
        setPendingSamples={setPendingSamples}
        acceptSample={acceptSample}
        rejectSample={rejectSample}
        turnPendingFilterOff={turnPendingFilterOff}
      />
    </DataViewProvider>
  );
}
