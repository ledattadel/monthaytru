import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editUserAPI } from '../../components/services/index';

export default function UserEditDialog(props) {
  const { openDialog, setOpenDialog, getAllUser, setContentToast, setSeverity, setOpenToast, user } = props;
  const [name, setName] = React.useState();
  // const [address, setAddress] = React.useState();
  const [email, setEmail] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setName(user?.name);
    // setAddress(user?.address);
    setEmail(user?.email);
    setPhoneNumber(user?.phoneNumber);
  }, [user]);

  const editUser = async (data) => {
    try {
      const res = await editUserAPI(user?.CustomerID, data);
      let errorMessage = res.message || 'Sửa user thất bại';
      let successMessage = res.message || 'success';
      if (res.status === 200) {
        setContentToast(successMessage);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllUser();
      } else {
        setContentToast(errorMessage);
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      setContentToast('Sửa user thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditUser = () => {
    if (!name || !email || !phoneNumber) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        idCardNumber: user?.idCardNumber,
        name,
        // address,
        email,
        phoneNumber,
      };

      editUser(data);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        {/* <DialogTitle>Chỉnh sửa khách hàng</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            label="Tên khách hàng"
            type="text"
            fullWidth
            value={name}
            sx={{ mt: 2 }}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* <TextField
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={address}
            sx={{ mt: 2 }}
            onChange={(e) => setAddress(e.target.value)}
            required
          /> */}
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            sx={{ mt: 2 }}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="phoneNumber"
            label="Số điện thoại"
            type="number"
            variant="outlined"
            sx={{ mt: 2 }}
            value={phoneNumber}
            fullWidth
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <p
            style={{
              margin: '10px',
              color: 'red',
              fontWeight: 'Bold',
              justifyContent: 'flex-end',
              display: isError ? 'flex' : 'none',
            }}
          >
            Nhập đủ thông tin
          </p>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Huỷ</Button> */}
          <Button onClick={handleEditUser} type="submit">
            Sửa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
