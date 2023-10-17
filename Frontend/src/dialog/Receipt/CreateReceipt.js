import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Vi } from 'src/_mock/Vi';
import AppToast from 'src/myTool/AppToast';
import formatMoneyWithDot from 'src/utils/formatMoney';
import {
  getAllServicesAPI,
  addCarDesAPI,
  getAllProductAndServiceAPI,
  getCartDescriptionAPI,
} from 'src/components/services';
import moment from 'moment';

const ENUM_PRODUCT_TYPE = {
  PHU_KIEN: 'Phụ kiện',
  DICH_VU: 'Dịch vụ',
};

function formatDate(str) {
  const date = str.split('T');
  const day = date[0].split('-');
  return `${day[2]}/${day[1]}/${day[0]}`;
}

export default function CreateReceipt(props) {
  const { openDialog, setOpenDialog, listCart } = props;

  const [additionPrice, setAdditionPrice] = useState(0);
  const [productAdd, setProductAdd] = useState([]);
  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cartId, setCartId] = useState(0);
  ///
  const [createAt, setCreateAt] = useState();
  const [inforCustomerApi, setInforCustomerApi] = useState({});
  const [inforCustomer, setInforCustomer] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });
  const [inforVehicleApi, setInforVehicleApi] = useState({});
  const [inforVehicle, setInforVehicle] = useState({
    numberPlate: '',
    type: '',
    color: '',
    engineNumber: '',
    chassisNumber: '',
    brand: '',
  });
  const [vehicleCondition, setVehicleCondition] = useState('');
  const [noteVehicle, setNoteVehicle] = useState('');
  ///
  const addProduct = async () => {
    const data = {
      idCartDes: cartId,
      productAdd,
      ...(additionPrice ? { additionPrice } : null),
    };

    try {
      const res = await addCarDesAPI(data);
      if (res.status === 200) {
        setContentToastHere(res?.data);
        setSeverityHere('success');
        setProductAdd([]);

        setAdditionPrice(0);
        setOpenToastHere(true);
        setOpenDialog(false);
      } else {
        setContentToastHere('Thêm sản phẩm add thất bại');
        setOpenToastHere(true);
        setSeverityHere('error');
      }
    } catch (error) {
      setContentToastHere('Thêm sản phẩm add thất bại');
      setOpenToastHere(true);
      setSeverityHere('error');
    }
  };

  React.useEffect(() => {
    setCreateAt(moment().format('DD-MM-yyyy'));
  }, []);

  const handleClose = () => {
    setCartId(null);
    setProductAdd([]);

    setIsError(false);
    setErrorMsg('');
    setAdditionPrice(0);
    setOpenDialog(false);
  };

  const handleAddProduct = () => {
    if ((cartId && !productAdd.length && !additionPrice) || !cartId) {
      setIsError(true);
    } else {
      setIsError(false);
      setErrorMsg('');
      addProduct();
    }
  };

  const handleDataVehicle = (field, value) => {
    const tempDate = { ...inforVehicle, field: value };
    setInforVehicle(tempDate);
  };
  const handleDataCustomer = (field, value) => {
    const tempDate = { ...inforCustomer, field: value };
    setInforCustomer(tempDate);
  };

  return (
    <div style={{ width: '1500px' }}>
      <Dialog open={openDialog} onClose={handleClose} maxWidth={'1500px'}>
        <DialogTitle>{Vi.addNewReceipt}</DialogTitle>
        <DialogContent sx={{ height: 650, width: 800 }}>
          <Box style={{ borderWidth: 1, borderColor: 'grey' }}>
            <Typography style={{ fontSize: 14, marginTop: 8, marginBottom: 12 }}>{Vi.receipt}</Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                id="receiptId"
                label={Vi.receiptId}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                //   value={price}
                //   onChange={(e) => setPrice(e.target.value)}
                size="small"
                required
              />
              <TextField
                id="createAt"
                label={Vi.createAtReceipt}
                //   type="Number"
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                value={createAt}
                size="small"
                //   ={createAt}
                //   onChange={(e) => setCreateAt(e.target.value)}
                //   required
              />
              <TextField
                id="createName"
                label={Vi.createName}
                //   type="Number"
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                value={'Pôn'}
                size="small"
                //   onChange={(e) => handleDataCustomer(e.target.value)}
                required
              />
            </Box>
          </Box>
          <Typography style={{ fontSize: 14, marginTop: 12, marginBottom: 12 }}>{Vi.customer}</Typography>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              id="createAt"
              label={Vi.phoneCustomer}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={false}
              value={inforCustomer?.phoneNumber}
              onChange={(e) => handleDataCustomer('phonerNumber', e.target.value)}
              //   value={createAt}
              //   ={createAt}
              //   onChange={(e) => setCreateAt(e.target.value)}
              required
              size="small"
            />
            <TextField
              id="price"
              label={Vi.nameCustomer}
              type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={inforCustomerApi?.name ? true : false}
              //   value={price}
              value={inforCustomer?.name}
              onChange={(e) => handleDataCustomer('name', e.target.value)}
              required
              size="small"
            />

            <TextField
              id="createName"
              label={Vi.emailCustomer}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={inforCustomer?.email}
              disabled={inforCustomerApi?.email ? true : false}
              onChange={(e) => handleDataCustomer('email', e.target.value)}
              required
              size="small"
            />
          </Box>
          <Typography style={{ fontSize: 14, marginTop: 12, marginBottom: 12 }}>{Vi.vehicleInformation}</Typography>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              id="createAt"
              label={Vi.vehicleNumber}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={false}
              //   value={createAt}
              //   ={createAt}
              //   onChange={(e) => setCreateAt(e.target.value)}
              required
              value={inforVehicle?.vehicleNumber}
              size="small"
              onChange={(e) => handleDataVehicle('vehicleNumber', e.target.value)}
            />
            <TextField
              id="brand"
              label={Vi.brand}
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={inforCustomer?.name ? true : false}
              value={inforVehicle?.brand}
              onChange={(e) => handleDataVehicle('brand', e.target.value)}
              required
              size="small"
            />

            <TextField
              id="vehicleType"
              label={Vi.vehicleType}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={inforCustomer?.email ? true : false}
              value={inforVehicle?.vehicleType}
              onChange={(e) => handleDataVehicle('vehicleType', e.target.value)}
              required
              size="small"
            />
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <TextField
              id="vehicleColor"
              label={Vi.vehicleColor}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={false}
              //   value={createAt}
              //   ={createAt}
              //   onChange={(e) => setCreateAt(e.target.value)}
              //   required
              value={inforVehicle?.vehicleColor}
              onChange={(e) => handleDataVehicle('vehicleColor', e.target.value)}
              size="small"
            />
            <TextField
              id="chassisNumber"
              label={Vi.chassisNumber}
              type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={inforCustomer?.name ? true : false}
              //   value={price}
              value={inforVehicle?.chassisNumber}
              onChange={(e) => handleDataVehicle('chassisNumber', e.target.value)}
              required
              size="small"
            />

            <TextField
              id="engineNumber"
              label={Vi.engineNumber}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={inforCustomer?.email ? true : false}
              value={inforVehicle?.engineNumber}
              onChange={(e) => handleDataVehicle('engineNumber', e.target.value)}
              required
              size="small"
            />
          </Box>
          <TextField
            id="vehicleCondition"
            label={Vi.vehicleCondition}
            //   type="Number"
            sx={{ mr: 2, mt: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            disabled={inforCustomer?.email ? true : false}
            value={vehicleCondition}
            onChange={(e) => setVehicleCondition(e.target.value)}
            required
            multiline
            minRows={3}
            size="small"
          />
          <TextField
            id="noteVehicle"
            label={Vi.noteVehicle}
            //   type="Number"
            sx={{ mr: 2, mt: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            minRows={3}
            fullWidth
            height
            disabled={inforCustomer?.email ? true : false}
            value={noteVehicle}
            onChange={(e) => setNoteVehicle(e.target.value)}
            // required
            size="small"
          />
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
          Please enter full information {errorMsg}
        </p>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddProduct} type="submit">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
      <AppToast
        content={contentToastHere}
        type={0}
        isOpen={openToastHere}
        severity={severityHere}
        callback={() => {
          setOpenToastHere(false);
        }}
      />
    </div>
  );
}
