import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addNewSaleAPI } from '../components/services/index';

export default function SaleDialog(props) {
  const { openDialog, setOpenDialog, getAllSale, setContentToast, setSeverity, setOpenToast } = props;
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());

  const addNewSale = async (data) => {
    try {
      const res = await addNewSaleAPI(data);
      if (res.status === 200) {
				console.log('res', res)
        setDescription(null);
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllSale();
      }
			// else {
      //  setContentToast('Thêm dịch vụ thất bại');
      //  setOpenToast(true);
      //  setSeverity('error');
      //}
    } catch (error) {
			console.log('error', error)
      setContentToast('Thêm dịch vụ thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setDescription(null);
  };

  const handleAddSale = () => {
    if (!description || !startTime || !endTime) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
       startTime,
			 endTime,
			 description
      };
			console.log('data', data);

      addNewSale(data);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Sale</DialogTitle>
        <DialogContent sx={{ height: 300 }}>
          <TextField
            margin="dense"
            id="name"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
						value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <DatePicker
            label="Start day"
            value={startTime}
						minDate={new Date()}
            onChange={(newValue) => {
              setStartTime(newValue);
            }}
            renderInput={(params) => <TextField {...params} fullWidth sx={{mt: 4}}/>}
          />
          <DatePicker
            label="End day"
            value={endTime}
						minDate={new Date()}
            sx={{ width: 500 }}
            onChange={(newValue) => {
              setEndTime(newValue);
            }}
            renderInput={(params) => <TextField {...params} fullWidth sx={{mt: 4}}/>}
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
          <Button onClick={handleAddSale} type="submit">
            Add Sale
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
