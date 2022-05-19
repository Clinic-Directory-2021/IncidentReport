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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import Iconify from '../../../components/Iconify';

const base64 = require('base-64');

// ----------------------------------------------------------------------

export default function Profile() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [message,setMessage] = useState('')

  const RegisterAuth = (data) =>{
    setLoading(true)
    if(data.password === data.confirmpassword){
      createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async(userCredential) => {
        // Signed in 
        const user = userCredential.user;
          await setDoc(doc(firestore, "users", user.uid),{
            uid:user.uid,
            firstName:data.firstName,
            middleName:data.middleName,
            lastName:data.lastName,
            email:data.email,
            yearLevel:data.yearLevel,
            section:data.section,
            password:base64.encode(data.password),
            userType:'Student',
            studentNumber: data.studentNumber
          }).then(()=>{
          setOpen(true);
          setMessage('Successfully Addeded Evaluator')
          setLoading(false)
          navigate('/login', { replace: true });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setOpen(true);
        setMessage(errorMessage)
        setLoading(false)
        // ..
      });
    }
    else{
      setOpen(true);
      setMessage("Password and Confirm password does not matched.")
      setLoading(false)
    } 
  }
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
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
      yearLevel: '',
      section: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
    RegisterAuth(formik.values)
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
