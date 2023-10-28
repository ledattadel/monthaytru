import * as React from 'react';
import { Button, Box, Autocomplete, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addNewStaffAPI, addNewUserAPI } from '../../components/services/index';
import { Vi } from 'src/_mock/Vi';

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
  const [errors, setIsErrors] = React.useState([]);

  const addNewUser = async (data) => {
    try {
      const res = await addNewStaffAPI(data);
      let errorMessage = res.message || 'Thêm nhân viên thất bại';
      let successMessage = res.message || 'Thêm nhân viên thành công';
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
    if (!name || !phoneNumber || !userName || !password || !idCardNumber) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        idCardNumber: idCardNumber,
        name: name,
        email: email || 'Chưa có email',
        phoneNumber: phoneNumber,
        username: userName,
        password: password,
        address: address || 'Chưa có địa chỉ',
        roleName: role || DataRole?.[0]?.name,
      };

      addNewUser(data);
    }
  };

  const regexPhoneNumber = (phone) => {
    const regexPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    return phone.match(regexPhoneNumber) ? true : false;
  };
  const regexCCCD = (phone) => {
    const regexPhoneNumber = /([0-9]{12})\b/g;

    return phone.match(regexPhoneNumber) ? true : false;
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const checkUser = (value) => {
    let flat = false;
    if (value?.length < 6 || value?.length > 32) {
      flat = true;
    }
    return flat;
  };
  const handleError = (value, isBool) => {
    const tempErr = [...errors];
    const data = tempErr?.filter((e) => e === value);
    const data1 = tempErr?.filter((e) => e !== value);
    if (data?.length > 0 && isBool) {
      setIsErrors(data1);
    } else if (data?.length > 0 || isBool) {
    } else {
      data1?.push(value);
      setIsErrors(data1);
    }
  };

  const isCheckError = (value) => {
    const tempErr = [...errors];
    const data = tempErr?.filter((e) => e === value);
    let isFlat = false;
    if (data?.length > 0) {
      isFlat = true;
    }
    return isFlat;
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
              onChange={(e) => {
                if (!regexCCCD(e?.target?.value)) {
                  handleError('CCCD', false);
                } else {
                  handleError('CCCD', true);
                }
                setIdCardNumber(e?.target?.value);
              }}
              required
            />

            {/* <Box>
              <TextField
                margin="dense"
                id="Số điện thoại"
                label="Số điện thoại"
                type="number"
                variant="outlined"
                // sx={{ mt: 2 }}
                fullWidth
                onChange={(e) => {
                  if (!regexPhoneNumber(e?.target.value)) {
                    setIsErrors('phoneNumber');
                  } else {
                    setIsErrors('');
                  }
                  setPhoneNumber(e.target.value);
                }}
                required
              />
              {errors === 'phoneNumber' ? (
                <Typography style={{ color: 'red' }}>số điện thoại không hợp lệ</Typography>
              ) : null}
            </Box> */}
          </Box>
          {isCheckError('CCCD') ? <Typography style={{ color: 'red' }}>{Vi.cccdError}</Typography> : null}
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
              onChange={(e) => {
                if (checkUser(e?.target?.value)) {
                  handleError('userName', false);
                } else {
                  handleError('userName', true);
                }
                setUserName(e?.target?.value);
              }}
              // setUserName(e.target.value)}

              required
            />
            <TextField
              margin="dense"
              id="Mật khẩu"
              label="Mật khẩu"
              type="password"
              variant="outlined"
              // sx={{ mr: 4 }}
              // fullWidth
              onChange={(e) => {
                if (checkUser(e?.target?.value)) {
                  handleError('passWord', false);
                } else {
                  handleError('passWord', true);
                }
                setPassword(e?.target?.value);
              }}
              // security={true}

              // setPassword(e.target.value)}
              required
            />
          </Box>
          {isCheckError('userName') ? <Typography style={{ color: 'red' }}>{Vi.userNameError}</Typography> : null}
          {isCheckError('passWord') ? <Typography style={{ color: 'red' }}>{Vi.passwordError}</Typography> : null}
          <Box
            sx={{
              // display: 'flex',
              // alignItems: 'center',
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
              // onChange={(e) => setPhoneNumber(e.target.value)}
              required
              onChange={(e) => {
                if (!regexPhoneNumber(e?.target?.value)) {
                  handleError('phoneNumber', false);
                } else {
                  handleError('phoneNumber', true);
                }
                setPhoneNumber(e?.target?.value);
              }}
            />
            {isCheckError('phoneNumber') ? <Typography style={{ color: 'red' }}>{Vi.phoneError}</Typography> : null}
          </Box>
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => {
              if (!validateEmail(e?.target?.value)) {
                handleError('email', false);
              } else {
                handleError('email', true);
              }
              setEmail(e?.target?.value);
            }}
            required
          />
          {isCheckError('email') ? <Typography style={{ color: 'red' }}>{Vi.emailError}</Typography> : null}
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
