import * as React from 'react';
import { Button, Box, Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editStaffAPI, editUserAPI } from '../../components/services/index';

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

export default function StaffEditDialog(props) {
  const { openDialog, setOpenDialog, getAllStaff, setContentToast, setSeverity, setOpenToast, user } = props;
  const [idCardNumber, setIdCardNumber] = React.useState();
  const [name, setName] = React.useState();
  const [userName, setUserName] = React.useState();
  const [address, setAddress] = React.useState();
  const [password, setPassword] = React.useState();
  const [role, setRole] = React.useState(DataRole?.[0]);
  const [email, setEmail] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setName(user?.name);
    setAddress(user?.address);
    setEmail(user?.email);
    setIdCardNumber(user?.idCardNumber);
    setUserName(user?.username);
    setPassword('');
    setEmail(user?.email);
    setPhoneNumber(user?.phoneNumber);
    setRole(DataRole?.[1]?.name === user?.Role ? DataRole?.[1].name : DataRole?.[0].name);
  }, [user]);

  const editUser = async (data) => {
    try {
      const res = await editStaffAPI(user?.id,data);
      let errorMessage = res.message ||  'Sửa nhân viên thất bại'
      let successMessage =  res.message || 'Sửa nhân viên thành công'
      if (res.status === 200) {
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
      setContentToast('Sửa Nhân viên thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditUser = () => {
    if (!name || !phoneNumber || !userName || !idCardNumber ) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        idCardNumber: idCardNumber,
        name: name,
        email: email || "Chưa có email",
        phoneNumber: phoneNumber,
        username: userName,
        password: password || '',
        address : address || "Chưa có địa chỉ",
        roleName: role || DataRole?.[0]?.name,
      };  
     
      editUser(data);
    }
  };
  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
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
              value={name}
            />
             <TextField
              id="demo-helper-text-aligned-no-helper"
              label="CCCD/CMND"
              type="number"
              fullWidth
              sx={{ mr: 2 }}
              onChange={(e) => setIdCardNumber(e.target.value)}
              required
              value={idCardNumber}
            />
            <TextField
              margin="dense"
              id="Số điện thoại"
              label="Số điện thoại"
              // type="number"
              variant="outlined"
              // sx={{ mt: 2 }}
              fullWidth
              value={phoneNumber}
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
              id="taikhoan"
              label="Tên tài khoản"
              // type="number"
              size="medium"
              sx={{ mr: 2 }}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              id="mật khẩu"
              label="Mật khẩu"
              type="text"
              variant="outlined"
              // sx={{ mr: 4 }}
              // fullWidth
              value={password}
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
     
          </Box>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            value={email}
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
            value={address}
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
            defaultValue={role}
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
          <Button onClick={handleEditUser} type="submit">
            sửa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
