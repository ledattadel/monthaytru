import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editProductAPI, getAllBrand, getAllAccessoryTypeAPI, editProductDetailAPI } from 'src/components/services';
import { useRef } from 'react';
import { Vi } from 'src/_mock/Vi';

export default function ProductDetailEditDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast, product } = props;
  const [name, setName] = React.useState();
  const [quantity, setQuantity] = React.useState();
  const [importPrice, setInportPrice] = React.useState();
  const [price, setPrice] = React.useState();
  const [brand, setBrand] = React.useState();
  const [supplier, setSupplier] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [listBrand, setListBrand] = React.useState([]);
  const [isErrors, setIsErrors] = React.useState(false);

  const brandRef = useRef(product?.brand?.BrandName);
  React.useEffect(() => {
    fetchAllBrand();
    // getAllProductType();
  }, []);
  React.useEffect(() => {
    setName(product?.product?.ProductName);
    setPrice(parseInt(product?.SellingPrice));
    setQuantity(product?.Quantity);
    setSupplier(product?.supplier?.name);
    setBrand(product?.product?.brand?.BrandName);
    setDescription(product?.product?.ProductDescription);
    setInportPrice(parseInt(product?.PurchasePrice));
  }, [product]);

  const editProduct = async (data, productId) => {
    try {
      const res = await editProductDetailAPI(data, productId);
      let errorMessage = res.message || Vi.editProductFail;
      let successMessage = res.message || Vi.editProductSucces;

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
      setContentToast(Vi.editProductFail);
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
  const onlyNumber = (value) => {
    const pattern = /^\d+$/;
    let flat = false;
    if (pattern.test(value)) {
      flat = true;
    } else if (value === '') {
      setPrice('');
    }
    return flat;
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

    if (!quantity || !name || !price || !brand) {
      setIsError(true);
    } else if (price < importPrice) {
      setContentToast(Vi.priceError);
      setOpenToast(true);
      setSeverity('error');
    } else if (price % 1000 !== 0) {
      setContentToast(Vi.price1000);
      setOpenToast(true);
      setSeverity('error');
    } else {
      setIsError(false);

      const data = {
        SellingPrice: price,
      };

      editProduct(data, product?.ProductDetailID);
    }
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
            disabled={true}
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
              disabled={true}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <TextField
              autoFocus
              id="importPrice"
              label="Gía nhập"
              type="number"
              size="medium"
              sx={{ width: 500, mr: 2 }}
              value={importPrice}
              onChange={(e) => setInportPrice(e.target.value)}
              required
              disabled={true}
            />
            <TextField
              id="price"
              label="Giá bán"
              type="Number"
              fullWidth
              value={price}
              onChange={(e) => {
                if (!onlyNumber(e.target.value)) {
                  return;
                } else {
                  if (e.target.value?.length < 4) {
                    setIsErrors(true);
                  } else {
                    setIsErrors(false);
                  }

                  setPrice(e.target.value);
                }
              }}
              required
            />
          </Box>
          {isErrors ? <Typography style={{ color: 'red' }}>Gía phải lớn hơn 1.000d</Typography> : null}
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
              sx={{ width: 255, mr: 2 }}
              value={brand ? brand : brandRef.current}
              onChange={(e, newValue) => {
                setBrand(newValue?.BrandName);
              }}
              disabled={true}
              renderInput={(params) => <TextField {...params} label="Hãng" />}
            />
            <TextField
              margin="dense"
              id="description"
              label="Nhà sản xuất"
              // minRows={10}
              // multiline
              sx={{ width: 280 }}
              variant="outlined"
              disabled={true}
              onChange={(e) => setDescription(e.target.value)}
              required
              value={supplier}
            />
          </Box>
          <TextField
            margin="dense"
            id="description"
            label="Mô tả"
            minRows={8}
            multiline
            fullWidth
            variant="outlined"
            sx={{ mt: 4 }}
            value={description}
            disabled={true}
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
