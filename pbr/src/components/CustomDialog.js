import React from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import {
  Button,
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(5),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(5),
  },
  "& .MuiTypography-h3": {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  "& .MuiTypography-h4": {
    fontSize: "20px",
    marginBottom: "15px",
  },
  "& .MuiDivider-root": {
    marginTop: "30px",
    marginBottom: "30px",
  },
  "& .MuiDialogActions-root": {
    padding: "20px",
    "& .MuiButtonBase-root": {
      borderRadius: "333px",
    },
  },
  "& .MuiTypography-root": {
    color: theme.palette.text.secondary,
  },
}));

const useStyles = makeStyles(() => ({
  wrapIcon: {
    alignItems: "center",
    display: "flex",
    "& svg": {
      marginRight: "12px",
    },
  },
}));

const BootstrapDialogTitle = (props) => {
  const { mainText, subText, onClose, icon, ...other } = props;
  const classes = useStyles();
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      <Box className={classes.wrapIcon}>
        {icon}
        <Typography sx={{ fontWeight: 700, marginRight: "5px" }}>
          {mainText}
        </Typography>

        {subText && <Typography>/ {subText}</Typography>}
      </Box>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomDialog(props) {
  const { open, handleClose, title, subtitle, footer, icon } = props;

  return (
    <BootstrapDialog
      maxWidth={"md"}
      fullWidth
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      {title && (
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          icon={icon}
          mainText={title}
          subText={subtitle}
        />
      )}
      {props.children && (
        <DialogContent dividers>{props.children}</DialogContent>
      )}
      {footer && <DialogActions>{footer}</DialogActions>}
    </BootstrapDialog>
  );
}
