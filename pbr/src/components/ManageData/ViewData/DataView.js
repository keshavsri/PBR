import * as React from "react";

import { useRef } from "react";

import {
  Paper,
  Chip,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";

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
import EditSampleModal from "../EditData/EditSampleModal";
import ReportModal from "../Report/ReportModal";

const useStyles = makeStyles({});

export default function DataView() {
  const [sampleList, setSampleList] = React.useState([]);
  const { checkResponseAuth, user } = useAuth();

  const [currentCartridgeType, setCurrentCartridgeType] = React.useState({});
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);
  const [pendingRowList, setPendingRowList] = React.useState([]);
  const [fullRowList, setFullRowList] = React.useState([]);
  const [showOnlyPendingSamples, setShowOnlyPendingSamples] =
    React.useState(false);
  const [headCellList, setHeadCellList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [roles, setRoles] = React.useState([]);

  const [isSample] = React.useState(true);
  const [openReviewSampleModal, setOpenReviewSampleModal] =
    React.useState(false);
  const [reportModalVisibility, setReportModalVisibility] = React.useState(false);

  const [selectedSamples, setSelectedSamples] = React.useState([]);
  const [machines, setMachines] = React.useState([]);
  const [pendingSamples, setPendingSamples] = React.useState([]);
  const [organization, setOrganization] = React.useState({});
  const [organizations, setOrganizations] = React.useState([]);

  const [SavedToPendingVisibility, setSavedToPendingVisibility] =
    React.useState(false);
  const [editSampleModalVisiblity, setEditSampleModalVisibility] =
    React.useState(false);

  const openSavedToPendingVisibility = () => setSavedToPendingVisibility(true);
  const openEditSampleVisibility = () => setEditSampleModalVisibility(true);

  const [loading, setLoading] = React.useState(false);

  const abortController = useRef(null);

  const assignRowHtml = (rows) => {
    setSampleList([]);

    rows.map((row) => {
      row.measurements.map((meas) => {
        row[meas.analyte.abbreviation] = meas.value;
      });
      row["flock_name"] = row.flock.name;

      let newDate = row;
      newDate.timestamp_added = new Date(row.timestamp_added).toLocaleString();
      // remove seconds from date
      let seconds = ":" + newDate.timestamp_added.slice(-5, -3);
      // remove comma from date
      newDate.timestamp_added = newDate.timestamp_added.replace(",", "");
      newDate.timestamp_added = newDate.timestamp_added.replace(seconds, "");

      setSampleList((sampleList) => [...sampleList, newDate]);

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

      // TEMPORARY
      row.deletable = true;
    });
  };

  const getRoles = async () => {
    const response = await fetch(`/api/enum/roles`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    setRoles(data);
  };

  const getOrganizations = async () => {
    let orgId = user.organization_id;

    if (user.role === roles["Super_Admin"]) {
      const response = await fetch(`/api/organization/`, {
        method: "GET",
      }).then(checkResponseAuth);
      const data = await response.json();
      setOrganizations(data);
      setOrganization(data[0]);
    } else {
      const response = await fetch(`/api/organization/${orgId}`, {
        method: "GET",
      });
      const data = await response.json();
      setOrganization(data);
    }
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
    setSampleList([]);
    getHeadCells();

    const promise = new Promise(async (resolve) => {
      setLoading(true);
      abortController.current = new AbortController();
      const uri = `/api/sample/org_cartridge_type?organization_id=${organization.id}&cartridge_type_id=${currentCartridgeType.id}`;
      const response = await fetch(uri, {
        signal: abortController.current.signal,
        method: "GET",
      });

      const data = await response.json();
      console.log(data);
      assignRowHtml(data);
      setLoading(false);
      resolve(data);
    });

    return promise;
  };

  const cancelGetData = () => {
    if (abortController.current) {
      abortController.current.abort();
      setLoading(false);
    }
  };

  const getCartridgeTypes = async () => {
    await fetch(`api/cartridge-type`)
      .then((response) => {
        setLoading(false);
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setCartridgeTypes(data);
        setCurrentCartridgeType(data[0]);
      });
  };

  const getMachines = async () => {
    await fetch(`api/machines/${organization.id}`)
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setMachines(data);
      });
  };

  const getMachines = async () => {
    await fetch(`api/machines/${organization.id}`)
    .then((response) => {
      return response.json();
    })
    .then(checkResponseAuth)
    .then((data) => {
      setMachines(data);
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
        id: "timestamp_added",
        numeric: false,
        disablePadding: true,
        label: "Date Added",
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
        id: "flock_age_unit",
        numeric: false,
        disablePadding: true,
        label: "Flock Age Unit",
      },

      {
        id: "rotor_lot_number",
        numeric: false,
        disablePadding: true,
        label: "Rotor Lot Number",
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

    headCells.push({
      id: "comments",
      numeric: false,
      disablePadding: true,
      label: "Comments",
    });
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

  const onEdit = () => {
    openEditSampleVisibility();
  };

  const onSubmit = () => {
    openSavedToPendingVisibility();
  };

  const submitOne = async (id) => {
    let path = `/api/sample/submit/`;
    let temp = path + id;
    await fetch(temp, { method: "PUT" })
      .then((response) => {})
      .then(() => {
        setLoading(true);
        getData();
      });

    setSelected([]);
  };

  const submitAll = async () => {
    let path = `/api/sample/submit/`;
    selected.map(async (id, index) => {
      let temp = path + id;
      await fetch(temp, { method: "PUT" })
        .then((response) => {})
        .then(() => {
          setLoading(true);
          getData();
        });
    });
    setSelected([]);
  };

  const acceptSample = async (id) => {
    let path = `/api/sample/accept/`;

    let temp = path + id;
    await fetch(temp, { method: "PUT" })
      .then((response) => {})
      .then(() => {
        setLoading(true);
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
        setLoading(true);
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
          setLoading(true);
          getData();
        });
    });
    setSelected([]);

    // API CALL TO PASS THE "SELECTED" STATE VARIABLE TO DELETE
    // SHOULD BE A LIST OF DELETABLE OBJECTS W/ ID'S
    // NEED TO IMPLEMENT THIS FUNCTION FOR EVERY TABLE
  };

  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?
  React.useEffect(async () => {
    await getRoles();
    await getCartridgeTypes();
    await getData();

    setSelected([]);
  }, []);

  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?
  React.useEffect(async () => {
    setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 8000);
    setSelected([]);
    await getData();
  }, [organization, currentCartridgeType]);

  React.useEffect(async () => {
    await getOrganizations();
  }, [roles]);

  React.useEffect(async () => {
    await getMachines();
  }, [organization]);


  React.useEffect(() => {
    setSelected([]);
    setSelectedSamples([]);
    console.log("Full Row List");
  }, [fullRowList]);

  React.useEffect(() => {
    setSelected([]);
    setSelectedSamples([]);
    console.log("Pending Row List");
  }, [pendingRowList]);

  React.useEffect(() => {
    setSelected([]);
    setSelectedSamples([]);
    console.log("Sample List");
  }, [sampleList]);



  return (
    <>
      <DataViewProvider>
        <Paper>
          {loading ? (
            <Grid
              container
              direction="column"
              display="flex"
              justify="center"
              alignItems="center"
              style={{ padding: "25px", border: "3px solid black" }}
            >
              <Grid item>
                <CircularProgress />
              </Grid>

              <Grid item>
                <Typography variant="h6">Loading...</Typography>
              </Grid>
              <Button onClick={() => cancelGetData()}>Stop Loading</Button>

            </Grid>
          ) : (
            <EnhancedTable
              headCells={headCellList}
              rows={sampleList}
              toolbarButtons={
                <DVTableToolbar
                  filterPendingSamples={filterPendingSamples}
                  showOnlyPendingSamples={showOnlyPendingSamples}
                  turnPendingFilterOff={turnPendingFilterOff}
                  cartridgeTypes={cartridgeTypes}
                  organizations={organizations}
                  setCurrentOrganization={setOrganization}
                  currentOrganization={organization}
                  user={user}
                  roles={roles}
                  currentCartridgeType={currentCartridgeType}
                  setCurrentCartridgeType={setCurrentCartridgeType}
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
              onEdit={onEdit}
              selectedSample={selectedSamples[0]}
              setReportModalVisibility={setReportModalVisibility}

            />
          )}

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

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              {editSampleModalVisiblity ? (
                <EditSampleModal
                  selected={selected}
                  SampleToEdit={selectedSamples[0]}
                  editSampleModalVisiblity={editSampleModalVisiblity}
                  setEditSampleModalVisibility={setEditSampleModalVisibility}
                  roles={roles}
                  getData={getData}
                  currentCartridgeType={currentCartridgeType}
                  setSelectedSamples={setSelectedSamples}
                  selectedSamples={selectedSamples}
                  setSelected={setSelected}
                  currentOrganization={organization}
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
        <ReportModal
          visibility={reportModalVisibility}
          setVisibility={setReportModalVisibility}
          selected={selected}
        />
        <DataViewSampleModal getData={getData} roles={roles} />
        <ReviewSampleModal
          openReviewSampleModal={openReviewSampleModal}
          setOpenReviewSampleModal={setOpenReviewSampleModal}
          selectedSamples={selectedSamples}
          acceptSample={acceptSample}
          rejectSample={rejectSample}
          turnPendingFilterOff={turnPendingFilterOff}
        />
      </DataViewProvider>
    </>
  );
}
