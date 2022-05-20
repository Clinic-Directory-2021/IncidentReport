import { filter } from 'lodash';
import { useState, useRef } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';








// material
import {
  Stack,
  Button,
  Container,
  Typography,

} from '@mui/material';
import { getIndividualData } from 'src/sections/@dashboard/dashboardIncident/individualModel';
import { firestore, storage } from 'src/firebase/firebase-config';
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirstName, getLastName, getUserType } from 'src/sections/auth/login/LoginModel';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// mock
import USERLIST from '../_mock/user';


// MODAL ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height:'50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


// ----------------------------------------------------------------------


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
  // const [page, setPage] = useState(0);

  // const [order, setOrder] = useState('asc');

  // const [selected, setSelected] = useState([]);

  // const [orderBy, setOrderBy] = useState('name');

  // const [filterName, setFilterName] = useState('');

  // const [rowsPerPage, setRowsPerPage] = useState(5);

  // const handleRequestSort = (event, property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = USERLIST.map((n) => n.name);
  //     setSelected(newSelecteds);
  //     return;
  //   }
  //   setSelected([]);
  // };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
  //   }
  //   setSelected(newSelected);
  // };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // const handleFilterByName = (event) => {
  //   setFilterName(event.target.value);
  // };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  // const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  // const isUserNotFound = filteredUsers.length === 0;


// MODAL CONST----------------------------------------------------------------------

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const commentBox = useRef(null)
  const [disable, setDisable] = React.useState(false)
  const navigate = useNavigate()
  const [value, setValue] = React.useState('Controlled');
  
  const specificDetail = getIndividualData().specificDetail.replace(/[<p></p>]/g,"")
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  
  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );
  const [comment, setComment] = React.useState([])
  const [reply, setReply] = React.useState('')

  const CloseIncident = async(incidentId,userId) =>{
    const washingtonRef = doc(firestore, "incidents", incidentId.toString());
    const userRef = doc(firestore, "users", userId);

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      status: 'close'
    });
    await updateDoc(userRef, {
      onIncident: false,
    });
    navigate('/evaluator/report',{replace:true})
  }

  const handleType = (event) =>{
    setReply(event.target.value)
  }
  const sendReply = async(replyData) =>{
    const incidentDoc = doc(firestore,"incidents",getIndividualData().incidentId.toString())
    const commentCollection = collection(incidentDoc, "comments")
    const date = new Date()
    const commentId = Date.parse(date)
    const fullName = getUserType() === 'Admin' ? "admin" : `${getFirstName()} ${getLastName()}`
    const commentData = {
      name: fullName,
      date: `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`,
      time: `${date.getHours()}:${date.getMinutes()}`,
      message: replyData,
      comment_id: commentId,
    }
    await setDoc(doc(commentCollection, commentId.toString()),commentData);
  }

  const scrollToBottom = () => {
    commentBox.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  React.useEffect(() => {
    scrollToBottom()
    const q = query(collection(firestore, "incidents", getIndividualData().incidentId.toString(),"comments"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
          temp.push(doc.data());
      });
      setComment(temp)
    });
  }, [])
  
  return (
    <Page title="Individual Report">

      <Container>
      
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Individual Report
          </Typography>
         <Box style={{marginRight:'115px'}}>
         {getIndividualData().status !== 'close' && getUserType() !== 'Student' && getIndividualData().processBy === `${getFirstName()} ${getLastName()}`?
          <Button variant="contained" 
           startIcon={<Iconify icon="eva:checkmark-circle-2-outline" />}
           onClick={()=>{CloseIncident(getIndividualData().incidentId.toString(), getIndividualData().uid)}}>
            Mark as resolved
          </Button>
          :
          <>
          </>
          }

          &nbsp;
          &nbsp;
          {/* <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:person-outline" />}>
            Individual Report Response/Response Form
          </Button> */}
        </Box>
          <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
           >
        <Box sx={style}>
          <div>
            <CKEditor
            editor={ClassicEditor}
            />
          </div>
        </Box>
        </Modal>
        </Stack>
        <Box style={{
        marginBottom:'40px',
        borderRadius:'15px',
        width: '90%',
        backgroundColor:'#f7f7f7',
        boxShadow:"0 14px 28px rgba(0,0,0,0.25), \n\t\t\t0 10px 10px rgba(0,0,0,0.22)"
      }}
      >
      <Box style={{
        display:'flex',
        flexDirection:'column',
        padding:20,
        }}>
      <text>Email Address: {getIndividualData().email}</text>
      <text>Full Name: {getIndividualData().studentName}</text>
      <text>Student No:{getIndividualData().studentNumber}</text>
      <text>Section: {getIndividualData().section}</text>
      <text>Incident Type: {getIndividualData().incidentType}</text>
      </Box>
      <TextField 
      placeholder='Possible Reason...'
      value={specificDetail}
      style={{
        placeholder:'qeqeq',
        top:-20,
        padding:'20px',
        display:'flex', 
        justifyContent:'flex-end'}}
      id="outlined-multiline-static" 
      multiline 
      rows={5} />

      {/* <Button
      style={{top:-20,left:'20px'}} 
      variant="contained" startIcon={<Iconify icon="eva:download-outline" />}>
      Download Attached File</Button> */}
      </Box>

      <Box style={{
        marginBottom:'40px',
        borderRadius:'15px',
        width: '90%',
        padding:10,
        backgroundColor:'#f7f7f7',
        boxShadow:"0 14px 28px rgba(0,0,0,0.25), \n\t\t\t0 10px 10px rgba(0,0,0,0.22)"
      }}
      >
      <text style={{marginRight:'auto', marginLeft:'auto'}}>Image Uploaded</text>
      <img src={getIndividualData().imageUri} style={{width:'100%'}} alt='proof'/>
      </Box>
      


  {/* Private Comment---------------------------------------------------------------------- */}
    <Box
      style={{
        borderRadius:'15px',
        width: '90%',
        height: 450,
        backgroundColor:'#f7f7f7',
        boxShadow:"0 14px 28px rgba(0,0,0,0.25), \n\t\t\t0 10px 10px rgba(0,0,0,0.22)"
      }}>
        <Box style={{maxHeight: '100%', overflow: 'auto',}} ref={commentBox}>
{comment.length > 0 ?
  comment.map((data, key)=>{
    return(
     <Box style={{
      padding:'20px',
      display:'flex', 
      flexDirection:'row'}}
      key={key}
      >
      <Avatar alt="Remy Sharp" src="" />
    &nbsp;&nbsp;&nbsp;
    <Box style={{width:'100%'}}>
      <Card>
        <CardContent style={{fontWeight:'bold',color:'blue',display:'flex', justifyContent:'space-between' }}>
        <text>{data.name}</text>
        <div>
        <text>{data.date}</text>
        <text> </text>
        <text>{data.time}</text>
        </div>
        </CardContent>
        <CardContent style={{marginTop:-20}}>
        <text>{data.message}</text>
        </CardContent>
      </Card>
    </Box>
  </Box> 
  )
  })
    :
    <></>
}

    {/* <Box style={{
        padding:'20px',
        display:'flex', 
      flexDirection:'row'}}>
    <Avatar alt="Remy Sharp" src="" />
    &nbsp;&nbsp;&nbsp;
    <Box style={{width:'100%'}}>
    <Card>
      <CardContent style={{fontWeight:'bold',color:'blue',display:'flex', justifyContent:'space-between' }}>
      <text>Pacheco Ken</text>
      <text>10:05 AM</text>
      </CardContent>
      <CardContent style={{marginTop:-20}}>
      <text>I Love  Big Dick</text>
      </CardContent>
    </Card>
    </Box>
    </Box> */}

    {/* <Box style={{
        padding:'20px',
        display:'flex', 
      flexDirection:'row'}}>
    <Avatar alt="Remy Sharp" src="/static/illustrations/Ken.jpg" />
    
    &nbsp;&nbsp;&nbsp;

    <Box style={{width:'100%'}}>
    <Card>
      <CardContent style={{fontWeight:'bold',color:'blue',display:'flex', justifyContent:'space-between' }}>
      <text>Pacheco Ken</text>
      <text>10:05 AM</text>
      </CardContent>
      <CardContent style={{marginTop:-20}}>
      <text>I Love  Big Dick</text>
      </CardContent>
    </Card>
    </Box>
    </Box> */}

    </Box>
    </Box>
    


      
      
      
      {/* Add comment and Post Button */}
      &nbsp;&nbsp;&nbsp;
      {getIndividualData().status !== 'close' &&  getIndividualData().processBy === `${getFirstName()} ${getLastName()}` || getUserType()=== 'Student'?
      <Box
      style={{
        borderRadius:'15px',
        width: '90%',
        height: 100,
        backgroundColor:'#f7f7f7',
        boxShadow:"0 14px 28px rgba(0,0,0,0.25), \n\t\t\t0 10px 10px rgba(0,0,0,0.22)"
      }}>
      <Box style={{
      padding:'20px',
      display:'flex', 
      flexDirection:'row'}}>
      <TextField 
      placeholder='Add a response/resolution'
      style={{backgroundColor:'white',top:5,width:'80%'}}
      id="outlined-multiline-static" 
      multiline 
      rows={1} 
      value={reply}
      onChange={handleType}
      />
      &nbsp;&nbsp;&nbsp;
      <Button style={{top:5,width:'20%'}}
      onClick={()=>{
        sendReply(reply)
        setReply('')
      }}
      variant="contained" startIcon={<Iconify icon="eva:arrow-forward-outline" />}>
      Send Response</Button>
      </Box>
      </Box>
      :
      <></>
      }


      </Container>
      
    </Page>
    
  );
}
