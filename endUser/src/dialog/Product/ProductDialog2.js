import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addNewProductAPI, getAllManufacturerAPI, getAllAccessoryTypeAPI } from '../components/services/index';

export default function ProductDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();
  const [quantity, setQuantity] = React.useState();
  const [price, setPrice] = React.useState();
  const [brand, setBrand] = React.useState();
  const [accessoryType, setAccessoryType] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [listManufacturer, setListManufacturer] = React.useState([]);
  const [listBrand, setListBrand] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState();
  const [imageUrl, setImageUrl] = React.useState();

  const addNewProduct = async (data) => {
    try {
      const res = await addNewProductAPI(data);
      let errorMessage = res.message ||  'Thêm sản phẩm thất bại'
      let successMessage =  res.message || 'Thêm sản phẩm thành công'
      if (res.status === 200) {
        setName(null);
        setQuantity(null);
        setPrice(null);
        setBrand(null);
        // setAccessoryType(null);
        setDescription(null);
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
      setContentToast('Thêm product thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const getAllBrand = async () => {
    try {
      const res = await getAllBrand();
      setListBrand(res?.data);
      console.log("res:::",res);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAccessoryType = async () => {
    try {
      // const res = await getAllAccessoryTypeAPI();
      // setListAccessoryType(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // getAllManufacturer();
    // getAllAccessoryType();
    getAllBrand();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
    setQuantity(null);
    setPrice(null);
    setBrand(null);
    // setAccessoryType(null);
    setDescription(null);
  };

  const handleAddProduct = () => {
    if (!quantity || !name || !price || !brand  || !description) {
      setIsError(true);
    } else {
      setIsError(false);

      const data = { ProductName: name, ProductDescription : description, BrandName: brand, Unit:quantity, Price: price }


      // CALL API add new product
      addNewProduct(data);
    }
  };


  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Tạo mới sản phẩm</DialogTitle>
        <DialogContent sx={{ height: 650 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên sản phẩm"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
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
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <TextField
              id="price"
              label="Giá"
              type="Number"
              fullWidth
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
              options={listManufacturer}
              getOptionLabel={(option) => option?.name}
              sx={{ width: 500, mr: 2 }}
              onChange={(e, newValue) => {
                setBrand(newValue?.id);
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
            Please enter full information
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddProduct} type="submit">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
