import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// firebase
import { auth,firestore } from "src/firebase/firebase-config";
import { signInWithEmailAndPassword, deleteUser } from "firebase/auth"
import { doc, getDoc, deleteDoc, updateDoc, } from "firebase/firestore";

import { getFirstName, getLastName, getUid, getUserType } from 'src/sections/auth/login/LoginModel';
import { setIndividualData } from './individualModel';

// component
import Iconify from '../../../components/Iconify';



const base64 = require('base-64');

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  setIndividualData(props.data)
  const navigate = useNavigate();
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
  const ProcessIncident = async(incidentId) =>{
    const washingtonRef = doc(firestore, "incidents", incidentId.toString());

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      status: 'on process',
      processBy: `${getFirstName()} ${getLastName()}`,
    });

  }

  const DeleteIncident = async(incidentId) =>{
    await deleteDoc(doc(firestore, "incidents", incidentId.toString()));
    await updateDoc(doc(firestore, "users", getUid().toString()), {
      onIncident: false
    });
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
        {getUserType() !== 'Student' && props.data.status === 'open' ?
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} onClick={()=>{
          ProcessIncident(props.data.incidentId)
        }}
          >
          <ListItemIcon>
            <Iconify icon="eva:bookmark-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Process report" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        :
        <></>
        }

        {props.data.status !== 'open' ?
          <MenuItem component={RouterLink} to="/IR/IndividualReport" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:eye-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="View" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        :
        <></>
        }

        {getUserType() === 'Student' ?
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} onClick={()=>{
            DeleteIncident(props.data.incidentId)
          }}>
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
