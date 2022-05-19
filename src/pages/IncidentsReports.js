import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import "./App.css"


// firebase
import { auth, firestore, storage } from 'src/firebase/firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, query, where, onSnapshot, updateDoc, deleteDoc  } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

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
  Autocomplete,
  Snackbar
} from '@mui/material';

import { getEmail, getFirstName, getLastName, getMiddleName, getSection, getStudentNumber, getUid, getUserType, getYear, getOnIncident, setOnIncident } from 'src/sections/auth/login/LoginModel';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/dashboardIncident';
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

const INCIDENT_TYPE = [
  { id:'1', label: 'Remaining Balance'},
  { id:'2', label: 'Failed a subject'},
  { id:'3', label: 'Adding/Changing subject'},
  { id:'4', label: 'Subjects with INC'},
  { id:'5', label: 'Subjects from lower year level not taken yet'},
  { id:'6', label: 'Subjects that are not available on the current semester not yet taken '},
  { id:'7', label: 'Others'},
  ];


// MODAL ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
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

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [incidentData, setIncidentData] = useState([])

  const getAllDocuments = (db,collectionName) =>{
    if(getUserType() === 'Student'){
    const collectionList = query(collection(db, collectionName), where('uid', '==', getUid()));
    const unsubscribe = onSnapshot(collectionList, (querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().status !== 'close')
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
          temp.push(doc.data());
      });
      setIncidentData(temp)
    });
  }
  }

  React.useEffect(() => {
    getAllDocuments(firestore,"incidents")
  }, [])

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

  const handleFilterIncident = (event, currentValue) => {
    incidentFilter = currentValue
    filterTable(incidentFilter,sectionFilter,yearFilter,statusFilter)
    // const q = query(collection(firestore, "incidents"), where("studentNumber", "==", getStudentNumber()));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const temp = [];
    //   querySnapshot.forEach((doc) => {
    //     if(doc.data().incidentType === incidentFilter || doc.data().incidentType === sectionFilter || doc.data().incidentType === yearFilter || doc.data().incidentType === statusFilter){
    //       temp.push(doc.data());
    //     }
    //     else{
    //       if(incidentFilter === ''){
    //         temp.push(doc.data());
    //       }
    //     }
        
        
    //   });
    //   setIncidentData(temp)
    // });
  };
  const handleFilterSection = (event, currentValue) => {
    sectionFilter = currentValue
    filterTable(incidentFilter,sectionFilter,yearFilter,statusFilter)
  };
  const handleFilterYear = (event, currentValue) => {
    yearFilter = currentValue
    filterTable(incidentFilter,sectionFilter,yearFilter,statusFilter)
  };

  const handleFilterStatus = (event, currentValue) => {
    statusFilter = currentValue
    filterTable(incidentFilter,sectionFilter,yearFilter,statusFilter)
  };

  const filterTable = (incident,section, year, status) =>{
    console.log(incident)
    console.log(status)
    console.log(year)
    console.log(section)
  }


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


// MODAL CONST----------------------------------------------------------------------

  const [open, setOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [buttonDisable, setButtonDisable] = React.useState(getOnIncident())
  const [image, setImage] = React.useState(null)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const IncidentAuth = async(data) =>{
      const incidentId =  Date.parse(new Date())
      const updateUser = doc(firestore, "users", getUid())
      const imageRef = ref(storage, `incident/  ${incidentId}/`)
      // const img = await fetch(image)
      // const bytes = await img.blob()
      let tempImg = ''
      uploadBytes(imageRef, image).then((snapshot) => {
        console.log(`Uploaded a blob or file! ${snapshot.ref}`);
        getDownloadURL(snapshot.ref).then(url => {tempImg = url})
      });
      await setDoc(doc(firestore, "incidents", incidentId.toString()),{
        studentNumber: data.studentNumber,
        studentName: data.studentName,
        year:data.year,
        section:data.section,
        incidentType:data.incidentType,
        resolution:data.resolution,
        processBy:data.processBy,
        date:data.date,
        incidentId:incidentId,
        specificDetail:data.specificDetail,
        status:'open',
        email:data.email,
        uid:data.uid,
        imageUri:image,
      }).then(()=>{
        
    });
    await updateDoc(updateUser, {
      onIncident: true
    });
    setOnIncident(true)
    setButtonDisable(true)
  }

  const IncidentSchema = Yup.object().shape({
    studentNumber: Yup.string(),
    studentName: Yup.string(),
    year: Yup.string(),
    section: Yup.string(),
    incidentType: Yup.string().required('Incident type is required'),
    specificDetail: Yup.string(),
    resolution: Yup.string(),
    processBy: Yup.string(),
    date: Yup.string(),
    email: Yup.string(),
    uid: Yup.string()
  });

  const currentDate = () =>{
    const date = new Date()
    return `${(date.getMonth() +1)}  /  ${(date.getDate())}  / ${(date.getFullYear())}`
  }

  const formik = useFormik({
    initialValues: {
      studentNumber: getStudentNumber(),
      studentName: `${getFirstName()} ${getMiddleName()} ${getLastName()}`,
      year:getYear(),
      section:getSection(),
      incidentType:'',
      resolution:'',
      processBy:'',
      date:currentDate(),
      specificDetail:'',
      email:getEmail(),
      uid:getUid(),
    },
    validationSchema: IncidentSchema,
    onSubmit: () => {
      if(formik.values.specificDetail === ''){
        alert('Please provide specific detail/s')
      }
      else{
        IncidentAuth(formik.values)
        setOpen(false)
        setSnackOpen(true)
      }
      
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  const inputChange = (event, currentValue) =>{
    const image = URL.createObjectURL(event.target.files[0])
    setImage(image)
  }
  return (
    <Page title="Incidents Reports">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Incidents Reports
          </Typography>


          

          {getUserType() === 'Student'?
          <Button onClick={handleOpen} disabled={buttonDisable} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            File Report
          </Button>
          :
          <></>
          }

          
          <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"   
      >
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Box sx={style}>
              <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-demo"
                options={INCIDENT_TYPE}         
                renderInput={(params) => <TextField {...params} label="Incident Type" 
                {...getFieldProps('incidentType')}
                error={Boolean(touched.incidentType && errors.incidentType)}
                helperText={touched.incidentType && errors.incidentType} />}
                inputValue={formik.values.incidentType}
                onInputChange={(event, newInputValue) => {
                  formik.values.incidentType = newInputValue
                }}
                getOpt
              />
              <div style={{marginTop:'20px'}}>
                <CKEditor
                editor={ClassicEditor}
                onChange={( event, editor ) => {
                  const data = editor.getData();
                  // console.log( { event, editor, data });
                  formik.values.specificDetail = data
                } }
                />
              </div>
              <input type="file" onChange={inputChange}/>
              <Box style={{marginTop:'20px', marginBottom:'20px'}}>
              <Button variant="contained"  type="submit">Submit</Button>
            </Box>

            </Box>
          </Form>
          </FormikProvider>
        </Modal>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} 
          onFilterStatus={handleFilterStatus}
          onFilterYear={handleFilterYear}
          onFilterSection={handleFilterSection}
          onFilterIncident={handleFilterIncident} 
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
                  {incidentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                        key={incidentId}
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
                          <UserMoreMenu data={row} />
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
        <Snackbar open={snackOpen} autoHideDuration={6000} message={'Successfully send a incident report'} />
      </Container>
      
    </Page>
    
  );
}
