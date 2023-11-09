import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';

import { addNewBrandAPI, addNewVehicleStatusAPI } from 'src/components/services';

export default function RepairItemDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();

  const [isError, setIsError] = React.useState(false);

  const addNewProduct = async (data) => {
    try {
      const res = await addNewVehicleStatusAPI(data);
      let errorMessage = res.message || 'Thêm danh mục sửa chửa thất bại';
      let successMessage = res.message || 'Thêm danh mục sửa chửa thành công';

      if (res.status === 201) {
        setName(null);
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
      setContentToast('Thêm danh mục sửa chửa thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
  };

  const handleAddProduct = () => {
    if (!name?.trim()) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        name: name,
      };
      addNewProduct(data);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Tạo Hạng mục sửa chửa mới</DialogTitle>
        <DialogContent sx={{ height: 150, width: 500 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên hạng mục sửa chửa"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>huỷ</Button>
          <Button onClick={handleAddProduct} type="submit">
            Tạo Hạng mục sửa chửa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
