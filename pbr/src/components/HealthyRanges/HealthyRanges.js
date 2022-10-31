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
  TableRow
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
  const [cartridgeTypeList, setCartridgeTypeList] = React.useState([]);
  const [healthyRanges, setHealthyRanges] = React.useState([]);


  const [selectedSpecies, setSelectedSpecies] = React.useState();
  const [selectedGender, setSelectedGender] = React.useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = React.useState();
  const [seletedCartridgeType, setSelectedCartridgeType] = React.useState();


  React.useEffect(() => {
    getSpecies();
    getGenders();
    getAgeGroups();
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
        console.log(data);
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
        setGenderEnum(data);
        console.log(data);
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
        console.log(data);
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
        console.log(data);
      });
  }

  const getHealthyRanges = async () => {
    console.log(selectedSpecies)
    console.log(selectedAgeGroup)
    console.log(selectedGender)
    console.log(seletedCartridgeType)
    const uri = `/api/healthy-range?species=${selectedSpecies}&gender=${selectedGender}&age_group=${selectedAgeGroup}&cartridge_type_id=${seletedCartridgeType}`
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
        console.log(data);
      });
  }


  return (
    <Paper>
      <Grid container spacing={2} sx={{padding: '15px'}}>
        <Grid container item gutterbottom spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={5}>
            <Button
                startIcon={<CalculateIcon />}
                variant="contained"
                onClick={generateHealthyRanges}
              >
                Recalculate Healthy Ranges
              </Button>
            </Grid>
        </Grid>
        <Grid container item spacing={2} xs={12} sm={12}>
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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