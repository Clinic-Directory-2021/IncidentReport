import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import {Link, Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
// Login Model
import { getEmail, getFirstName, getLastName, getMiddleName, getUserType } from 'src/sections/auth/login/LoginModel';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_
import account from '../../_mock/account';


// ----------------------------------------------------------------------


const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '/student/profile',
  },
  {
    label: 'Change Password',
    icon: 'eva:settings-2-fill',
    linkTo: '/student/settings',
  },
  {
    label: 'Logout',
    icon: 'eva:settings-2-fill',
    linkTo: '/login',
  },
];

const ADMIN = [
  {
    label: 'Logout',
    icon: 'eva:settings-2-fill',
    linkTo: '/login',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
          {getFirstName()} {getMiddleName()} {getLastName()}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {getEmail()}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {getUserType() !== 'Admin' ?
          MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))
          :
          ADMIN.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))
          }
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
        {/* <MenuItem onClick={handleClose} sx={{ m: 1 }}>
          Logout
        </MenuItem> */}
      </MenuPopover>
    </>
  );
}
