import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";

import { tableCellClasses } from "@mui/material/TableCell";

import CalculateIcon from "@mui/icons-material/Calculate";

import useAuth from "../../services/useAuth";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CC0000",
    color: theme.palette.common.white,
    fontSize: 18,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function HealthyRanges() {
  const { checkResponseAuth, user } = useAuth();
  const [speciesEnum, setSpeciesEnum] = React.useState({});
  const [genderEnum, setGenderEnum] = React.useState({});
  const [ageGroupEnum, setAgeGroupEnum] = React.useState({});
  const [methodEnum, setMethodEnum] = React.useState({});
  const [roleEnum, setRoleEnum] = React.useState({});
  const [cartridgeTypeList, setCartridgeTypeList] = React.useState([]);

  const [healthyRanges, setHealthyRanges] = React.useState([]);
  const [noHealthyRanges, setNoHealthyRanges] = React.useState(false);

  const [selectedSpecies, setSelectedSpecies] = React.useState();
  const [selectedGender, setSelectedGender] = React.useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = React.useState();
  const [selectedMethod, setSelectedMethod] = React.useState();
  const [seletedCartridgeType, setSelectedCartridgeType] = React.useState();

  // Loading
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef(0);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const handleButtonClick = () => {
    generateHealthyRanges();
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  React.useEffect(() => {
    getSpecies();
    getGenders();
    getAgeGroups();
    getMethods();
    getRoles();
    getCartridgeTypes();
  }, []);

  const generateHealthyRanges = async () => {
    setSuccess(false);
    setLoading(true);
    await fetch(`/api/healthy-range/`, {
      method: "POST",
      body: "",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        setSuccess(true);
        setLoading(false);
        return response.json();
      })
  }


  const getSpecies = async () => {
    await fetch(`/api/enum/species`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSpeciesEnum(data);
      });
  };

  const getGenders = async () => {
    await fetch(`/api/enum/gender`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        delete data.Mixed;
        delete data.Unknown;
        data["All"] = "All";
        setGenderEnum(data);
      });
  };

  const getAgeGroups = async () => {
    await fetch(`/api/enum/age`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAgeGroupEnum(data);
      });
  };

  const getMethods = async () => {
    await fetch(`api/enum/healthy-range-method`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMethodEnum(data);
      });
  };

  const getRoles = async () => {
    await fetch(`/api/enum/roles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setRoleEnum(data);
      });
  };

  const getCartridgeTypes = async () => {
    await fetch(`/api/cartridge-type/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCartridgeTypeList(data);
      });
  };

  const getHealthyRanges = async () => {
    const uri = `/api/healthy-range?species=${selectedSpecies}&gender=${selectedGender}&age_group=${selectedAgeGroup}&cartridge_type_id=${seletedCartridgeType}&method=${selectedMethod}`;
    await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setHealthyRanges(data);
        setNoHealthyRanges(data.length === 0);
      });
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <Paper>
      <Grid container spacing={2} sx={{ padding: "15px" }}>
        <Grid container item gutterbottom spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={5}>
            {user.role == roleEnum.Super_Admin ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ m: 1, position: "relative" }}>
                  <Fab
                    aria-label="save"
                    color="primary"
                    sx={buttonSx}
                    onClick={handleButtonClick}
                  >
                    {success ? <CheckIcon /> : <CalculateIcon />}
                  </Fab>
                  {loading && (
                    <CircularProgress
                      size={68}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: -6,
                        left: -6,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ m: 1, position: "relative" }}>
                  <Button
                    variant="contained"
                    sx={buttonSx}
                    disabled={loading}
                    onClick={handleButtonClick}
                  >
                    Recalculate Healthy Ranges
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Box>
              </Box>
            ) : null}
          </Grid>
        </Grid>
        <Grid container item spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Species"
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
            >
              {Object.keys(speciesEnum).map((key, index) => {
                return (
                  <MenuItem key={index} value={key}>
                    {speciesEnum[key]}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Gender"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              {Object.keys(genderEnum).map((key, index) => {
                return (
                  <MenuItem key={index} value={key}>
                    {genderEnum[key]}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Age Group"
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
            >
              {Object.keys(ageGroupEnum).map((key, index) => {
                return (
                  <MenuItem key={index} value={key}>
                    {ageGroupEnum[key]}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Cartridge Type"
              value={seletedCartridgeType}
              onChange={(e) => setSelectedCartridgeType(e.target.value)}
            >
              {cartridgeTypeList.map((cartridgeType) => {
                return (
                  <MenuItem key={cartridgeType.id} value={cartridgeType.id}>
                    {cartridgeType.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Method"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              {Object.keys(methodEnum).map((key, index) => {
                return (
                  <MenuItem key={index} value={key}>
                    {methodEnum[key]}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
        </Grid>
        <Grid container item gutterbottom spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={5}>
            <Button variant="contained" onClick={getHealthyRanges}>
              Display Healthy Ranges
            </Button>
          </Grid>
        </Grid>
        <Grid container item gutterbottom spacing={2} xs={12} sm={12}>
          {noHealthyRanges ? (
            <Grid item xs={12} sm={12}>
              <Alert severity="error" color="error">
                There was not enough data to have calculated Healthy Ranges for
                birds matching these characteristics.
              </Alert>
            </Grid>
          ) : null}
        </Grid>
        <Grid container item spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={12}>
            <Table sx={{ minWidth: 650 }} aria-label="Healty Range table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Analyte (units)</StyledTableCell>
                  <StyledTableCell>Lower Bound</StyledTableCell>
                  <StyledTableCell>Upper Bound</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {healthyRanges.map((healthyRange) => (
                  <StyledTableRow
                    key={healthyRange.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {healthyRange.analyte.abbreviation} (
                      {healthyRange.analyte.units})
                    </StyledTableCell>
                    <StyledTableCell>
                      {healthyRange.lower_bound}
                    </StyledTableCell>
                    <StyledTableCell>
                      {healthyRange.upper_bound}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
