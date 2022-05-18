import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
// material
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';


// ----------------------------------------------------------------------

export default function RegisterForm() {
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

  const YEARLEVEL = [
    { label: '1'},
    { label: '2'},
    { label: '3'},
    { label: '4'},
    { label: '5'},
    { label: '6'},
    { label: '7'},
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
          />

          <TextField
            fullWidth
            label="Section"
            {...getFieldProps('section')}
            error={Boolean(touched.section && errors.section)}
            helperText={touched.section && errors.section}
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

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
