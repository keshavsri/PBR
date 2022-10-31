import * as React from "react";
import { styled } from '@mui/material/styles';
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
  Alert
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell'

import CalculateIcon from '@mui/icons-material/Calculate';

import useAuth from "../../services/useAuth";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#CC0000",
    color: theme.palette.common.white,
    fontSize: 18,
    fontWeight: 600
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
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


  React.useEffect(() => {
    getSpecies();
    getGenders();
    getAgeGroups();
    getMethods();
    getRoles();
    getCartridgeTypes();
  }, [])


  const generateHealthyRanges = async () => {
    await fetch(`/api/healthy-range/`, { 
      method: "POST",
      body: "",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
  }


  const getSpecies = async () => {
    await fetch(`/api/enum/species/`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setSpeciesEnum(data);
      });
  }

  const getGenders = async () => {
    await fetch(`/api/enum/gender/`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        delete data.Mixed
        delete data.Unknown
        data["All"] = "All"
        setGenderEnum(data);
      });
  }


  const getAgeGroups = async () => {
    await fetch(`/api/enum/age/`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setAgeGroupEnum(data);
      });
  }

  const getMethods = async () => {
    await fetch(`api/enum/healthy-range-method/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setMethodEnum(data);
      });
  }

  const getRoles = async () => {
    await fetch(`/api/enum/role/`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setRoleEnum(data);
      });
  }

  const getCartridgeTypes = async () => {
    await fetch(`/api/cartridge-type/`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setCartridgeTypeList(data);
      });
  }

  const getHealthyRanges = async () => {
    console.log(selectedSpecies)
    console.log(selectedAgeGroup)
    console.log(selectedGender)
    console.log(seletedCartridgeType)
    const uri = `/api/healthy-range?species=${selectedSpecies}&gender=${selectedGender}&age_group=${selectedAgeGroup}&cartridge_type_id=${seletedCartridgeType}&method=${selectedMethod}`
    await fetch(uri, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setHealthyRanges(data);
        setNoHealthyRanges(data.length === 0);
        console.log(data);
      });
  }


  return (
    <Paper>
      <Grid container spacing={2} sx={{padding: '15px'}}>
        <Grid container item gutterbottom spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={5}>
            {user.role == roleEnum.Super_Admin ? 
            (<Button
                startIcon={<CalculateIcon />}
                variant="contained"
                onClick={generateHealthyRanges}
              >
                Recalculate Healthy Ranges
            </Button>) : null}
          </Grid>
        </Grid>
        <Grid container item spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Species"
              value={selectedSpecies}
              onChange={e => setSelectedSpecies(e.target.value)}
            >
              {Object.keys(speciesEnum).map((key, index) => {
                return <MenuItem key={index} value={key}>{speciesEnum[key]}</MenuItem>
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Gender"
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
            >
              {Object.keys(genderEnum).map((key, index) => {
                return <MenuItem key={index} value={key}>{genderEnum[key]}</MenuItem>
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Age Group"
              value={selectedAgeGroup}
              onChange={e => setSelectedAgeGroup(e.target.value)}
            >
              {Object.keys(ageGroupEnum).map((key, index) => {
                return <MenuItem key={index} value={key}>{ageGroupEnum[key]}</MenuItem>
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Cartridge Type"
              value={seletedCartridgeType}
              onChange={e => setSelectedCartridgeType(e.target.value)}
            >
              {cartridgeTypeList.map((cartridgeType) => {
                return <MenuItem key={cartridgeType.id} value={cartridgeType.id}>{cartridgeType.name}</MenuItem>
              })}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Method"
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
            >
              {Object.keys(methodEnum).map((key, index) => {
                return <MenuItem key={index} value={key}>{methodEnum[key]}</MenuItem>
              })}
            </TextField>
          </Grid>
        </Grid>
        <Grid container item gutterbottom spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={5}>
            <Button
                variant="contained"
                onClick={getHealthyRanges}
              >
                Display Healthy Ranges
              </Button>
            </Grid>
        </Grid>
        <Grid container item gutterbottom spacing={2} xs={12} sm={12}>
          {noHealthyRanges ? 
          (<Grid item xs={12} sm={12}>
            <Alert severity="error" color="error">
              There was not enough data to have calculated Healthy Ranges for birds matching these characteristics.
            </Alert>
          </Grid>) : null}
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
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {healthyRange.analyte.abbreviation} ({healthyRange.analyte.units})
                    </StyledTableCell>
                    <StyledTableCell>{healthyRange.lower_bound}</StyledTableCell>
                    <StyledTableCell>{healthyRange.upper_bound}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}