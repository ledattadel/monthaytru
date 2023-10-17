import { Box, Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

import moment from 'moment';
import { addCarDesAPI } from 'src/components/services';
import AppToast from 'src/myTool/AppToast';
import { Vi } from 'src/_mock/Vi';
import Autocomplete from '@mui/material/Autocomplete';
import formatMoneyWithDot from 'src/utils/formatMoney';

const ENUM_PRODUCT_TYPE = [
  {
    lable: 'Dịch vụ',
    name: 'Dịch vụ',
  },
  {
    lable: 'Sản phẩm',
    name: 'Sản phẩm',
  },
];

const mockData = [
  {
    id: 1,
    name: 'lốp xe',
    brand: 'suzuki',
    costPrice: '1000000',
    quantity: 4,
    totalPrice: '4000000',
  },
  {
    id: 2,
    name: 'kính xe',
    brand: 'suzuki',
    costPrice: '4000000',
    quantity: 2,
    totalPrice: '8000000',
  },
];

function formatDate(str) {
  const date = str.split('T');
  const day = date[0].split('-');
  return `${day[2]}/${day[1]}/${day[0]}`;
}

export default function ImportProductDialog(props) {
  const { openDialog, setOpenDialog, listCart } = props;

  const [additionPrice, setAdditionPrice] = useState(0);
  const [productAdd, setProductAdd] = useState([]);
  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cartId, setCartId] = useState(0);

  /// services/product

  const [listServcies, setListServices] = useState([]);
  const [serviceChoose, setServiceChoose] = useState();
  const [type, setType] = useState(ENUM_PRODUCT_TYPE?.[0]?.name);

  const [listProduct, setListProduct] = useState([]);
  const [productChoose, setProductChoose] = useState();
  const [listBrand, setListBrand] = useState([]);
  const [brandChoose, setBrandChoose] = useState();
  const [listSupplier, setSupplier] = useState([]);
  const [supplierChoose, setSupplierChoose] = useState();
  ///
  const [createAt, setCreateAt] = useState();

  const [inforCustomer, setInforCustomer] = useState({
    name: '',
    phoneNumber: '',
    email: '',
  });

  const [inforVehicle, setInforVehicle] = useState({
    numberPlate: '',
    type: '',
    color: '',
    engineNumber: '',
    chassisNumber: '',
    brand: '',
  });

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

  const renderItemProduct = (item, index) => {
    return (
      <Box>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            //   justifyContent: 'space-between',
            // backgroundColor: 'cyan',
            width: 950,
          }}
        >
          <Box style={{ display: 'flex', padding: 4, width: 60, justifyContent: 'space-between' }}>
            <Typography style={{ width: 50, textAlign: 'center' }}>{index + 1}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', width: 106, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.id}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 168, justifyContent: 'space-between' }}>
            <Typography style={{ width: 130, textAlign: 'center' }}>{item?.name}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 146, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.brand}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 140, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{formatMoneyWithDot(item.costPrice)}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 100, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item.quantity}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 156, justifyContent: 'space-between' }}>
            <Typography style={{ width: 140, textAlign: 'center' }}>{formatMoneyWithDot(item.totalPrice)}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Button style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>X</Typography>
            {/* <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} /> */}
          </Button>

          {/* <Box>
          <Typography>{Vi.productId}</Typography>
        </Box> */}
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray', width: 950 }} />
      </Box>
    );
  };

  const renderTitleProduct = () => {
    return (
      <Box style={{ width: 950 }}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            //   justifyContent: 'space-between',
            backgroundColor: 'cyan',
          }}
        >
          <Box style={{ display: 'flex', padding: 4, width: 60 }}>
            <Typography style={{ width: 50 }}>STT</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', width: 140 }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{Vi.productId}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 140 }}>
            <Typography style={{ width: 120, textAlign: 'start' }}>{Vi.nameProduct}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 140, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{Vi.brand}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 140, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{Vi.costPrice}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 100 }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{Vi.quantity}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 180 }}>
            <Typography style={{ width: 140, textAlign: 'center' }}>{Vi.totalPrice}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 40 }}>
            <Typography style={{ width: 100, textAlign: 'center' }}></Typography>
            {/* <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} /> */}
          </Box>

          {/* <Box>
      <Typography>{Vi.productId}</Typography>
    </Box> */}
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray' }} />
      </Box>
    );
  };

  return (
    <div style={{ width: '1500px' }}>
      <Dialog open={openDialog} onClose={handleClose} maxWidth={'1500px'}>
        <DialogTitle>{Vi.addNewImportProduct}</DialogTitle>
        <DialogContent sx={{ height: 650, width: 1000 }}>
          <Box style={{ borderWidth: 1, borderColor: 'grey' }}>
            <Typography style={{ fontSize: 14, marginTop: 8, marginBottom: 12 }}>{Vi.inforImportProduct}</Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                id="quoteId"
                label={Vi.quoteId}
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
                label={Vi.createAt}
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
              {/* <TextField
                id="receiptId"
                label={Vi.supplier}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                // disabled={true}
                //   value={price}
                //   onChange={(e) => setPrice(e.target.value)}
                size="small"
                required
              /> */}
              <Autocomplete
                disablePortal
                id="supplier"
                options={listSupplier}
                getOptionLabel={(option) => option?.name}
                sx={{ width: 200, mr: 2 }}
                onChange={(e, newValue) => {
                  setSupplierChoose(newValue?.id);
                }}
                size="small"
                // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
                renderInput={(params) => <TextField {...params} label={Vi.supplier} />}
              />
            </Box>
          </Box>

          <Typography style={{ fontSize: 14, marginTop: 24, marginBottom: 12 }}>{Vi.addProductService}</Typography>
          <Box style={{ display: 'flex' }}>
            {/* <Autocomplete
              disablePortal
              //   id="manufacturer"
              options={ENUM_PRODUCT_TYPE}
              getOptionLabel={(option) => option?.name}
              sx={{ width: 200, mr: 2 }}
              onChange={(e, newValue) => {
                setType(newValue?.name);
              }}
              size="small"
              defaultValue={ENUM_PRODUCT_TYPE?.[0]}
              renderInput={(params) => <TextField {...params} />}
            /> */}
            <Autocomplete
              disablePortal
              id="nameService"
              options={type === ENUM_PRODUCT_TYPE?.[0]?.name ? listServcies : listProduct}
              getOptionLabel={(option) => option?.name}
              sx={{ width: 200, mr: 2 }}
              onChange={(e, newValue) => {
                type === ENUM_PRODUCT_TYPE?.[0]?.name ? setServiceChoose(newValue?.id) : setProductChoose(newValue?.id);
              }}
              size="small"
              defaultValue={ENUM_PRODUCT_TYPE?.[0]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={type === ENUM_PRODUCT_TYPE?.[0]?.name ? Vi.nameService : Vi.nameProduct}
                />
              )}
            />

            <Autocomplete
              disablePortal
              id="brand"
              options={listBrand}
              getOptionLabel={(option) => option?.name}
              sx={{ width: 200, mr: 2 }}
              onChange={(e, newValue) => {
                setBrandChoose(newValue?.id);
              }}
              size="small"
              // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
              renderInput={(params) => <TextField {...params} label={Vi.brand} />}
            />

            <TextField
              id="quantity"
              label={Vi.quantity}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              //   disabled={true}
              //   value={createAt}
              //   ={createAt}
              //   onChange={(e) => setCreateAt(e.target.value)}
              required
              value={inforVehicle?.vehicleNumber}
              size="small"
              style={{ width: 100 }}
              onChange={(e) => handleDataVehicle('vehicleNumber', e.target.value)}
            />
            <TextField
              id="costPrice"
              label={Vi.costPrice}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              //   disabled={true}
              //   value={createAt}
              //   ={createAt}
              //   onChange={(e) => setCreateAt(e.target.value)}
              required
              value={inforVehicle?.vehicleNumber}
              size="small"
              style={{ width: 100 }}
              onChange={(e) => handleDataVehicle('vehicleNumber', e.target.value)}
            />

            <Button variant="outlined" onClick={handleAddProduct} size="small" type="submit">
              {Vi.add}
            </Button>
          </Box>
          <Box mt={2}>
            <Typography style={{ fontSize: 18, marginBottom: 12, fontWeight: 600 }}> {Vi.product}:</Typography>
          </Box>
          {renderTitleProduct()}
          {mockData?.map((e, index) => renderItemProduct(e, index))}
        </DialogContent>
        {/* <p
          style={{
            margin: '10px',
            color: 'red',
            fontWeight: 'Bold',
            justifyContent: 'flex-end',
            display: isError ? 'flex' : 'none',
          }}
        >
          Please enter full information {errorMsg}
        </p> */}
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {Vi.Cancel}
          </Button>
          <Button variant="outlined" onClick={handleAddProduct} type="submit">
            {Vi.save}
          </Button>
          <Button variant="outlined" onClick={handleAddProduct} type="submit">
            {Vi.reset}
          </Button>
          <Button variant="outlined" onClick={handleAddProduct} type="submit">
            {Vi.next}
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
