import * as React from 'react';
import { Button, Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import {
  getAllAccessoryTypeAPI,
  addNewProductAPI,
  getAllManufacturerAPI,
  addNewSupplierAPI,
} from 'src/components/services';
import { Vi } from 'src/_mock/Vi';

export default function SupplierDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [address, setAddress] = React.useState();
  const [isError, setIsError] = React.useState(false);

  const [errors, setErrors] = React.useState('');

  const addNewProduct = async (data) => {
    try {
      const res = await addNewSupplierAPI(data);
      let errorMessage = res.message || 'Thêm nhà cung cấp thất bại';
      let successMessage = res.message || 'Thêm nhà cung cấp thành công';

      if (res.status === 201) {
        setName(null);

        setContentToast(successMessage);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllProduct();
      } else {
        setContentToast(errorMessage);
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      console.log(error);
      setContentToast('Thêm nhà cung cấp thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
  };

  const handleAddProduct = () => {
    if (!name?.trim()) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        name: name,
        phoneNumber: phoneNumber,
        address: address,
      };
      addNewProduct(data);
    }
  };

  const handlePhoneNumber = (value) => {
    if (!onlyNumber(value)) {
      if (value === '') {
        setPhoneNumber(value);
      }
    } else if (value === '') {
      setPhoneNumber(value);
    } else if (!regexPhoneNumber(value)) {
      setErrors('phoneNumber');
      setPhoneNumber(value);
    } else {
      setPhoneNumber(value);
      setErrors('');
    }
  };

  const regexPhoneNumber = (phone) => {
    const regexPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    return phone.match(regexPhoneNumber) ? true : false;
  };

  const onlyNumber = (value) => {
    const pattern = /^\d+$/;
    let flat = false;
    if (pattern.test(value)) {
      flat = true;
    }
    return flat;
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        {/* <DialogTitle>{Vi.addNewSupplier}</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{Vi.addNewSupplier}</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
        <DialogContent sx={{ height: 300, width: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label={Vi.nameSupplier}
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="phone"
            label={Vi.phoneNumberSupplier}
            type="number"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => handlePhoneNumber(e.target.value)}
            required
          />

          {errors === 'phoneNumber' ? <Typography style={{ color: 'red' }}>{Vi.phoneError}</Typography> : null}
          <TextField
            margin="dense"
            id="address"
            label={Vi.addressSupplier}
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => setAddress(e.target.value)}
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
            Please enter full information
          </p>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Huỷ</Button> */}
          <Button onClick={handleAddProduct} type="submit">
            Tạo nhà cung cấp
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
