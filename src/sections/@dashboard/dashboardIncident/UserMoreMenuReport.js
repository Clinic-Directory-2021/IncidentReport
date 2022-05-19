import React, { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { render } from 'react-dom';
import { useReactToPrint } from "react-to-print";
// material
import { Box, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

// const getAllComments = (reportId) =>{
//   const collectionList = query(collection(db, collectionName, reportId, "comments"));
//   const unsubscribe = onSnapshot(collectionList, (querySnapshot) => {
//     const temp = [];
//     querySnapshot.forEach((doc) => {
//       if(doc.data().status === 'close')
//       {
//         temp.push(doc.data());
//       }
//     });
//     setIncidentData(temp)
//   });
// }
class ComponentToPrint extends React.PureComponent {

  

  constructor(props) {
    super(props);
    
    this.state = {
      studentName: props.data.studentName,
      email:props.data.email,
      studentNumber:props.data.studentNumber,
      section:props.data.section,
      year:props.data.year,
      incidentType:props.data.incidentType,
      processBy:props.data.processBy,
      specificDetail:props.data.specificDetail,
      imageUri:props.data.imageUri
    }
  }

  render() {
    return (
      <div>
      <div style={{
        marginTop:'20px',
        marginBottom:'10px',
        display:'flex',
        justifyContent:'flex-start'
        }}>
        
      
        <h1 style={{
          marginLeft:'50px',
          marginTop:'50px',
          marginBottom:'50px',
          color: "darkblue"}}>Incident Report</h1>



        <div style={{marginLeft:'340px',}}>
        <img alt="register" width={150} height={140} src="/static/illustrations/logo.png" />  
        </div>
      </div>
    <Box style={{backgroundColor:'darkblue'}}>
      <div style={{
        color: "white",
        marginLeft:'50px',
        fontSize:'21px',
        fontWeight:'bold'}}>
      <text>STUDENT DETAILS</text>
      </div>
    </Box>


      &nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;
      <div style={{
        fontWeight:'bold',
        marginLeft:'50px',
        fontSize:'18px',
        display:'flex', 
        flexDirection:'column'}}>
        <div style={{flexDirection:'row'}}>
        <text>Student Name</text>
        <TextField
          style={{marginTop:'-10px',left:120,width:'70%'}}
          value={this.state.studentName}
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Gmail</text>  
        <TextField
          style={{marginTop:'-10px',left:120,width:'70%'}}
          value={this.state.email}
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Student Number</text>
        <TextField
          style={{marginTop:'-10px',left:30, width:'70%'}}
          value={this.state.studentNumber}
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
      
      </div>

      &nbsp;&nbsp;&nbsp;
      
      <div style={{
        fontWeight:'bold',
        marginLeft:'50px',
        fontSize:'18px',
        display:'flex', 
        flexDirection:'column'}}>
        <div style={{flexDirection:'row'}}>
        <text>Section</text>
        <TextField
          style={{marginTop:'-10px',left:105,width:'70%'}}
          value={this.state.section}
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>
        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Year Level</text>  
        <TextField
          style={{marginTop:'-10px',left:85,width:'70%'}}
          value={this.state.year}
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>

        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Incident Type</text>  
        <TextField
          style={{marginTop:'-10px',left:55,width:'70%'}}
          value={this.state.incidentType}
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>

        &nbsp;&nbsp;&nbsp;


        <div style={{flexDirection:'row'}}>
        <text>Processed By</text>  
        <TextField
          style={{marginTop:'-10px',left:55,width:'70%'}}
          value={this.state.processBy}
          id="standard-error-helper-text"
          variant="standard"
        />
        </div>

        &nbsp;&nbsp;&nbsp;
        <div style={{marginTop:'30px',flexDirection:'column'}}>
        <text>Possible Reason</text> 
        <TextField
          style={{backgroundColor:'#e8eff5', marginTop:'10px',width:'93%',}}
          InputLabelProps={{ style: { fontSize: 150 } }}
          id="standard-error-helper-text"
          value={this.state.specificDetail}
        />
        </div>
        &nbsp;&nbsp;&nbsp;

        <Box style={{
        marginBottom:'40px',
        borderRadius:'15px',
        width:200,
        padding:10,
        backgroundColor:'#f7f7f7',
        boxShadow:"0 14px 28px rgba(0,0,0,0.25), \n\t\t\t0 10px 10px rgba(0,0,0,0.22)"
      }}
      >
      <text style={{marginRight:'auto', marginLeft:'auto'}}>Image Uploaded</text>
      <img src={this.state.imageUri} style={{width:'100%'}} alt='proof'/>
      </Box>
        {/* <div style={{ marginTop:'140px',flexDirection:'column'}}>
        <text>Comments</text> 
        <TextField
          style={{backgroundColor:'#e8eff5', marginTop:'10px',width:'93%',}}
          InputProps={{ style: { fontSize: 150 } }}
          InputLabelProps={{ style: { fontSize: 150 } }}
          id="standard-error-helper-text"
        />
        </div> */}
      </div>
      </div>
    );
  }
}

// ----------------------------------------------------------------------


export default function UserMoreMenuReport(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  return (
    <>

          <div style={{display:'none'}}>
          <ComponentToPrint ref={componentRef} data={props.data}/>
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
      <MenuItem component={RouterLink} to="/IR/IndividualReport" sx={{ color: 'text.secondary' }}>
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



