import * as React from "react";

import { Paper, Button, Tooltip, IconButton, Chip } from "@mui/material";

import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";

import DataViewAddSample from "./DataViewAddSample";

import DataViewConsumer from "../services/useDataView";

import CustomDialog from "./CustomDialog";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

export default function DataViewSampleModal() {
  const { visibility, closeModal } = DataViewConsumer();
  return (
    <>
      <CustomDialog
        open={visibility}
        icon={<SampleIcon />}
        title="Sample"
        subtitle="Add"
        handleClose={closeModal}
        footer={
          <>
            <Button
              variant="contained"
              color="secondaryLight"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              onClick={closeModal}
              variant="contained"
              autoFocus
              endIcon={<NextIcon />}
            >
              Next
            </Button>
          </>
        }
      >
        <DataViewAddSample />
      </CustomDialog>
    </>
  );
}
