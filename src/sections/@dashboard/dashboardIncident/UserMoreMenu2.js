import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// firebase
import { auth,firestore } from "src/firebase/firebase-config";
import { signInWithEmailAndPassword, deleteUser } from "firebase/auth"
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import { getUserType } from 'src/sections/auth/login/LoginModel';

// component
import Iconify from '../../../components/Iconify';


const base64 = require('base-64');

// ----------------------------------------------------------------------

export default function UserMoreMenu2(props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const DeleteUser = async(db,collectionName,id) =>{
    const document = doc(db, collectionName, id);
    const docSnap = await getDoc(document);

    if (docSnap.exists()) {
      signInWithEmailAndPassword(auth, docSnap.data().email, base64.decode(docSnap.data().password))
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const userd = auth.currentUser;

        deleteUser(userd).then(() => {
          deleteDoc(doc(db, collectionName, id));
        }).catch((error) => {
          console.log(error)
          console.log('error 1')
        });

        console.log(userd)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        console.log('error 2')
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* {getUserType() !== 'Student' ?
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:bookmark-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Process report" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        :
        <></>
        }
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:eye-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="View" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem> */}

        {getUserType() === 'Admin' ?
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:archive-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        :
        <></>
        }

      </Menu>
    </>
  );
}
