import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { getAllServiceTypeAPI, addNewProductAPI } from '../components/services/index';

export default function ServiceDialog(props) {
  const { openDialog, setOpenDialog, getAllService, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();
  const [price, setPrice] = React.useState();
  const [serviceType, setServiceType] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [listServiceType, setListServiceType] = React.useState();
  const [selectedFile, setSelectedFile] = React.useState();
  const [imageUrl, setImageUrl] = React.useState();

  const addNewService = async (data) => {
    try {
      const res = await addNewProductAPI(data);
      if (res.status === 200) {
        setName(null);
        setPrice(null);
        setServiceType(null);
        setDescription(null);
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllService();
      } else {
        setContentToast('Thêm dịch vụ thất bại');
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      setContentToast('Thêm dịch vụ thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const getAllServiceType = async () => {
    try {
      const res = await getAllServiceTypeAPI();
      setListServiceType(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllServiceType();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
    setPrice(null);
    setServiceType(null);
    setDescription(null);
  };

  const handleAddUser = () => {
    if (!name || !price || !serviceType || !selectedFile || !description) {
      setIsError(true);
    } else {
      setIsError(false);
      //const data = {
      //  name,
      //  price,
      //	productType: 1,
      //	quantity: 99999,
      //  serviceType: serviceType?.id,
      //  description: [
      //    {
      //      type: 'Content',
      //      content: description,
      //    },
      //  ],
      //};
      const bodyFormData = new FormData();
      bodyFormData.append('name', name);
      bodyFormData.append('quantity', 99999);
      bodyFormData.append('price', price);
      bodyFormData.append('serviceType', serviceType?.id);
      bodyFormData.append('productType', 1);
      bodyFormData.append('image', selectedFile);
      bodyFormData.append('description', description);

      addNewService(bodyFormData);
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
        <DialogTitle>Tạo mới sản phẩm</DialogTitle>
        <DialogContent sx={{ height: 500 }}>
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
              mt: 1,
            }}
          >
            <TextField
              autoFocus
              id="price"
              label="Giá"
              type="number"
              size="medium"
              sx={{ width: 500, mr: 2 }}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Box>
          <TextField
            margin="dense"
            id="description"
            label="Mô tả"
            minRows={10}
            multiline
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
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
          <Button onClick={handleAddUser} type="submit">
            Add Service
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
