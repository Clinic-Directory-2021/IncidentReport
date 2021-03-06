import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "./App.css"

import { auth, firestore } from 'src/firebase/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, onSnapshot } from "firebase/firestore";




// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { getEmail, getFirstName, getLastName, getMiddleName, getSection, getStudentNumber, getUid, getUserType, getYear } from 'src/sections/auth/login/LoginModel';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu, UserMoreMenuReport } from '../sections/@dashboard/dashboardIncident';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Student Number', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Incident Type', alignRight: false },
  { id: 'role', label: 'Section', alignRight: false },
  { id: 'role', label: 'Year Level', alignRight: false },
  { id: 'isVerified', label: 'Status', alignRight: false },
  { id: '' },
];


// MODAL ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  height:'55%',

  bgcolor: 'background.paper',
  border: '2px solid #ffffff',
  boxShadow: 24,
  borderRadius: 1,
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

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [filterSelect, setFilterSelect] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  let incidentFilter = ''
  let sectionFilter = ''
  let yearFilter = ''
  let statusFilter = ''
  let selectFilter = ''
  
  const handleFilterIncident = (event, currentValue) => {
    incidentFilter = currentValue
    console.log(getUid())
    if(getUserType !== 'Student')
    {
    const q = query(collection(firestore, "incidents"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().incidentType === incidentFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(incidentFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  else{
    const q = query(collection(firestore, "incidents"), where('uid' , '==', getUid()));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().incidentType === incidentFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(incidentFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  };

  const handleFilterSection = (event, currentValue) => {
    sectionFilter = currentValue
    if(getUserType !== 'Student')
    {
    const q = query(collection(firestore, "incidents"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().section === sectionFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(sectionFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  else{
    const q = query(collection(firestore, "incidents"), where('uid' , '==', getUid()));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().section === sectionFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(sectionFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  };

  const handleFilterYear = (event, currentValue) => {
    yearFilter = currentValue
    if(getUserType !== 'Student')
    {
    const q = query(collection(firestore, "incidents"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().year === yearFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(yearFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  else{
    const q = query(collection(firestore, "incidents"), where('uid' , '==', getUid()));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().section === yearFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(yearFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  };

  const handleFilterStatus = (event, currentValue) => {
    statusFilter = currentValue
    if(getUserType !== 'Student')
    {
    const q = query(collection(firestore, "incidents"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().status === statusFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(statusFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  else{
    const q = query(collection(firestore, "incidents"), where('uid' , '==', getUid()));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().status === statusFilter){
          temp.push(doc.data());
          console.log(doc.data())
        }
        else{
          if(statusFilter === ''){
            temp.push(doc.data());
            console.log('none')
          }
        }
        
        
      });
      setIncidentData(temp)
    });
  }
  };
  const handleFilterSelect = (event, currentValue) => {
    selectFilter = currentValue
    setFilterSelect(currentValue)
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


// MODAL CONST----------------------------------------------------------------------

  const [open, setOpen] = React.useState(false);
  const [incidentData, setIncidentData] = useState([])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

// PRINT BUTTON----------------------------------------------------------------------
const getAllDocuments = (db,collectionName) =>{
  if(getUserType() === 'Student'){
  const collectionList = query(collection(db, collectionName), where('uid', '==', getUid()));
  const unsubscribe = onSnapshot(collectionList, (querySnapshot) => {
    const temp = [];
    querySnapshot.forEach((doc) => {
      if(doc.data().status === 'close')
      {
        temp.push(doc.data());
      }
    });
    setIncidentData(temp)
  });
}
else{
  const collectionList = query(collection(db, collectionName));
  const unsubscribe = onSnapshot(collectionList, (querySnapshot) => {
    const temp = [];
    querySnapshot.forEach((doc) => {
      if(doc.data().status === 'close')
      {
        temp.push(doc.data());
      }
    });
    setIncidentData(temp)
  });
}
}

React.useEffect(() => {
  getAllDocuments(firestore,"incidents")
}, [])
                                                         
  return (
    <Page title="Incidents Reports">
    
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>


          

          {/* <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            File Report
          </Button> */}

          
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
          <Box style={{marginTop:'25px', marginBottom:'20px'}}>
          <Button variant="contained">Contained</Button>
          </Box>

        </Box>
        </Modal>
        </Stack>

        <Card>
        <UserListToolbar numSelected={selected.length} filterName={filterName} filterSelect={filterSelect}
          onFilterName={handleFilterByName} 
          onFilterStatus={handleFilterStatus}
          onFilterYear={handleFilterYear}
          onFilterSection={handleFilterSection}
          onFilterIncident={handleFilterIncident} 
          onFilterSelect={handleFilterSelect}
          />
          
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {incidentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
                    const { studentNumber, 
                            studentName, 
                            date, 
                            incidentId, 
                            incidentType, 
                            year,
                            section,
                            specificDetail,
                            status,              
                            } = row;
                    const isItemSelected = selected.indexOf(studentName) !== -1;

                    return (
                      <TableRow
                        hover
                        key={key}
                        tabIndex={-1}
                        // role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                      
                        <TableCell align="left">{studentNumber}</TableCell>
                        <TableCell style={{padding:'15px'}} component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/* <Avatar alt={studentName} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {studentName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{incidentType}</TableCell>
                        <TableCell align="left">{section}</TableCell>
                        <TableCell align="left">{year}</TableCell>
                        <TableCell align="left">
                          <Label variant="ghost" color={(status === 'close' && 'error') || 'success'}>
                            {sentenceCase(status)}
                          </Label>
                        </TableCell>

                        <TableCell align="right">
                          <UserMoreMenuReport data={row}/>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={incidentData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        
      </Container>

      
      
    </Page>
    
  );
}
