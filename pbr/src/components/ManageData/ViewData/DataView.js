import * as React from "react";

import { Paper, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import SavedToPendingModal from "../ValidateData/SavedToPendingModal";

import DataViewSampleModal from "../AddData/SampleModal";
import DataViewFilterModal from "./FilterModal";
import DVTableToolbar from "./DVTableToolbar";

import EnhancedTable from "../../EnhancedTable/EnhancedTable";

import { makeStyles } from "@mui/styles";
import { DataViewProvider } from "../../../services/useDataView";
import useAuth from "../../../services/useAuth";
import ReviewSampleModal from "../ValidateData/ReviewSampleModal";

const useStyles = makeStyles({});

export default function DataView() {
  const [sampleList, setSampleList] = React.useState([]);
  const [analytes, setAnalytes] = React.useState([]);
  const [currentCartridgeType, setCurrentCartridgeType] = React.useState({});
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);
  const [pendingRowList, setPendingRowList] = React.useState([]);
  const [fullRowList, setFullRowList] = React.useState([]);
  const [showOnlyPendingSamples, setShowOnlyPendingSamples] =
    React.useState(false);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [isSample] = React.useState(true);
  const [openReviewSampleModal, setOpenReviewSampleModal] =
    React.useState(false);

  const [organizationId, setOrganizationId] = React.useState(1);

  const [selectedSamples, setSelectedSamples] = React.useState([]);
  const [pendingSamples, setPendingSamples] = React.useState([]);

  const [SavedToPendingVisibility, setSavedToPendingVisibility] =
    React.useState(false);

  const openSavedToPendingVisibility = () => setSavedToPendingVisibility(true);

  console.log("SavedToPendingVisibility: ", SavedToPendingVisibility);
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
    setSampleList(fullRowList);
    setPendingRowList([]);
  };

  const filterPendingSamples = async () => {
    sampleList.map((row) => {
      if (row.validation_status == "Pending") {
        pendingRowList.push(row);
      }
    });
    setFullRowList(sampleList);
    setSampleList(pendingRowList);
    setShowOnlyPendingSamples(true);
  };

  const getData = async () => {
    getHeadCells();
    const uri = `/api/sample/org_cartridge_type?organization_id=${organizationId}&cartridge_type_id=${currentCartridgeType.id}`;
    await fetch(uri, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        console.log("current cartridge type: ", cartridgeTypes);
        console.log(data);
        data.forEach((sample) => {
          sample.measurements.map((meas) => {
            sample[meas.analyte.abbreviation] = meas.value;
          });
          sample["flock_name"] = sample.flock.name;
        });
        setSampleList(data);
        assignRowHtml(data);
      });
  };

  const getCartridgeTypes = async () => {
    await fetch(`api/cartridge-type`)
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setCartridgeTypes(data);
        setCurrentCartridgeType(data[0]);
      });
  };

  const getHeadCells = () => {
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
        id: "flock_name",
        numeric: false,
        disablePadding: true,
        label: "Flock Name",
      },

      {
        id: "flock_age",
        numeric: false,
        disablePadding: true,
        label: "Flock Age",
      },

      {
        id: "validation_status",
        numeric: false,
        disablePadding: true,
        label: "Status",
      },
    ];
    if (currentCartridgeType) {
      currentCartridgeType.analytes.forEach((analyte, index) => {
        headCells.push(createHeadCell(analyte, "", index));
      });
    }
    setHeadCellList(headCells);
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
      id: point.abbreviation,
      numeric: false,
      disablePadding: true,
      label: headerLabel,
      sublabel: "" + machineName,
    };
  }

  const onSubmit = () => {
    openSavedToPendingVisibility();
  };

  const submitOne = async (id) => {
    let path = `/api/sample/submit/`;
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

  const submitAll = async () => {
    let path = `/api/sample/submit/`;
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
    let path = `/api/sample/accept/`;

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
    let path = `/api/sample/reject/`;

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
    let path = `/api/sample/`;
    selected.map(async (id, index) => {
      let temp = path + id;
      await fetch(temp, { method: "DELETE" })
        .then((response) => {})
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
          rows={sampleList}
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
                rows={sampleList}
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
        setRowList={setSampleList}
        setHeadCellList={setHeadCellList}
        getData={getData}
        rows={sampleList}
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
