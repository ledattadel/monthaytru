import { Box, Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useEffect, useRef, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import moment from 'moment';
import {
  addCarDesAPI,
  getAllProductDetailAPI,
  getAllServiceAPI,
  getAllStaffAPI,
  getVehicleByNumberAPI,
} from 'src/components/services';
import AppToast from 'src/myTool/AppToast';
import { Vi } from 'src/_mock/Vi';
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
    price: '1000000',
    quantity: 4,
    totalPrice: '4000000',
  },
  {
    id: 2,
    name: 'kính xe',
    brand: 'suzuki',
    price: '4000000',
    quantity: 2,
    totalPrice: '8000000',
  },
];
const mockDataService = [
  {
    id: 1,
    name: 'Thay lốp',
    // brand: 'suzuki',
    price: '1000000',
    quantity: 4,
    totalPrice: '4000000',
  },
  {
    id: 2,
    name: 'Thay kính xe',
    brand: 'suzuki',
    price: '2000000',
    quantity: 1,
    totalPrice: '8000000',
  },
];

const data = [
  {
    name: '',
  },
];

function formatDate(str) {
  const date = str.split('T');
  const day = date[0].split('-');
  return `${day[2]}/${day[1]}/${day[0]}`;
}

export default function CreateQuote(props) {
  const { openDialog, setOpenDialog, receiptChoose } = props;

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

  const [staffChoose, setStaffChoose] = useState({
    staffName: '',
  });
  const [listStaff, setListStaff] = useState([]);
  const [type, setType] = useState(ENUM_PRODUCT_TYPE?.[0]?.name);
  const refAutoStaff = useRef();
  const [listProduct, setListProduct] = useState([]);

  const [isClear, setIsClear] = useState(true);
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
  const [inforVehicleApi, setInforVehicleApi] = useState();

  /// state list services / product

  const [listServiceAdd, setListServiceAdd] = useState([]);
  const [listProductAdd, setListProductAdd] = useState([]);

  const [productChoose, setProductChoose] = useState({
    quantity: 0,
  });
  const [serviceChoose, setServiceChoose] = useState({
    staff: {},
  });

  //// useEffect

  useEffect(() => {
    getAllProduct();
    getAllService();
  }, []);
  React.useEffect(() => {
    setCreateAt(moment().format('DD-MM-yyyy hh:mm'));
    getAllStaff();
  }, []);
  React.useEffect(() => {
    // getAllUser();
    getVehicleByNumber(inforVehicle?.vehicleNumber);
  }, [inforVehicle?.vehicleNumber]);

  useEffect(() => {
    if (receiptChoose?.ReceiptID) {
      handleDataCustomer('phoneNumber', receiptChoose?.customer?.phoneNumber);
      handleDataCustomer('name', receiptChoose?.customer?.name);
      handleDataVehicle('vehicleNumber', receiptChoose?.vehicle?.NumberPlate);
    }
  }, [receiptChoose, openDialog]);

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

  /// function

  const getAllService = async () => {
    try {
      const res = await getAllServiceAPI();
      const temp = res?.data;
      setListServices(temp);
      console.log('pon console temp', temp);
    } catch (error) {
      console.log(error);
    }
  };
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

  const getAllStaff = async () => {
    try {
      const res = await getAllStaffAPI();
      setListStaff(res?.data);
    } catch (error) {}
  };

  const getAllProduct = async () => {
    try {
      const res = await getAllProductDetailAPI();
      if (res?.data) {
        setListProduct(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setCartId(null);
    setProductAdd([]);
    setListProductAdd([]);
    setListServiceAdd([]);

    setIsError(false);
    setErrorMsg('');
    setAdditionPrice(0);
    setOpenDialog(false);
    setType(ENUM_PRODUCT_TYPE?.[0]?.name);
  };

  const handleAddProduct = () => {
    // setStaffChoose({ staffName: '' });
    // );
    // console.log('pon console', refAutoStaff?.current()?.clear());
  };
  const handleAddProductToList = () => {
    const flat = listProductAdd?.filter((e) => e?.ProductDetailID === productChoose?.ProductDetailID);
    if (!productChoose?.quantity) {
      setContentToastHere('số luợng phải lớn hơn 0');
      setOpenToastHere(true);
      setSeverityHere('error');
    } else if (!productChoose?.ProductDetailID) {
      setContentToastHere('vui lòng chọn sản phẩm ');
      setOpenToastHere(true);
      setSeverityHere('error');
    } else if (flat?.length > 0) {
      const tempData = listProductAdd?.filter((e) => e?.ProductDetailID !== productChoose?.ProductDetailID);
      const data = { ...flat?.[0], quantity: flat?.[0]?.quantity * 1 + productChoose?.quantity * 1 };

      const product = [...tempData, data]?.sort((a, b) => a.index - b.index);

      setListProductAdd(product);
      setIsClear(true);
      setProductChoose({
        quantity: 0,
      });
    } else {
      const product = [...listProductAdd];
      product.push({
        ...productChoose,
        index: listProductAdd?.length > 0 ? listProductAdd?.[listProductAdd?.length - 1]?.index + 1 : 1,
      });
      setListProductAdd(product);
      setIsClear(true);
      setProductChoose({
        quantity: 0,
      });
    }
  };

  const handleAddServiceToList = () => {
    const service = [...listServiceAdd];
    service.push({
      ...productChoose,
    });
    setListServiceAdd(service);
    setIsClear(true);
    setServiceChoose({
      staff: {},
    });
  };

  const removeProductAdd = (ProductDetailID) => {
    const listTemp = [...listProductAdd];
    const listNewProduct = listTemp?.filter((e) => e?.ProductDetailID !== ProductDetailID);

    setListProductAdd(listNewProduct);
  };

  const handleChooseProduct = (field, value) => {
    const temp = { ...productChoose, [field]: value };
    setProductChoose(temp);
  };
  const handleChooseNameProduct = (value) => {
    const temp = { ...productChoose, ...value };
    setProductChoose(temp);
  };

  const handleChooseServce = (value) => {
    const temp = { ...productChoose, value };
    setServiceChoose(temp);
  };
  const handleChooseStaffToServce = (value) => {
    const temp = { ...productChoose, staff: value };
    setServiceChoose(temp);
  };

  const handleDataVehicle = (field, value) => {
    const tempDate = { ...inforVehicle, [field]: value };
    setInforVehicle(tempDate);
  };
  const handleDataCustomer = (field, value) => {
    const tempDate = { ...inforCustomer, [field]: value };
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
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.ProductDetailID}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 168, justifyContent: 'space-between' }}>
            <Typography style={{ width: 130, textAlign: 'center' }}>{item?.product?.ProductName}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 146, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.product?.brand?.BrandName}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 140, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>
              {formatMoneyWithDot(parseInt(item.SellingPrice || '0.0'))}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 100, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item.quantity}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 156, justifyContent: 'space-between' }}>
            <Typography style={{ width: 140, textAlign: 'center' }}>
              {formatMoneyWithDot(parseInt(item.SellingPrice || '0.0') * item.quantity)}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Button
            onClick={() => removeProductAdd(item?.ProductDetailID)}
            style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}
          >
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
  const renderItemService = (item, index) => {
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
          <Box style={{ display: 'flex', padding: 4, width: 268, justifyContent: 'space-between' }}>
            <Typography style={{ width: 230, textAlign: 'center' }}>{item?.name}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          {/* <Box style={{ display: 'flex', padding: 4, width: 146, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.brand}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box> */}
          <Box style={{ display: 'flex', padding: 4, width: 248, justifyContent: 'space-between' }}>
            <Typography style={{ width: 210, textAlign: 'center' }}>{item.price}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 200, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item.quantity}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          {/* <Box style={{ display: 'flex', padding: 4, width: 156, justifyContent: 'space-between' }}>
            <Typography style={{ width: 140, textAlign: 'center' }}>{item.totalPrice}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box> */}
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

  const renderTitleServices = () => {
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
            <Typography style={{ width: 100, textAlign: 'center' }}>{Vi.servicesId}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', width: 240 }}>
            <Typography style={{ width: 220, textAlign: 'center' }}>{Vi.nameService}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          {/* <Box style={{ display: 'flex', padding: 4, width: 140, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{Vi.brand}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box> */}
          <Box style={{ display: 'flex', padding: 4, width: 240, justifyContent: 'space-between' }}>
            <Typography style={{ width: 240, textAlign: 'center' }}>{Vi.price}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 200 }}>
            <Typography style={{ width: 200, textAlign: 'center' }}>Nhân viên kỉ thuật</Typography>
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
            <Typography style={{ width: 100, textAlign: 'center' }}>{Vi.price}</Typography>
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
        <DialogTitle>{Vi.quote}</DialogTitle>
        <DialogContent sx={{ height: 650, width: 1000 }}>
          <Box style={{ borderWidth: 1, borderColor: 'grey' }}>
            <Typography style={{ fontSize: 14, marginTop: 8, marginBottom: 12 }}>{Vi.inforQuote}</Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                id="receiptId"
                label={Vi.receiptId}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                value={receiptChoose?.ReceiptID}
                //   value={price}
                //   onChange={(e) => setPrice(e.target.value)}
                size="small"
                required
              />
              <TextField
                id="quoteId"
                label={Vi.quoteId}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={'Hệ thống tự sinh'}
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
            </Box>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <TextField
              id="nameCustomer"
              label={Vi.nameCustomer}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={true}
              //   value={price}
              value={inforCustomer?.name}
              onChange={(e) => handleDataCustomer('name', e.target.value)}
              required
              size="small"
            />
            <TextField
              id="vehicleNumber"
              label={Vi.vehicleNumber}
              //   type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={true}
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
              disabled={true}
              value={inforVehicleApi?.brand?.BrandName}
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
              disabled={true}
              value={inforVehicleApi?.Type}
              onChange={(e) => handleDataVehicle('vehicleType', e.target.value)}
              required
              size="small"
            />
          </Box>
          <Typography style={{ fontSize: 14, marginTop: 24, marginBottom: 12 }}>{Vi.addProductService}</Typography>
          <Box style={{ display: 'flex' }}>
            <Autocomplete
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
            />
            {type === ENUM_PRODUCT_TYPE?.[0]?.name ? (
              <Autocomplete
                disablePortal
                id="nameService"
                options={listServcies}
                getOptionLabel={(option) => option?.ServiceName}
                sx={{ width: 400, mr: 2 }}
                onChange={(e, newValue) => {
                  handleChooseServce(newValue);
                }}
                size="small"
                // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
                renderInput={(params) => <TextField {...params} label={Vi.nameService} />}
              />
            ) : (
              <Autocomplete
                disablePortal
                id="option?.ServiceName"
                options={listProduct}
                getOptionLabel={(option) =>
                  `${option?.product?.ProductName} - ${option?.product?.brand?.BrandName} - ${option?.supplier?.name}`
                }
                sx={{ width: 500, mr: 2 }}
                onChange={(e, newValue) => {
                  handleChooseNameProduct(newValue);
                  setIsClear(false);
                }}
                size="small"
                key={productChoose?.product?.ProductName}
                value={isClear ? null : productChoose}
                // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
                renderInput={(params) => <TextField {...params} label={Vi.nameProduct} />}
              />
            )}

            {type === ENUM_PRODUCT_TYPE?.[0]?.name ? (
              <Autocomplete
                disablePortal
                id="staff"
                options={listStaff}
                getOptionLabel={(option) => option?.name}
                sx={{ width: 200, mr: 2 }}
                onChange={(e, newValue) => {
                  handleChooseStaffToServce(newValue);
                  // staffChoose(newValue);
                  setIsClear(false);
                }}
                key={serviceChoose?.staff}
                // ref={refAutoStaff}
                // clearOnEscape=true
                // value={staffChoose}
                size="small"
                // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
                // value={staffChoose}
                value={isClear ? null : serviceChoose?.staff}
                // blurOnSelect={true}
                // value={isClear ? data?.[0] : ''}
                renderInput={(params) => <TextField {...params} label={Vi.staffWork} />}
              />
            ) : null}

            {/* {type === ENUM_PRODUCT_TYPE?.[1]?.name ? (
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
            ) : null}
            {type === ENUM_PRODUCT_TYPE?.[1]?.name ? (
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
            ) : null} */}
            {type === ENUM_PRODUCT_TYPE?.[1]?.name ? (
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
                value={productChoose?.quantity}
                size="small"
                style={{ width: 100 }}
                onChange={(e) => handleChooseProduct('quantity', e.target.value)}
              />
            ) : null}
            <Button
              variant="outlined"
              onClick={type === ENUM_PRODUCT_TYPE?.[0]?.name ? handleAddServiceToList : handleAddProductToList}
              size="small"
              type="submit"
            >
              {Vi.add}
            </Button>
          </Box>
          <Box mt={2}>
            <Typography style={{ fontSize: 18, marginBottom: 12, fontWeight: 600 }}> {Vi.product}:</Typography>
          </Box>
          {renderTitleProduct()}
          {listProductAdd?.map((e, index) => renderItemProduct(e, index))}
          <Box mt={2}>
            <Typography style={{ fontSize: 18, marginBottom: 12, fontWeight: 600 }}> {Vi.service}:</Typography>
          </Box>
          {renderTitleServices()}
          {listServiceAdd?.map((e, index) => renderItemService(e, index))}
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
