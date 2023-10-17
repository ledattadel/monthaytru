import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { patchUpdateCartAPI } from '../components/services/index';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function OrderEditDialog(props) {
  const { openDialog, setOpenDialog, getAllService, setContentToast, setSeverity, setOpenToast, order, employee } =
    props;
  const [carNumber, setCarNumber] = React.useState(order?.carNumber || '');
  const [expectedDate, setExpectedDate] = React.useState(new Date(order?.timeToDone));
  const [description, setDescription] = React.useState(order?.description || '');
  const [isError, setIsError] = React.useState(false);

  const editOrders = async (data, orderId) => {
    try {
      const res = await patchUpdateCartAPI({
        idCart: orderId,
        formData: data,
      });
      if (res.status === 200) {
        setCarNumber('');
        setDescription('');
        // setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllService();
      } else {
        setContentToast('Hệ thống đã cập nhật đơn hàng');
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      setContentToast('Cập nhật đơn hàng thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleEditUser = () => {
    if (!expectedDate && !description && !carNumber) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        approvalEmployee: employee.id,
        ...(expectedDate ? { timeToDone: expectedDate } : null),
        ...(description ? { description } : null),
        ...(carNumber ? { carNumber } : null),
      };
      editOrders(data, order?.id);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContent>
            <DialogContentText>Hãy nhập thời gian dự kiến xong đơn hàng</DialogContentText>
            <Box
              noValidate
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '20px',
              }}
            >
              <DatePicker
                label="Ngày nhận dự kiến"
                inputFormat="DD/MM/YYYY"
                value={expectedDate}
                minDate={new Date()}
                onChange={(newValue) => {
                  setExpectedDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
            <DialogContentText sx={{ mt: 5 }}>Hãy nhập biển số xe</DialogContentText>
            <Box
              noValidate
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '20px',
              }}
            >
              <TextField
                id="outlined-basic"
                label="Biển số xe"
                variant="outlined"
                value={carNumber}
                onChange={(event) => {
                  setCarNumber(event.target.value);
                }}
              />
            </Box>
            <DialogContentText sx={{ mt: 5 }}>Hãy mô tả những đặc điểm khi nhận xe</DialogContentText>
            <Box
              noValidate
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '20px',
              }}
            >
              {/* <DatePicker
                label="Return day"
								inputFormat="DD/MM/YYYY"
                value={returnDate}
                minDate={new Date()}
                sx={{
                  mt: '20px',
                }}
                onChange={(newValue) => {
                  setReturnDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              /> */}
              <TextField
                id="outlined-basic"
                label="Mô tả"
                variant="outlined"
                value={description}
                multiline
                rows={6}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </Box>
          </DialogContent>
          <p
            style={{
              margin: '10px',
              color: 'red',
              fontWeight: 'Bold',
              justifyContent: 'flex-end',
              display: isError ? 'flex' : 'none',
            }}
          >
            Please enter as least one information
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy bỏ</Button>
          <Button onClick={handleEditUser} type="submit">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
