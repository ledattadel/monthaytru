import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editProductAPI, editSupplierAPI } from 'src/components/services';
import { Vi } from 'src/_mock/Vi';

export default function SupplierEditDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast, product } = props;
  const [name, setName] = useState();
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [address, setAddress] = React.useState();
  const [isError, setIsError] = useState(false);

  React.useEffect(() => {
    setName(product?.name);
    setPhoneNumber(product?.phoneNumber);
    setAddress(product?.address)
  }, [product]);

  const editProduct = async (data, productId) => {
    try {
      const res = await editSupplierAPI(data, productId);
      let errorMessage = res.message ||  'Cập nhật nhà cung cấp thất bại'
      let successMessage =  res.message || 'Cập nhật nhà cung cấp thành công'
     
      if (res.status === 200) {
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
      setContentToast('Sửa sản phẩm thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditUser = () => {
    if (!name) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        name: name,
        phoneNumber: phoneNumber,
        address: address
      };

      editProduct(data, product?.SupplierID);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Chỉnh sửa nhà cung cấp</DialogTitle>
        <DialogContent sx={{ height: 300, width: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label={Vi.nameSupplier}
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            sx={{ mt: 4 }}
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
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            value={phoneNumber}
          />
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
            value={address}
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
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleEditUser} type="submit">
            Sửa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
