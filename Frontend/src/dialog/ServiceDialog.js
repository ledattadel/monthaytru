import { Box, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { addNewServiceAPI } from '../components/services/index';

export default function ServiceDialog(props) {
  const { openDialog, setOpenDialog, getAllService, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();
  const [price, setPrice] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);

  const addNewService = async (data) => {
    try {
      const res = await addNewServiceAPI(data);

      let errorMessage = res.message || 'Thêm dịch vụ thất bại';
      let successMessage = res.message || 'Thêm dịch vụ thành công';

      if (res.status === 201) {
        setName(null);
        setPrice(null);

        setDescription(null);
        setContentToast(successMessage);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllService();
      } else {
        setContentToast(errorMessage);
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      setContentToast('Thêm dịch vụ thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
    setPrice(null);

    setDescription(null);
  };

  const handleAddUser = () => {
    if (!name || !price || !description) {
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
      // const bodyFormData = new FormData();
      // bodyFormData.append('name', name);
      // bodyFormData.append('quantity', 99999);
      // bodyFormData.append('price', price);
      // bodyFormData.append('serviceType', serviceType?.id);
      // bodyFormData.append('productType', 1);
      // bodyFormData.append('image', selectedFile);
      // bodyFormData.append('description', description);
      const data = {
        ServiceName: name,
        Description: description,
        Price: price,
        // brand:
      };
      addNewService(data);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        {/* <DialogTitle>Tạo mới dịch vụ</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>Tạo mới dịch vụ</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
        <DialogContent sx={{ height: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên dịch vụ"
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
            Vui lòng nhập đủ thông tin
          </p>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Huỷ</Button> */}
          <Button onClick={handleAddUser} type="submit">
            Tạo dịch vụ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
