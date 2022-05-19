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
import { createUserWithEmailAndPassword, updatePassword } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore"; 
import { getPassword, setPassword } from '../login/LoginModel';
import Iconify from '../../../components/Iconify';


const base64 = require('base-64');

// ----------------------------------------------------------------------

export default function Settings() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [message,setMessage] = useState('')

  const SettingsAuth = async(data) =>{
    setLoading(true)
    console.log('hello')
    if(data.newPassword === data.confirmPassword){
      const user = auth.currentUser;
      if(data.oldPassword === base64.decode(getPassword()))
      {
        if(data.oldPassword !== data.newPassword){
          const newPassword = data.newPassword;
          const encodedPassword = base64.encode(data.newPassword)
          updatePassword(user, newPassword).then(async() => {
            const washingtonRef = doc(firestore, "users", auth.currentUser.uid);

          // Set the "capital" field of the city 'DC'
          await updateDoc(washingtonRef, {
            password: encodedPassword
          });
            setPassword(encodedPassword )
            setLoading(false)
            setOpen(true)
            setMessage('Successfully changed password')
          }).catch((error) => {
            setLoading(false)
            setOpen(true)
            setMessage(error)
          });
        }
        else{
          setLoading(false)
          setOpen(true)
          setMessage('New password should be differ to you old password.')
        }
      }
      else{
        setLoading(false)
        setOpen(true)
        setMessage('Wrong old password.')
      }
    }
    else{
      setLoading(false)
      setOpen(true)
      setMessage('Password and Confirm password does not matched')
    }
    
  }

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    oldPassword:Yup.string().min(8,'Password atleast 8 characters').max(12,'Password max 12 characters').required('Old Password is required'),
    newPassword: Yup.string().min(8,'Password atleast 8 characters').max(12,'Password max 12 characters').required('Password is required'),
    confirmPassword: Yup.string().required('Confirm Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      oldPassword:'',
      newPassword:'',
      confirmPassword:'',
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
    SettingsAuth(formik.values)
    formik.values.oldPassword = ''
    formik.values.newPassword = ''
    formik.values.confirmPassword = ''
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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
            {...getFieldProps('oldPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.oldPassword && errors.oldPassword)}
            helperText={touched.oldPassword && errors.oldPassword}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            {...getFieldProps('newPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.newPassword && errors.newPassword)}
            helperText={touched.newPassword && errors.newPassword}
          />

            <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Confirm Password"
            {...getFieldProps('confirmPassword')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
            
          />

          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Change Password
          </LoadingButton>
          <Snackbar open={open} autoHideDuration={6000} message={message} />
        </Stack>
      </Form>
    </FormikProvider>
  );
}
