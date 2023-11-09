import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editBrandAPI } from 'src/components/services';

export default function BrandEditDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast, product } = props;
  const [name, setName] = useState();
  // const [quantity, setQuantity] = useState();
  // const [price, setPrice] = useState();
  // const [manufacturer, setManufacturer] = useState();
  // const [accessoryType, setAccessoryType] = useState();
  const [isError, setIsError] = useState(false);
  // const [listManufacturer, setListManufacturer] = useState();
  // const [listAccessoryType, setListAccessoryType] = useState();

  React.useEffect(() => {
    setName(product?.BrandName);
    // setPrice(product?.price);
    // setQuantity(product?.quantity);
    // setManufacturer(product?.manufacturer);
    // setAccessoryType(product?.accessoryType);
  }, [product]);

  const editProduct = async (data, productId) => {
    try {
      const res = await editBrandAPI(data, productId);
      let errorMessage = res.message || 'Cập nhật Hãng thất bại';
      let successMessage = res.message || 'Cập nhật Hãng thành công';

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
        BrandName: name,
      };

      editProduct(data, product?.BrandID);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        {/* <DialogTitle>Chỉnh sửa hãng</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>Chỉnh sửa hãng</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
        <DialogContent sx={{ height: 150, width: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên hãng"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            sx={{ mt: 4 }}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 3,
            }}
          >
            <TextField
              autoFocus
              id="quantity"
              label="Quantity"
              type="number"
              size="medium"
              value={quantity}
              sx={{ width: 500, mr: 2 }}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <TextField
              id="price"
              label="Price"
              type="Number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Box>
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
          </p> */}
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
