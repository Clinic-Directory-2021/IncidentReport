import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// component

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Box from '@mui/material/Box';
// import Checkbox from '@mui/material/Checkbox';


import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));


// ----------------------------------------------------------------------
const incidentType = [
  { id:'1', label: 'Remaining Balance'},
  { id:'2', label: 'Failed a subject'},
  { id:'3', label: 'Adding/Changing subject'},
  { id:'4', label: 'Subjects with INC'},
  { id:'5', label: 'Subjects from lower year level not taken yet'},
  { id:'6', label: 'Subjects that are not available on the current semester not yet taken '},
  { id:'7', label: 'Others'},
];

const section = [
  { id:'1', label: 'A'},
  { id:'2', label: 'B'},
  { id:'3', label: 'C'},
  { id:'4', label: 'D'},
  { id:'5', label: 'E'},
  { id:'6', label: 'F'},
  { id:'7', label: 'G'},
  { id:'8', label: 'H'},
  { id:'9', label: 'I'},
  { id:'10', label: 'J'},
  { id:'11', label: 'K'},
  { id:'12', label: 'L'},
  { id:'13', label: 'M'},
  { id:'14', label: 'N'},
  { id:'15', label: 'O'},
  { id:'16', label: 'P'},
  { id:'17', label: 'Q'},
  { id:'18', label: 'R'},
  { id:'19', label: 'S'},
  { id:'20', label: 'T'},
  { id:'21', label: 'U'},
  { id:'22', label: 'V'},
  { id:'23', label: 'W'},
  { id:'24', label: 'X'},
  { id:'25', label: 'Y'},
  { id:'26', label: 'Z'},
];

const yearLevel = [
  { id:'1', label: '1'},
  { id:'2', label: '2'},
  { id:'3', label: '3'},
  { id:'4', label: '4'},
];

const status = [
  { id:'1', label: 'open'},
  { id:'2', label: 'on process'},
  { id:'3', label: 'close'},
];

const FILTER = [
  { id:'1', label: 'Incident type'},
  { id:'2', label: 'Section'},
  { id:'3', label: 'Year level'},
  { id:'4', label: 'Status'},
  ];





const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function UserListToolbar({ numSelected, filterName, onFilterName, onFilterIncident, onFilterYear, onFilterSection, onFilterStatus, onFilterSelect, filterSelect}) {
  return (

  
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {/* {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
        
      )} */}
      
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={FILTER}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Select Filter" />}
      onInputChange={onFilterSelect}
    />

      {filterSelect === 'Incident type' ? 
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={incidentType}
        sx={{ width: 200 }}
        renderInput={(params) => <TextField {...params} label="Incident Type" />}
        onInputChange={onFilterIncident}
      />
      :
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={incidentType}
        sx={{ width: 200, display:"none"}}
        renderInput={(params) => <TextField {...params} label="Incident Type" />}
        onInputChange={onFilterIncident}
      />
      }
      {filterSelect === 'Section' ? 
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={section}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Section" />}
      onInputChange={onFilterSection}
    />
      :
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={section}
      sx={{ width: 200, display:"none" }}
      renderInput={(params) => <TextField {...params} label="Section" />}
      onInputChange={onFilterSection}
    />
      }

  {filterSelect === 'Year level' ? 
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={yearLevel}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Year Level" />}
      onInputChange={onFilterYear}
    />
      :
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={yearLevel}
      sx={{ width: 200, display:'none' }}
      renderInput={(params) => <TextField {...params} label="Year Level" />}
      onInputChange={onFilterYear}
    />
      }

{filterSelect === 'Status' ? 
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={status}
      sx={{ width: 200 }}
      renderInput={(params) => <TextField {...params} label="Status" />}
      onInputChange={onFilterStatus}
    />
      :
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={status}
      sx={{ width: 200, display:'none' }}
      renderInput={(params) => <TextField {...params} label="Status" />}
      onInputChange={onFilterStatus}
    />
      }
  
  
  
    </RootStyle>
  );
}
