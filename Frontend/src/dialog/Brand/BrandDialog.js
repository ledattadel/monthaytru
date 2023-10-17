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
  addNewBrandAPI,
} from 'src/components/services';

export default function BrandDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();

  const [isError, setIsError] = React.useState(false);

  const addNewProduct = async (data) => {
    try {
      const res = await addNewBrandAPI(data);
      if (res.status === 200) {
        setName(null);
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

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
  };

  const handleAddProduct = () => {
    if (!name) {
      setIsError(true);
    } else {
      setIsError(false);
      // CALL API add new product
      const data = {
        BrandName: name,
      };
      addNewProduct(data);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Tạo hãng mới</DialogTitle>
        <DialogContent sx={{ height: 150, width: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên hãng"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddProduct} type="submit">
            Tạo hãng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
