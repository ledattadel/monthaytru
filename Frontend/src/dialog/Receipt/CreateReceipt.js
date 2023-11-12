import { Box, Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

import moment from 'moment';
import { addCarDesAPI, addNewReceiptAPI, getUserByPhoneAPI, getVehicleByNumberAPI } from 'src/components/services';
import AppToast from 'src/myTool/AppToast';
import { Vi } from 'src/_mock/Vi';

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
  const { openDialog, setOpenDialog, listCart, getAllCart } = props;

  const [additionPrice, setAdditionPrice] = useState(0);
  const [productAdd, setProductAdd] = useState([]);
  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cartId, setCartId] = useState(0);
  const [errors, setErrors] = useState('');
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
    vehicleNumber: '',
    vehicleType: '',
    vehicleColor: '',
    engineNumber: '',
    chassisNumber: '',
    brand: '',
  });
  const [vehicleCondition, setVehicleCondition] = useState('');
  const [noteVehicle, setNoteVehicle] = useState('');

  //
  const InfoAdmin = JSON.parse(localStorage.getItem('profileAdmin'));
  ///
  const addProduct = async () => {
    // const data = {
    //   idCartDes: cartId,
    //   productAdd,
    //   ...(additionPrice ? { additionPrice } : null),
    // };

    const data = {
      timeCreate: moment().format('DD-MM-yyyy hh:mm'),
      staffId: InfoAdmin?.userId,
      customerPhoneNumber: inforCustomerApi?.phoneNumber ?? inforCustomer?.phoneNumber,
      customerName: inforCustomerApi?.name ?? inforCustomer?.name,
      email: inforCustomerApi?.email ?? inforCustomer?.email,
      NumberPlateVehicle: inforVehicleApi.NumberPlate ?? inforVehicle?.vehicleNumber,
      TypeVehicle: inforVehicleApi?.Type ?? inforVehicle?.vehicleType,
      ColorVehicle: inforVehicleApi?.Color ?? inforVehicle?.vehicleColor,
      EngineNumberVehicle: inforVehicleApi?.EngineNumber ?? inforVehicle?.engineNumber,
      ChassisNumberVehicle: inforVehicleApi?.ChassisNumber ?? inforVehicle?.chassisNumber,
      BrandNameVehicle: inforVehicleApi?.brand?.BrandID ?? inforVehicle?.brand,
      VehicleStatus: vehicleCondition,
      Note: noteVehicle,
    };

    try {
      const res = await addNewReceiptAPI(data);
      let errorMessage = res.message || 'Tạo phiếu tiếp nhận thất bại';
      let successMessage = res.message || 'Tạo phiếu tiếp nhận thành công';
      if (res.status === 201) {
        setContentToastHere(successMessage);
        setSeverityHere('success');
        setProductAdd([]);
        setAdditionPrice(0);
        setOpenToastHere(true);
        setOpenDialog(false);
        getAllCart();
      } else {
        setContentToastHere(errorMessage);
        setOpenToastHere(true);
        setSeverityHere('error');
      }
    } catch (error) {
      setContentToastHere('Tạo phiếu tiếp nhận thất bại');
      setOpenToastHere(true);
      setSeverityHere('error');
    }
  };

  const getVehicleByNumber = async (number) => {
    try {
      const res = await getVehicleByNumberAPI(number);
      const temp = res?.data;
      if (temp?.VehicleID) {
        setInforVehicleApi(temp);
      } else {
        setInforVehicleApi({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // getAllUser();
    getVehicleByNumber(inforVehicle?.vehicleNumber);
  }, [inforVehicle?.vehicleNumber]);

  React.useEffect(() => {
    setCreateAt(moment().format('DD-MM-yyyy hh:mm'));
  }, []);
  const getUserByPhone = async (phone) => {
    try {
      const res = await getUserByPhoneAPI(phone);
      const temp = res?.data;
      if (temp?.CustomerID) {
        setInforCustomerApi(temp);
      } else {
        setInforCustomerApi({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // getAllUser();
    if (inforCustomer?.phoneNumber?.length === 10) {
      getUserByPhone(inforCustomer?.phoneNumber);
    } else {
      setInforCustomerApi({});
    }
  }, [inforCustomer?.phoneNumber]);

  React.useEffect(() => {
    setCreateAt(moment().format('DD-MM-yyyy hh:mm'));
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
    // if ((cartId && !productAdd.length && !additionPrice) || !cartId) {
    //   setIsError(true);
    // } else {
    setIsError(false);
    setErrorMsg('');
    addProduct();
    // }
  };

  const handleDataVehicle = (field, value) => {
    if (field === 'vehicleNumber' && !regexPlateNumber(value)) {
      setErrors('plateNumber');
      console.log('pon console', !regexPlateNumber(value));
    } else {
      setErrors('');
    }
    const tempDate = { ...inforVehicle, [field]: value };
    setInforVehicle(tempDate);
  };
  const handleDataCustomer = (field, value) => {
    if (field === 'phoneNumber') {
      if (!onlyNumber(value)) {
        if (value === '') {
          const tempDate = { ...inforCustomer, [field]: '' };
          setInforCustomer(tempDate);
        }
      } else if (value === '') {
        const tempDate = { ...inforCustomer, [field]: '' };
        setInforCustomer(tempDate);
      } else if (!regexPhoneNumber(value)) {
        setErrors('phoneNumber');
        const tempDate = { ...inforCustomer, [field]: value };
        setInforCustomer(tempDate);
      } else {
        const tempDate = { ...inforCustomer, [field]: value };
        setInforCustomer(tempDate);
        setErrors('');
      }
    } else {
      if (field === 'email' && !validateEmail(value)) {
        setErrors('email');
      } else if (field === 'phoneNumber' && !regexPhoneNumber(value)) {
        setErrors('phoneNumber');
      } else {
        setErrors('');
      }
      const tempDate = { ...inforCustomer, [field]: value };
      setInforCustomer(tempDate);
    }
  };

  const regexPhoneNumber = (phone) => {
    const regexPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/g;

    return phone.match(regexPhoneNumber) ? true : false;
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const regexPlateNumber = (value) => {
    const pattern = /^[0-9A-Z]{3}-\d{3}\.\d{2}$/;
    const licensePlate = '29A-123.456'; // Ví dụ biển số không hợp lệ
    let flat = false;
    console.log('pon console ne', pattern.test(value));
    if (pattern.test(value)) {
      flat = true;
    }
    return flat;
  };

  const onlyNumber = (value) => {
    const pattern = /^\d+$/;
    let flat = false;
    if (pattern.test(value)) {
      flat = true;
    }
    return flat;
  };
  return (
    <div style={{ width: '1500px' }}>
      <Dialog open={openDialog} onClose={handleClose} maxWidth={'1500px'}>
        {/* <DialogTitle>{Vi.addNewReceipt}</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{Vi.addNewReceipt}</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
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
            <Box>
              <TextField
                id="createAt"
                label={Vi.phoneCustomer}
                // type="Number"
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={false}
                value={inforCustomerApi?.phoneNumber ? inforCustomerApi?.phoneNumber : inforCustomer?.phoneNumber}
                onChange={(e) => handleDataCustomer('phoneNumber', e.target.value)}
                //   value={createAt}
                //   ={createAt}
                //   onChange={(e) => setCreateAt(e.target.value)}
                required
                size="small"
              />
              {errors === 'phoneNumber' ? (
                <Typography style={{ color: 'red' }}>Số điện thoại không hợp lệ</Typography>
              ) : null}
            </Box>
            <TextField
              id="price"
              label={Vi.nameCustomer}
              // type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={inforCustomerApi?.name ? true : false}
              //   value={price}
              value={inforCustomerApi?.name ? inforCustomerApi?.name : inforCustomer?.name}
              onChange={(e) => handleDataCustomer('name', e.target.value)}
              required
              size="small"
            />
            <Box>
              <TextField
                id="createName"
                label={Vi.emailCustomer}
                type="email"
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={inforCustomerApi?.email ? inforCustomerApi?.email : inforCustomer?.email}
                disabled={inforCustomerApi?.email ? true : false}
                onChange={(e) => handleDataCustomer('email', e.target.value)}
                required
                size="small"
              />
              {errors === 'email' ? <Typography style={{ color: 'red' }}>Email không hợp lệ</Typography> : null}
            </Box>
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
              // disabled={inforVehicleApi?.}
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
              disabled={inforVehicleApi?.brand?.BrandName ? true : false}
              value={inforVehicleApi?.brand?.BrandName ?? inforVehicle?.brand}
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
              disabled={inforVehicleApi?.Type ? true : false}
              value={inforVehicleApi?.Type ? inforVehicleApi?.Type : inforVehicle?.vehicleType}
              onChange={(e) => handleDataVehicle('vehicleType', e.target.value)}
              required
              size="small"
            />
          </Box>
          {errors === 'plateNumber' ? (
            <Typography style={{ color: 'red' }}>biển số xe không hợp lệ , Ví dụ : 29A-123.45</Typography>
          ) : null}
          <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <TextField
              id="vehicleColor"
              label={Vi.vehicleColor}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={inforVehicleApi.Color ? true : false}
              //   value={createAt}
              //   ={createAt}
              //   onChange={(e) => setCreateAt(e.target.value)}
              //   required
              value={inforVehicleApi.Color ? inforVehicleApi.Color : inforVehicle?.vehicleColor}
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
              disabled={inforVehicleApi?.ChassisNumber ? true : false}
              //   value={price}
              value={inforVehicleApi?.ChassisNumber ?? inforVehicle?.chassisNumber}
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
              disabled={inforVehicleApi?.EngineNumber ? true : false}
              value={inforVehicleApi?.EngineNumber ?? inforVehicle?.engineNumber}
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
            // disabled={inforCustomer?.email ? true : false}
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
            // disabled={inforCustomer?.email ? true : false}
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
          {/* <Button onClick={handleClose}>Huỷ</Button> */}
          <Button onClick={handleAddProduct} type="submit">
            Tạo phiếu tiếp nhận
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
