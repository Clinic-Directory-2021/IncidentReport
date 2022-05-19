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

export default function Settings() {
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
          <Stack direction={{ xs: 'column'}} spacing={2}>
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Old Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

            <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            {...getFieldProps('confirmpassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.confirmpassword && errors.confirmpassword)}
            helperText={touched.confirmpassword && errors.confirmpassword}
            
          />

          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Register
          </LoadingButton>
          <Snackbar open={open} autoHideDuration={6000} message={message} />
        </Stack>
      </Form>
    </FormikProvider>
  );
}
