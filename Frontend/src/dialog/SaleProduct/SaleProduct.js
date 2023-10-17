import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addNewProductAPI, getAllManufacturerAPI, getAllAccessoryTypeAPI } from 'src/components/services';

export default function SaleProduct(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();
  // const [quantity, setQuantity] = React.useState();
  const [price, setPrice] = React.useState();
  // const [manufacturer, setManufacturer] = React.useState();
  const [accessoryType, setAccessoryType] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  // const [listManufacturer, setListManufacturer] = React.useState([]);
  const [listAccessoryType, setListAccessoryType] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState();
  const [imageUrl, setImageUrl] = React.useState();

  const addNewProduct = async (data) => {
    try {
      const res = await addNewProductAPI(data);
      if (res.status === 200) {
        setName(null);
        // setQuantity(null);
        setPrice(null);
        // setManufacturer(null);
        setAccessoryType(null);
        setDescription(null);
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllProduct();
      } else {
        setContentToast('Thêm product thất bại');
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

  const getAllManufacturer = async () => {
    try {
      const res = await getAllManufacturerAPI();
      // setListManufacturer(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAccessoryType = async () => {
    try {
      const res = await getAllAccessoryTypeAPI();
      // setListAccessoryType(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllManufacturer();
    getAllAccessoryType();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
    // setQuantity(null);
    setPrice(null);
    // setManufacturer(null);
    setAccessoryType(null);
    setDescription(null);
  };

  const handleAddProduct = () => {
    if (!name || !price || !accessoryType || !selectedFile || !description) {
      setIsError(true);
    } else {
      setIsError(false);
      //const data = {
      //  name,
      //  quantity,
      //  price,
      //  manufacturer,
      //  accessoryType,
      //  productType: 2,
      //	image: selectedFile,
      //  description: [
      //    {
      //      type: 'Content',
      //      description: description || '',
      //    },
      //  ],
      //};
      const bodyFormData = new FormData();
      bodyFormData.append('name', name);
      // bodyFormData.append('quantity', quantity);
      bodyFormData.append('price', price);
      // bodyFormData.append('manufacturer', manufacturer);
      bodyFormData.append('accessoryType', accessoryType);
      bodyFormData.append('productType', 2);
      bodyFormData.append('image', selectedFile);
      bodyFormData.append('description', description);

      // CALL API add new product
      addNewProduct(bodyFormData);
    }
  };

  const handleUploadImage = (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        setImageUrl(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent sx={{ height: 650, width: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label="Product Name"
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
            {/* <TextField
              autoFocus
              id="quantity"
              label="Quantity"
              type="number"
              size="medium"
              sx={{ width: 500, mr: 2 }}
              onChange={(e) => setQuantity(e.target.value)}
              required
            /> */}
            <TextField
              id="price"
              label="Price"
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
            {/* <Autocomplete
              disablePortal
              id="manufacturer"
              options={listManufacturer}
              getOptionLabel={(option) => option?.name}
              sx={{ width: 500, mr: 2 }}
              onChange={(e, newValue) => {
                setManufacturer(newValue?.id);
              }}
              renderInput={(params) => <TextField {...params} label="Manufacturer" />}
            /> */}
            <Autocomplete
              disablePortal
              id="accessoryType"
              options={listAccessoryType}
              getOptionLabel={(option) => option?.name}
              fullWidth
              onChange={(e, newValue) => {
                setAccessoryType(newValue?.id);
              }}
              renderInput={(params) => <TextField {...params} label="Brand" />}
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
          <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
            Upload Image
            <input hidden accept="image/*" type="file" onChange={handleUploadImage} />
          </Button>
          {imageUrl && <img src={imageUrl} alt="ProductImage" />}
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
