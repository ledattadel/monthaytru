import * as React from 'react';
import { Button, Box, Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addNewStaffAPI, addNewUserAPI } from '../../components/services/index';

const DataRole = [
  {
    name: 'manage',
    label: 'Quản lí',
  },
  {
    name: 'technician',
    label: 'Nhân viên sửa chửa',
  },
];
export default function StaffDialog(props) {
  const { openDialog, setOpenDialog, getAllStaff, setContentToast, setSeverity, setOpenToast } = props;
  const [idCardNumber, setIdCardNumber] = React.useState();
  const [name, setName] = React.useState();
  const [userName, setUserName] = React.useState();
  const [address, setAddress] = React.useState();
  const [password, setPassword] = React.useState();
  const [role, setRole] = React.useState(DataRole?.[0]?.name);
  const [email, setEmail] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  
  const [isError, setIsError] = React.useState(false);

  const addNewUser = async (data) => {
    try {
      const res = await addNewStaffAPI(data);
      let errorMessage = res.message ||  'Thêm nhân viên thất bại'
      let successMessage =  res.message || 'Thêm nhân viên thành công'
      if (res.status === 200) {
        setIdCardNumber(null);
        setName(null);
        // setAddress(null);
        setEmail(null);
        setPhoneNumber(null);
        setContentToast(successMessage);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllStaff();
      } else {
        setContentToast(errorMessage);
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      setContentToast('Thêm user thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setIdCardNumber(null);
    setName(null);
    // setAddress(null);
    setEmail(null);
    setPhoneNumber(null);
  };

  const handleAddStaff = () => {
    if (!name || !phoneNumber || !userName || !password || !idCardNumber ) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        idCardNumber: idCardNumber,
        name: name,
        email: email || "Chưa có email",
        phoneNumber: phoneNumber,
        username: userName,
        password: password,
        address : address || "Chưa có địa chỉ",
        roleName: role || DataRole?.[0]?.name,
      };  
     
      addNewUser(data);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Tạo nhân viên mới</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <TextField
              id="demo-helper-text-aligned-no-helper"
              label="Tên nhân viên"
              type="text"
              fullWidth
              sx={{ mr: 2 }}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              id="demo-helper-text-aligned-no-helper"
              label="CCCD/CMND"
              type="number"
              fullWidth
              sx={{ mr: 2 }}
              onChange={(e) => setIdCardNumber(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="Số điện thoại"
              label="Số điện thoại"
              type="number"
              variant="outlined"
              // sx={{ mt: 2 }}
              fullWidth
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <TextField
              autoFocus
              id="idCardNumber"
              label="Tên tài khoản"
              type="string"
              size="medium"
              sx={{ mr: 2 }}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="Mật khẩu"
              label="Mật khẩu"
              type="text"
              variant="outlined"
              // sx={{ mr: 4 }}
              // fullWidth
              onChange={(e) => setPassword(e.target.value)}
              required
            />
   
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <TextField
              margin="dense"
              id="Số điện thoại"
              label="Phone Number"
              type="number"
              variant="outlined"
              sx={{ mt: 2 }}
              fullWidth
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Box>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            <TextField
            margin="dense"
            id="address"
            label="Địa chỉ hiện tại"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Autocomplete
            disablePortal
            id="accessoryType"
            options={DataRole}
            getOptionLabel={(option) => option?.label}
            fullWidth
            onChange={(e, newValue) => {
            
              setRole(newValue?.name);
            }}
            sx={{ mt: 2 }}
            defaultValue={DataRole?.[0]}
            renderInput={(params) => <TextField {...params} label="Vai trò" />}
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
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleAddStaff} type="submit">
            Tạo nhân viên
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
