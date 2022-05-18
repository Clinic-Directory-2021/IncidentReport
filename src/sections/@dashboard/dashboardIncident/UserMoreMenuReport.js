import React, { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { render } from 'react-dom';
import { useReactToPrint } from "react-to-print";
// material
import { Table, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';





class ComponentToPrint extends React.PureComponent {

  render() {
    return (
      <div>
        <h1 style={{
          marginTop:'50px',
          marginBottom:'50px',
          display:'flex', 
          justifyContent:'center', 
          color: "green"}}>Incident Report</h1>

      <div style={{
        color: "red",
        marginLeft:'50px',
        fontSize:'21px',
        fontWeight:'bold'}}>
      <text>STUDENT DETAILS</text>
      </div>
      &nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;
      <div style={{
        marginLeft:'50px',
        fontSize:'18px',
        display:'flex', 
        flexDirection:'column'}}>
        <div style={{flexDirection:'row'}}>
        <text>Gmail</text>
        <TextField
          style={{marginTop:'-10px',left:120,width:'70%'}}
        
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Name</text>  
        <TextField
          style={{marginTop:'-10px',left:120,width:'70%'}}
        
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Student Number</text>
        <TextField
          style={{marginTop:'-10px',left:30, width:'70%'}}
          
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
      
      </div>

      &nbsp;&nbsp;&nbsp;
      
      <div style={{
        marginLeft:'50px',
        fontSize:'18px',
        display:'flex', 
        flexDirection:'column'}}>
        <div style={{flexDirection:'row'}}>
        <text>Section</text>
        <TextField
          style={{marginTop:'-10px',left:105,width:'70%'}}
        
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Year Level</text>  
        <TextField
          style={{marginTop:'-10px',left:85,width:'70%'}}
        
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
      </div>

      </div>
    );
  }
}




// ----------------------------------------------------------------------


export default function UserMoreMenuReport() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  return (
    <>

          <div style={{display:'none'}}>
          <ComponentToPrint ref={componentRef}/>
          </div>
  

      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
      <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:eye-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="View" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:printer-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText onClick={handlePrint} primary="Print" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}



