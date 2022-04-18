import * as React from "react";

import { Button, Stack, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import PrevIcon from "@mui/icons-material/ArrowBackIos";
import SubmitIcon from "@mui/icons-material/Publish";

import AddSample from "./AddSample";
import YourSample from "./YourSample";
import CategorizeSample from "./CategorizeSample";
import Success from "./Success";
import Error from "./Error";

import DataViewConsumer from "../../services/useDataView";
import AuthConsumer from "../../services/useAuth";

import CustomDialog from "../CustomDialog";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

export default function DataViewSampleModal() {
  const {
    sampleModalVisibility,
    sampleModalScreen,
    closeSampleModal,
    samplePrevAction,
    sampleNextAction,
    error,
    setError,
    restartSample,
    timestamp,
    generalDetails,
    machineDetails,
    setSamplePayload,
    setSampleValidationErrors,
    setGeneralDetails,
    sampleType,
    sampleLoading,
    setSampleLoading,
  } = DataViewConsumer();
  const { checkResponseAuth, user } = AuthConsumer();

  let dismissError = () => {
    setError({});
  };

  let validatePayload = (payload) => {
    let errors = {};
    if (payload.generalDetails.organizationID === "") {
      errors.organizationID = "Organization field is required.";
    }
    if (payload.generalDetails.flockName === "") {
      errors.flockName = "Flock Name field is required.";
    }
    if (payload.generalDetails.species === "") {
      errors.species = "Species field is required.";
    }
    if (payload.generalDetails.strain === "") {
      errors.strain = "Strain field is required.";
    }
    if (payload.generalDetails.gender === "") {
      errors.gender = "Gender field is required.";
    }
    if (payload.generalDetails.sourceID === "") {
      errors.sourceID = "Source field is required.";
    }
    if (payload.generalDetails.productionType === "") {
      errors.productionType = "Production Type field is required.";
    }
    if (payload.generalDetails.ageNumber === "") {
      errors.ageNumber = "Age field is required.";
    }
    if (payload.generalDetails.ageUnit === "") {
      errors.ageUnit = "Age Unit field is required.";
    }
    return errors;
  };

  let stageSample = async () => {
    let payload = {
      generalDetails: generalDetails,
      machineDetails: machineDetails,
    };
    console.log("STAGING SAMPLE", payload);
    // Validate Sample before Staging
    let errors = validatePayload(payload);

    if (Object.keys(errors).length === 0) {
      console.log("No Errors with Payload");
      setSamplePayload(payload);
      console.log("STAGED:", payload);
      setSampleLoading(true);
      // DO WHAT NEEDS TO HAPPEN FOR STAGING IN BACKEND TO GET SAMPLE COMPARISONS
      setSampleLoading(false);
      sampleNextAction();
    } else {
      setSampleValidationErrors(errors);
      console.log("Errors found: ", errors);
      console.log("Cannot stage payload", payload);
    }
  };

  let onSubmit = async () => {
    let payload = {
      flagged: generalDetails.flagged,
      comments: generalDetails.comments,
      flock_age: generalDetails.ageNumber,
      flock_age_unit: generalDetails.ageUnit,
      machineDetails: machineDetails,
      sample_type: sampleType,
      organization_id: generalDetails.organizationID,
      flockDetails: {
        name: generalDetails.flockName,
        strain: generalDetails.strain,
        species: generalDetails.species,
        gender: generalDetails.gender,
        production_type: generalDetails.productionType,
        source_id: generalDetails.sourceID,
        organization_id: generalDetails.organizationID,
      },
    };
    console.log("Submitting!", payload);
    setSampleLoading(true);
    await fetch(`/api/sample/`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkResponseAuth)
      .then((response) => {
        setSampleLoading(false);
        if (!response.ok) {
          setError({
            title: `${response.status} - ${response.statusText}`,
            description: `There was an error while uploading the sample. Try again.`,
          });
        } else {
          sampleNextAction();
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
      });
  };

  const [organizations, setOrganizations] = React.useState([]);
  const getOrganizations = async () => {
    console.log("Getting Organizations");
    const response = await fetch(`/api/organization/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    console.log(data);
    setOrganizations(data);
    setGeneralDetails({
      ...generalDetails,
      organizationID: user.organization_id,
    });
    console.log("Set Org in Gen Details:", generalDetails.organizationID);
  };

  const [flocks, setFlocks] = React.useState([]);
  const getFlocks = async () => {
    console.log(`Getting Flocks: /api/flock/${generalDetails.organizationID}`);
    await fetch(`/api/flock/${generalDetails.organizationID}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("NEW FLOCKS:", data);
        setFlocks(data);
      });
  };

  const [sources, setSources] = React.useState([]);
  const getSources = async () => {
    console.log("Getting Sources for ", generalDetails.organizationID);
    let org = organizations.find(
      (org) => org.id === generalDetails.organizationID
    );
    setSources(org.sources);
    console.log("NEW SOURCES:", org.sources);
  };

  const [machineList, setMachineList] = React.useState([]);
  const getMachineList = async () => {
    // await fetch(`/api/machine/organization/${generalDetails.organizationID}`, {
    //   method: "GET",
    // })
    //   .then(checkResponseAuth)
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   });
    let mockMachineList = [
      {
        name: "VetScan VS2",
        id: 12415,
        info: [
          {
            id: 4,
            name: "Timestamp of Test",
            type: "timestamp",
            datatype: "text",
          },
          { id: 1, name: "Patient ID", datatype: "text" },
          {
            id: 2,
            name: "Rotor Lot Number",
            datatype: "text",
          },
          {
            id: 3,
            name: "Serial Number",
            datatype: "text",
          },
        ],
        measurements: [
          { id: 1, abbrev: "AST", units: "U/L", datatype: "text" },
          { id: 2, abbrev: "BA", units: "umol/L", datatype: "text" },
          { id: 3, abbrev: "CK", units: "U/L", datatype: "text" },
          { id: 4, abbrev: "UA", units: "mg/dL", datatype: "text" },
          {
            id: 5,
            name: "Glucose",
            abbrev: "GLU",
            units: "mg/dL",
            datatype: "text",
          },
          {
            id: 6,
            name: "Total Calcium",
            abbrev: "CA",
            units: "mg/dL",
            datatype: "text",
          },
          {
            id: 7,
            name: "Phosphorus",
            abbrev: "PHOS",
            units: "mg/dL",
            datatype: "text",
          },
          {
            id: 8,
            name: "Total Protein",
            abbrev: "TP",
            units: "g/dL",
            datatype: "text",
          },
          {
            id: 9,
            name: "Albumen",
            abbrev: "ALB",
            units: "g/dL",
            datatype: "text",
          },
          {
            id: 10,
            name: "Globulin",
            abbrev: "GLOB",
            units: "g/dL",
            datatype: "text",
          },
          {
            id: 11,
            name: "Potassium",
            abbrev: "K+",
            units: "mmol/L",
            datatype: "text",
          },
          {
            id: 12,
            name: "Sodium",
            abbrev: "NA+",
            units: "mmol/L",
            datatype: "text",
          },
          { id: 13, abbrev: "RQC", datatype: "text" },
          { id: 14, abbrev: "QC", datatype: "text" },
          { id: 15, abbrev: "HEM", datatype: "text" },
          { id: 16, abbrev: "LIP", datatype: "text" },
          { id: 17, abbrev: "ICT", datatype: "text" },
        ],
      },
      {
        name: "iStat",
        id: 12152,
        info: [
          {
            id: 4,
            name: "Timestamp of Test",
            type: "timestamp",
            datatype: "text",
          },
          {
            id: 2,
            name: "iStat Number",
            datatype: "number",
          },
        ],
        measurements: [
          { id: 1, abbrev: "pH", units: "", datatype: "number" },
          { id: 2, abbrev: "pCO2", units: "", datatype: "number" },
          { id: 3, abbrev: "pO2", units: "", datatype: "number" },
          { id: 4, abbrev: "BE", units: "", datatype: "number" },
          { id: 5, abbrev: "HCO3", units: "", datatype: "number" },
          { id: 6, abbrev: "tCO2", units: "", datatype: "number" },
          { id: 7, abbrev: "sO2", units: "", datatype: "number" },
          { id: 8, abbrev: "Na", units: "", datatype: "number" },
          { id: 9, abbrev: "K", units: "", datatype: "number" },
          { id: 10, abbrev: "iCa", units: "", datatype: "number" },
          { id: 11, abbrev: "Glu", units: "", datatype: "number" },
          { id: 12, abbrev: "Hct", units: "", datatype: "number" },
          { id: 13, abbrev: "Hb", units: "", datatype: "number" },
        ],
      },
    ];

    setMachineList(mockMachineList);
  };

  React.useEffect(() => {
    if (sampleModalVisibility) {
      console.log("ORG ID:", generalDetails.organizationID);
      getOrganizations();
    }
  }, [sampleModalVisibility]);

  React.useEffect(() => {
    console.log(generalDetails.organizationID);
    console.log("Org Changed. Fire Flocks and Sources");
    if (generalDetails.organizationID) {
      getFlocks();
      getSources();
      getMachineList();
    }
  }, [generalDetails.organizationID]);
  // Define the footer for the modal. By default, there's no footer.
  let footer = null;

  if (sampleLoading) {
    // Error Footer
    footer = <></>;
  } else if (Object.keys(error).length !== 0) {
    // Error Footer
    footer = (
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", width: "100%" }}
      >
        <Button
          variant="contained"
          color="secondaryLight"
          onClick={dismissError}
          startIcon={<PrevIcon />}
        >
          Try Again
        </Button>
      </Stack>
    );
  } else if (sampleModalScreen === 0) {
    // Add Sample Screen
    footer = (
      <>
        <Button
          variant="contained"
          color="secondaryLight"
          onClick={samplePrevAction}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            stageSample();
          }}
          variant="contained"
          autoFocus
          endIcon={<NextIcon />}
        >
          Next
        </Button>
      </>
    );
  } else if (sampleModalScreen === 1) {
    // Your Sample Entry Screen
    footer = (
      <>
        <Button
          variant="contained"
          color="secondaryLight"
          onClick={samplePrevAction}
          startIcon={<PrevIcon />}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            sampleNextAction();
          }}
          variant="contained"
          autoFocus
          endIcon={<NextIcon />}
        >
          Next
        </Button>
      </>
    );
  } else if (sampleModalScreen === 2) {
    // Categorize Sample Entry Screen
    footer = (
      <>
        <Button
          variant="contained"
          color="secondaryLight"
          onClick={samplePrevAction}
          startIcon={<PrevIcon />}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            onSubmit();
          }}
          variant="contained"
          autoFocus
          disabled={sampleType ? false : true}
          endIcon={<SubmitIcon />}
        >
          Submit
        </Button>
      </>
    );
  } else if (sampleModalScreen === 3) {
    // Success Footer
    footer = (
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", width: "100%" }}
      >
        <Button
          onClick={restartSample}
          variant="contained"
          color="secondaryLight"
          endIcon={<SampleIcon />}
        >
          Submit Another Sample Entry
        </Button>
        <Button
          onClick={closeSampleModal}
          variant="contained"
          autoFocus
          endIcon={<CloseIcon />}
        >
          Close Window
        </Button>
      </Stack>
    );
  }

  if (sampleLoading) {
    return (
      <>
        <CustomDialog
          open={sampleModalVisibility}
          icon={<SampleIcon />}
          title="Sample"
          subtitle="Add"
          handleClose={closeSampleModal}
          footer={footer}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "15rem",
            }}
          >
            <CircularProgress />
          </Box>
        </CustomDialog>
      </>
    );
  } else {
    return (
      <>
        <CustomDialog
          open={sampleModalVisibility}
          icon={<SampleIcon />}
          title="Sample"
          subtitle="Add"
          handleClose={closeSampleModal}
          footer={footer}
        >
          {Object.keys(error).length === 0 ? (
            <>
              {/* Add Sample Screen */}
              {sampleModalScreen === 0 && (
                <AddSample
                  organizations={organizations}
                  sources={sources}
                  getSources={getSources}
                  flocks={flocks}
                  getFlocks={getFlocks}
                  machineList={machineList}
                />
                // <AddSample />
              )}

              {/* Your Sample Screen */}
              {sampleModalScreen === 1 && <YourSample />}

              {/* Success Screen */}
              {sampleModalScreen === 2 && <CategorizeSample />}
              {sampleModalScreen === 3 && <Success />}
            </>
          ) : (
            <>
              {/* Error Screen */}
              {Object.keys(error).length !== 0 && <Error />}
            </>
          )}
        </CustomDialog>
      </>
    );
  }
}
