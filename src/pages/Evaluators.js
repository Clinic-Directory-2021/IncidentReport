import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';

import {
  IconButton,
  InputAdornment,
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
  TablePagination
} from '@mui/material';
import { LoadingButton } from '@mui/lab';


// material

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserListToolbarEva, UserMoreMenu } from '../sections/@dashboard/dashboardIncident';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'image', label: 'Profile', alignRight: false },
  { id: 'firstname', label: 'First name', alignRight: false },
  { id: 'lastname', label: 'Last name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
];

const DATA = [
  {image:'https://picsum.photos/200/300',firstname:"Kenneth1", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth2", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth3", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth4", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth5", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth6", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth7", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth8", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth9", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
  {image:'https://picsum.photos/200/300',firstname:"Kenneth10", lastname:"Galvez", email:"kenneth.p.galvez@gmail.com"},
]


// MODAL ----------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 400,
  transform: 'translate(-50%, -50%)',
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
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


// MODAL CONST----------------------------------------------------------------------

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

// ADD EVALUATOR----------------------------------------------------------------------

    const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmpassword: Yup.string().required('Confirm Password is required'),
    studentNumber: Yup.string().required('Student number is required'),
    yearLevel: Yup.string().required('Year level is required'),
    section: Yup.string().required('Section is required'),

  });
const formik = useFormik({
  initialValues: {
    firstName: '',
    middleName:'',
    lastName: '',
    studentNumber: '',
    email: '',
    confirmpassword: '',
    password: '',
    yearLevel: '',
    section: '',
  },
  validationSchema: RegisterSchema,
  onSubmit: () => {
    navigate('/dashboard', { replace: true });
  },
});

const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;


  return (
    <Page title="List of Evaluators">



      <Container>
      
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          List of Evaluators
          </Typography>


          

          <Button onClick={handleOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add Evaluator
          </Button>

          
          <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        

      >
    
        <Box sx={style}>

          <div>
  
        <div>
        <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First Name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
          </Stack>
          <TextField
            fullWidth
            type="number"
            label="Last Name"
            {...getFieldProps('studentNumber')}
            error={Boolean(touched.studentNumber && errors.studentNumber)}
            helperText={touched.studentNumber && errors.studentNumber}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            label="Section"
            {...getFieldProps('section')}
            error={Boolean(touched.section && errors.section)}
            helperText={touched.section && errors.section}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
        </div>
    
      </div>

        </Box>
        </Modal>
        </Stack>

        <Card>
          <UserListToolbarEva numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          
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
                  {DATA.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // const { id, 
                    //         name, 
                    //         role, 
                    //         status, 
                    //         company, 
                    //         avatarUrl, 
                    //         isVerified
                            
                            
                    //         } = row;
                    const {
                      image,
                      firstname,
                      lastname,
                      email
                    } = row
                    const isItemSelected = selected.indexOf(firstname) !== -1;

                    return (
                      <TableRow
                        hover
                        key={firstname}
                        tabIndex={-1}
                        // role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        
                        <TableCell style={{padding:'15px'}} component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={'profle_picture'} src={image} />
                          </Stack>
                        </TableCell>
                        <TableCell style={{padding:'15px'}} component="th" scope="row" padding="none">
                              {firstname}
                        </TableCell>
                        <TableCell align="left">{lastname}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu />
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
            count={DATA.length}
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
