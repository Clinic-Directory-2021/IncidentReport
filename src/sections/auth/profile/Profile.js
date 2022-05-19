import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '@mui/material/Snackbar';

// component
import { auth,firestore } from 'src/firebase/firebase-config';
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore"; 

import { getEmail, getFirstName, getLastName, getMiddleName, getSection, getStudentNumber, getYear, setEmail, setFirstName, setLastName, setMiddleName, setSection, setStudentNumber, setYear, } from '../login/LoginModel';

import Iconify from '../../../components/Iconify';


const base64 = require('base-64');

// ----------------------------------------------------------------------

export default function Profile() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [message,setMessage] = useState('')
  const disableVar = true

  const UpdateAuth = (data) =>{
    setLoading(true)
    updateProfile(auth.currentUser, {
      email: data.email,
    }).then(async() => {
      const washingtonRef = doc(firestore, "users", auth.currentUser.uid);
      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, data);
      setOpen(true)
      setMessage('Profile Modified')
      setLoading(false)
      setFirstName(data.firstName)
      setMiddleName(data.middleName)
      setLastName(data.lastName)
      setEmail(data.email)
      setStudentNumber(data.studentNumber)
      setYear(data.yearLevel)
      setSection(data.section)
    }).catch((error) => {
      console.log(error)
    });
    
  }
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string(),
    studentNumber: Yup.string().required('Student number is required'),
    yearLevel: Yup.string().required('Year level is required'),
    section: Yup.string().required('Section is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: getFirstName(),
      middleName:getMiddleName(),
      lastName: getLastName(),
      studentNumber: getStudentNumber(),
      email: getEmail(),
      yearLevel: getYear(),
      section: getSection(),
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
    UpdateAuth(formik.values)
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const YEARLEVEL = [
    { label: '1'},
    { label: '2'},
    { label: '3'},
    { label: '4'},
    ];

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Middle Name"
              {...getFieldProps('middleName')}
            />

          <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />

          </Stack>

          <TextField
            fullWidth
            type="number"
            label="Student Number"
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

          <Autocomplete
            fullWidth
            disablePortal
            id="combo-box-demo"
            options={YEARLEVEL}
            defaultValue={formik.values.yearLevel}         
            renderInput={(params) => <TextField {...params} label="Year Level" 
            {...getFieldProps('yearLevel')}
            error={Boolean(touched.yearLevel && errors.yearLevel)}
            helperText={touched.yearLevel && errors.yearLevel} />}
            inputValue={formik.values.yearLevel}
            onInputChange={(event, newInputValue) => {
              formik.values.yearLevel = newInputValue
            }}
          />

          <TextField
            fullWidth
            label="Section"
            {...getFieldProps('section')}
            error={Boolean(touched.section && errors.section)}
            helperText={touched.section && errors.section}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Save
          </LoadingButton>
          <Snackbar open={open} autoHideDuration={6000} message={message} />
        </Stack>
      </Form>
    </FormikProvider>
  );
}
