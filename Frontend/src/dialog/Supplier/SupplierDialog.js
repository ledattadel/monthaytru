import * as React from 'react';
import { Button, Box } from '@mui/material';
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
  // const [quantity, setQuantity] = React.useState();
  // const [price, setPrice] = React.useState();
  // const [manufacturer, setManufacturer] = React.useState();
  // const [accessoryType, setAccessoryType] = React.useState();
  // const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  // const [listManufacturer, setListManufacturer] = React.useState([]);
  // const [listAccessoryType, setListAccessoryType] = React.useState([]);
  const [selectedFile, setSelectedFile] = React.useState();
  const [imageUrl, setImageUrl] = React.useState();

  const addNewProduct = async (data) => {
    try {
      const res = await addNewSupplierAPI(data);
      if (res.status === 200) {
        setName(null);

        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllProduct();
      } else {
        setContentToast('Thêm nhà cung cấp thất bại');
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
    if (!name) {
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
      // bodyFormData.append('price', price);
      // bodyFormData.append('manufacturer', manufacturer);
      // bodyFormData.append('accessoryType', accessoryType);
      // bodyFormData.append('productType', 2);
      // bodyFormData.append('image', selectedFile);
      // bodyFormData.append('description', description);

      // CALL API add new product
      const data = {
        name: name,
      };
      addNewProduct(data);
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
        <DialogTitle>{Vi.addNewSupplier}</DialogTitle>
        <DialogContent sx={{ height: 150, width: 500 }}>
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

          {/* <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
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
          </p> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleAddProduct} type="submit">
            Tạo nhà cung cấp
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
