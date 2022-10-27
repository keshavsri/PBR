import * as React from "react";

import { Button, Stack, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import PrevIcon from "@mui/icons-material/ArrowBackIos";
import SubmitIcon from "@mui/icons-material/Publish";

import NewAddSample from "./NewAddSample";

import CustomDialog from "../../CustomDialog";
import { makeStyles } from "@mui/styles";
import useAuth from "../../../services/useAuth";
import useDataView from "../../../services/useDataView";

const useStyles = makeStyles({});

export default function DataViewSampleModal({ getData }) {
  const { checkResponseAuth, user } = useAuth();

  let onSubmit = async () => {};

  const [organizations, setOrganizations] = React.useState([]);
  const [flocks, setFlocks] = React.useState([]);
  const [organization, setOrganization] = React.useState({});
  const [sources, setSources] = React.useState([]);
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);
  const [cartridgeType, setCartridgeType] = React.useState([]);


  const getOrganizations = async () => {
    const response = await fetch(`/api/organization/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    console.log(data);
    setOrganizations(data);
  };

  const getFlocks = async () => {
    await fetch(`/api/flock/organization/${organization.id}`, {
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

  const getSources = async () => {
    await fetch(`/api/source/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("NEW Source:", data);
        setSources(data);
      });
  };

  const getCartridgeTypes = async () => {
    await fetch(`/api/cartridge-type/`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCartridgeTypes(data);
        setCartridgeType(data[0]);

      });
  };


  React.useEffect(() => {
    if (sampleModalVisibility) {
      getOrganizations();
      getSources();
      getCartridgeTypes();
      getFlocks();
    }
  }, [sampleModalVisibility]);

  return (
    <div>
        Test Modal
    </div>
  )
}
