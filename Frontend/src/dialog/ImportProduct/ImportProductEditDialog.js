import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editProductAPI, getAllManufacturerAPI, getAllAccessoryTypeAPI } from 'src/components/services';

export default function ImportProductEditDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast, product } = props;
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [manufacturer, setManufacturer] = useState();
  const [accessoryType, setAccessoryType] = useState();
  const [isError, setIsError] = useState(false);
  const [listManufacturer, setListManufacturer] = useState();
  const [listAccessoryType, setListAccessoryType] = useState();

  React.useEffect(() => {
    setName(product?.name);
    setPrice(product?.price);
    setQuantity(product?.quantity);
    setManufacturer(product?.manufacturer);
    setAccessoryType(product?.accessoryType);
  }, [product]);

  const editProduct = async (data, productId) => {
    try {
      const res = await editProductAPI(data, productId);
      if (res.status === 200) {
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllProduct();
      } else {
        setContentToast('Sửa sản phẩm thất bại');
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      setContentToast('Sửa sản phẩm thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const getAllManufacturer = async () => {
    try {
      const res = await getAllManufacturerAPI();
      // setListManufacturer(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProductType = async () => {
    try {
      const res = await getAllAccessoryTypeAPI();
      setListAccessoryType(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllManufacturer();
    getAllProductType();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditUser = () => {
    if (!name || !quantity || !manufacturer || !accessoryType) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        name,
        quantity,
        manufacturer: manufacturer?.id,
        accessoryType: accessoryType?.id,
        price,
      };

      editProduct(data, product?.id);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ height: 650 }}>
          <Autocomplete
            disablePortal
            id="accessoryType"
            value={accessoryType}
            options={listAccessoryType}
            getOptionLabel={(option) => option?.name}
            fullWidth
            sx={{ mt: 4 }}
            onChange={(_, newValue) => {
              setAccessoryType(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Accessory Type" />}
          />
          <Autocomplete
            disablePortal
            id="manufacturer"
            value={manufacturer}
            options={listManufacturer}
            getOptionLabel={(option) => option?.name}
            sx={{ mt: 4 }}
            onChange={(_, newValue) => {
              setManufacturer(newValue);
            }}
            renderInput={(params) => <TextField {...params} label="Manufacturer" />}
          />

          <TextField
            margin="dense"
            id="name"
            label="Product Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            sx={{ mt: 4 }}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Box
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
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditUser} type="submit">
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
