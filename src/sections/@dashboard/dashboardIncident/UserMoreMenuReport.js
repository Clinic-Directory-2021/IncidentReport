import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';



// ----------------------------------------------------------------------


export default function UserMoreMenuReport() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  return (
    <>

          
          <div ref={componentRef} className="card">
          <li> Name : <span> Dr Andrew C S Koh </span> </li>
          </div>
  


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
      <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:eye-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="View" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:printer-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText onClick={handlePrint} primary="Print" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

