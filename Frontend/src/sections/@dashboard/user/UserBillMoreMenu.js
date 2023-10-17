import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function UserMoreMenu(props) {
  const { status, handleEditCart, handleRefuseCart, handleDeleteCart, handleConfirmCart } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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
        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" onClick={handleEditCart} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {status === 5 && (
          <MenuItem sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="line-md:circle-to-confirm-circle-transition" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Confirm" onClick={handleConfirmCart} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {status === 1 && (
          <>
            <MenuItem sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Iconify icon="eva:trash-2-outline" width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Delete cart"
                onClick={handleDeleteCart}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            <MenuItem sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Iconify icon="healthicons:refused-outline" width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Refuse cart"
                onClick={handleRefuseCart}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
