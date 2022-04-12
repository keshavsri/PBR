import * as React from "react";

import { Button, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import PrevIcon from "@mui/icons-material/ArrowBackIos";
import SubmitIcon from "@mui/icons-material/Publish";

import AddSample from "./AddSample";
import YourSample from "./YourSample";
import Success from "./Success";
import Error from "./Error";

import DataViewConsumer from "../../services/useDataView";

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
    samplePayload,
    setSampleValidationErrors,
  } = DataViewConsumer();

  let onSubmit = async () => {
    console.log("Submitting!");
  };

  let dismissError = () => {
    samplePrevAction();
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

  let stageSample = () => {
    console.log("STAGING SAMPLE");
    let payload = {
      timestamp: timestamp,
      generalDetails: generalDetails,
      machineDetails: machineDetails,
    };

    // Validate Sample before Staging
    let errors = validatePayload(payload);

    if (Object.keys(errors).length === 0) {
      console.log("No Errors with Payload");
      setSamplePayload(payload);
      console.log("STAGED:", payload);
      sampleNextAction();
    } else {
      setSampleValidationErrors(errors);
      console.log("Errors found: ", errors);
      console.log("Cannot stage payload", payload);
    }
  };

  // Define the footer for the modal. By default, there's no footer.
  let footer = null;

  if (Object.keys(error).length !== 0) {
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
            onSubmit();
            sampleNextAction();
          }}
          variant="contained"
          autoFocus
          endIcon={<SubmitIcon />}
        >
          Submit
        </Button>
      </>
    );
  } else if (sampleModalScreen === 2) {
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
            {sampleModalScreen === 0 && <AddSample />}

            {/* Your Sample Screen */}
            {sampleModalScreen === 1 && <YourSample />}

            {/* Success Screen */}
            {sampleModalScreen === 2 && <Success />}
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
