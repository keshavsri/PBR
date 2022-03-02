import React from "react";
import { Button } from "@mui/material";
import OrganizationIcon from "@mui/icons-material/Apartment";
import CustomDialog from "./CustomDialog";
import OrgCodeContent from "./OrgCodeContent";

export default function ManageUsers() {
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <h2>Manage Users</h2>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        startIcon={<OrganizationIcon />}
      >
        Get Org Share Code
      </Button>
      <CustomDialog
        open={openModal}
        icon={<OrganizationIcon />}
        title="Get Organization Share Code"
        handleClose={handleCloseModal}
      >
        <OrgCodeContent />
      </CustomDialog>
    </>
  );
}
