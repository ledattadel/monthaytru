import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editProductAPI, getAllBrand, getAllAccessoryTypeAPI } from 'src/components/services';
import { useRef } from 'react';

export default function ProductEditDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast, product } = props;
  const [name, setName] = React.useState();
  const [quantity, setQuantity] = React.useState();
  const [price, setPrice] = React.useState();
  const [brand, setBrand] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [listBrand, setListBrand] = React.useState([]);

  const brandRef = useRef(product?.brand?.BrandName);
  React.useEffect(() => {
    fetchAllBrand();
    // getAllProductType();
  }, []);
  React.useEffect(() => {
    setName(product?.ProductName);
    setPrice(product?.Price);
    setQuantity(product?.Unit);
    setBrand(product?.brand?.BrandName);
    setDescription(product?.ProductDescription);
  }, [product]);

  const editProduct = async (data, productId) => {
    try {
      const res = await editProductAPI(data, productId);
      let errorMessage = res.message || 'Sửa sản phẩm thất bại';
      let successMessage = res.message || 'Sửa sản phẩm thành công';

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

  const fetchAllBrand = async () => {
    try {
      const res = await getAllBrand();
      setListBrand(res?.data);
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

    if (!name || !price || !brand) {
      console.log(quantity, name, price, brand);
      setIsError(true);
    } else {
      setIsError(false);

      const data = {
        ProductName: name,
        ProductDescription: description,
        BrandName: brand,
        // Unit: quantity,
        Price: price,
      };

      editProduct(data, product?.ProductID);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        {/* <DialogTitle>Cập nhật sản phẩm</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>Cập nhật sản phẩm</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
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
              getOptionLabel={(option) => option?.BrandName || brand}
              sx={{ width: 500, mr: 2 }}
              value={brand ? brand : brandRef.current}
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
          {/* <Button onClick={handleClose}>Huỷ</Button> */}
          <Button onClick={handleEditUser} type="submit">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
