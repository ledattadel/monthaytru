import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editProductAPI, getAllBrand, getAllAccessoryTypeAPI } from 'src/components/services';

export default function ProductEditDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast, product } = props;
  const [name, setName] = React.useState();
  const [quantity, setQuantity] = React.useState();
  const [price, setPrice] = React.useState();
  const [brand, setBrand] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [listBrand, setListBrand] = React.useState([]);

  React.useEffect(() => {
    console.log(product.brand);
    setName(product?.ProductName);
    setPrice(product?.Price);
    setQuantity(product?.Unit);
    setBrand(product?.brand?.BrandName);
    setDescription(product?.ProductDescription);
  }, [product, product.brand.BrandName]);

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

  
  const fetchAllBrand = async () => {
    try {
      const res = await getAllBrand();
      setListBrand(res?.data);
      // console.log("res:::",res);
    } catch (error) {
      console.log(error);
    }
  };


  const getAllProductType = async () => {
    try {
      const res = await getAllAccessoryTypeAPI();
      // setListAccessoryType(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchAllBrand();
    // getAllProductType();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditUser = () => {
    // if (!name || !quantity || !manufacturer || !accessoryType) {
    //   setIsError(true);
    // } else {
    //   setIsError(false);
    //   const data = {
    //     name,
    //     quantity,
    //     manufacturer: manufacturer?.id,
    //     accessoryType: accessoryType?.id,
    //     price,
    //   };

    //   editProduct(data, product?.id);
    // }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Cập nhật sản phẩm</DialogTitle>
        <DialogContent sx={{ height: 650 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên sản phẩm"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <TextField
              autoFocus
              id="quantity"
              label="Số lượng"
              type="number"
              size="medium"
              sx={{ width: 500, mr: 2 }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <TextField
              id="price"
              label="Giá"
              type="Number"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <Autocomplete
              disablePortal
              id="brand"
              options={listBrand}
              getOptionLabel={(option) => option?.BrandName}
              sx={{ width: 500, mr: 2 }}
              value={brand}
              onChange={(e, newValue) => {
                
                setBrand(newValue?.BrandName);
              }}
              renderInput={(params) => <TextField {...params} label="brand" />}
            />
           
          </Box>
          <TextField
            margin="dense"
            id="description"
            label="Description"
            minRows={10}
            multiline
            fullWidth
            variant="outlined"
            sx={{ mt: 4 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
              Vui lòng điền đầy đủ
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleEditUser} type="submit">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
