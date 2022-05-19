import * as Yup from 'yup';
import React,{ useState,forwardRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// Validation import
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// component
import { auth, firestore } from "src/firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore";
import Iconify from '../../../components/Iconify';
import { getUserType, setEmail, setFirstName, setLastName, setMiddleName, setPassword, setSection, setStudentNumber, setUserType, setYear, setUid, setOnIncident } from './LoginModel';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [message,setMessage] = useState('')
  const [error, setError] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false);
  };
  const LoginAuth = async(email, password) =>{
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const userDoc = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userDoc)
      setLoading(false)
      if(email === 'incident.report.web.2022@gmail.com'){
        setUserType('Admin')
        setFirstName('BulSU')
        setLastName('Admin')
        setEmail(email)
      }
      else{
        if (userSnap.exists()){
          if(userSnap.data().userType === 'Student'){
            setStudentNumber(userSnap.data().studentNumber)
            setYear(userSnap.data().yearLevel)
            setSection(userSnap.data().section)
            setMiddleName(userSnap.data().middleName)
            setUserType(userSnap.data().userType)
            setFirstName(userSnap.data().firstName)
            setLastName(userSnap.data().lastName)
            setEmail(email)
            setPassword(userSnap.data().password)
            setUid(userSnap.id)
            setOnIncident(userSnap.data().onIncident)
          }
          else{
            setUserType(userSnap.data().userType)
            setFirstName(userSnap.data().firstName)
            setMiddleName('')
            setLastName(userSnap.data().lastName)
            setEmail(email)
            setPassword(userSnap.data().password)
            setUid(userSnap.id)
          }
          
        }else{
          console.log("No such document!");
        }
      }
      if(getUserType() === 'Admin')
      {
        navigate('/registrar/dashboard', { replace: true });
      }
      else if(getUserType() === 'Student'){
        navigate('/student/incidentsReports', { replace: true });
      }
      else{
        navigate('/evaluator/incidentsReports', { replace: true });
      }
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setMessage(errorMessage)
      setError(true)
      setLoading(false)
    });
  }

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      
      LoginAuth(formik.values.email,formik.values.password)
        
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack>


        
        {/* <Link variant="subtitle2" component={RouterLink} to="/registrar/dashboard">     */}
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Login
        </LoadingButton>
        <Snackbar open={error} autoHideDuration={6000}  onClose={handleClose}>
        <Alert severity="error">{message}</Alert>
        </Snackbar>
       {/* </Link> */}


      </Form>
    </FormikProvider>
  );
}
