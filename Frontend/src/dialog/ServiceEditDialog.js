import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { editProductAPI, getAllServiceTypeAPI } from '../components/services/index';

export default function ServiceEditDialog(props) {
  const { openDialog, setOpenDialog, getAllService, setContentToast, setSeverity, setOpenToast, service } = props;
  const [name, setName] = React.useState();
  const [price, setPrice] = React.useState();
  const [serviceType, setServiceType] = React.useState();
  const [isError, setIsError] = React.useState(false);

  const [description, setDescription] = React.useState();

  React.useEffect(() => {
    setName(service?.ServiceName);
    setPrice(parseInt(service?.Price || '0.00'));
    setDescription(service?.Description);
  }, [service, openDialog]);

  const editService = async (data, productId) => {
    try {
      const res = await editProductAPI(data, productId);
      console.log(res);
      if (res.status === 200) {
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllService();
      } else {
        setContentToast('Sửa dịch vụ thất bại');
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      setContentToast('Sửa dịch vụ thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditUser = () => {
    if (!name || !price || !serviceType) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        ServiceName: name,
        Price: price,
        Description: description,
      };

      editService(data, service?.id);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
        <DialogContent sx={{ height: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên dịch vụ"
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
              mt: 1,
            }}
          >
            <TextField
              autoFocus
              id="price"
              label="giá "
              type="number"
              size="medium"
              value={price}
              sx={{ width: 500, mr: 2 }}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            {/* <Autocomplete
              disablePortal
              id="serviceType"
              options={listServiceType}
              getOptionLabel={(option) => option?.name}
              sx={{ width: 500 }}
              onChange={(e, newValue) => {
                setServiceType(newValue);
              }}
              
              renderInput={(params) => <TextField {...params} label="Service Type" />}
            /> */}
          </Box>
          <TextField
            margin="dense"
            id="description"
            label="Mô tả"
            minRows={10}
            multiline
            fullWidth
            variant="outlined"
            value={description}
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
          <Button onClick={handleClose}>huỷ</Button>
          <Button onClick={handleEditUser} type="submit">
            Chỉnh sửa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
