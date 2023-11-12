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
  addNewQuoteAPI,
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

export default function CreateQuote(props) {
  const { openDialog, setOpenDialog, receiptChoose } = props;

  const [additionPrice, setAdditionPrice] = useState(0);
  const [productAdd, setProductAdd] = useState([]);
  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');

  const [cartId, setCartId] = useState(0);

  /// services/product

  const [listServcies, setListServices] = useState([]);

  const [staffChoose, setStaffChoose] = useState({
    staffName: '',
  });
  const [listStaff, setListStaff] = useState([]);
  const [type, setType] = useState(ENUM_PRODUCT_TYPE?.[0]?.name);
  const [listProduct, setListProduct] = useState([]);

  const [isClear, setIsClear] = useState(true);
  const [isClearService, setIsClearService] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
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

  ///
  const [repairItem, setRepairItem] = useState([]);

  const [repairItemChoose, setRepairItemChoose] = useState({});

  const InfoAdmin = JSON.parse(localStorage.getItem('profileAdmin'));

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

      const tempVehicleStatusReceipts = [];

      receiptChoose?.vehicleStatusReceipts.forEach((e) => {
        const temp = {
          ID: e?.vehicleStatus?.ID,
          Name: e?.vehicleStatus?.Name,
          condition: e?.Condition,
        };
        tempVehicleStatusReceipts?.push(temp);
      });
      setRepairItem(tempVehicleStatusReceipts);
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
    } catch (error) {
      console.log(error);
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

    setAdditionPrice(0);
    setOpenDialog(false);
    setType(ENUM_PRODUCT_TYPE?.[0]?.name);
  };

  const addNewQuote = async (data) => {
    // try {
    //   const res = await addNewQuoteAPI(data)
    // } catch (error) {

    // }
    try {
      const res = await addNewQuoteAPI(data);
      let errorMessage = res.message || 'Tạo báo giá thất bại';
      let successMessage = res.message || 'Tạo báo giá thành công';
      if (res.status === 201) {
        setContentToastHere(successMessage);
        setSeverityHere('success');
        setAdditionPrice(0);
        setOpenToastHere(true);
        setOpenDialog(false);
        handleClose();
      } else {
        setContentToastHere(errorMessage);
        setOpenToastHere(true);
        setSeverityHere('error');
      }
    } catch (error) {
      setContentToastHere('Tạo báo giá thất bại');
      setOpenToastHere(true);
      setSeverityHere('error');
    }
  };

  const reset = () => {
    setListProductAdd([]);
    setListServiceAdd([]);
  };
  const handleAddProduct = (status) => {
    const dataService = [];
    listServiceAdd?.forEach((e) => {
      const temp = {
        ServiceID: e?.ServiceID,
        Price: e?.Price,
        // Technician: e?.staff?.id,
        repairItem: e?.repairItemChoose,
      };
      dataService?.push(temp);
    });

    const dataProduct = [];
    listProductAdd?.forEach((e) => {
      console.log();
      const temp = {
        SellingPrice: e?.SellingPrice,
        PurchasePrice: e?.PurchasePrice,
        Quantity: e?.quantity,
        productDetailID: e?.ProductDetailID,
        repairItem: e?.repairItemChoose,
      };
      dataProduct?.push(temp);
    });

    const listVehicleStatus = [];
    repairItem?.forEach((item) => {
      const dataServiceTemp = dataService?.filter((e) => e?.repairItem?.ID === item?.ID);
      const dataProductTemp = dataProduct?.filter((e) => e?.repairItem?.ID === item?.ID);
      const temp = { ...item, pqProduct: [...dataProductTemp], pqService: [...dataServiceTemp] };
      listVehicleStatus?.push(temp);
    });

    // const supperData
    const data = {
      Status: status,
      Time: moment().format('DD-MM-yyyy hh:mm'),
      StaffID: InfoAdmin?.userId,
      ReceiptID: receiptChoose?.ReceiptID,
      // priceQuoteServiceDetails: dataService,
      // priceQuoteProd ataProduct,
      vehicleStatus: listVehicleStatus,
      TimeCreateRepair: status === 1 ? moment().format('DD-MM-yyyy hh:mm') : undefined,
    };
    console.log('pon console ne ', data);
    addNewQuote(data);
  };
  const handleAddProductToList = () => {
    const listChoose = listServiceAdd?.filter((e) => e?.repairItemChoose?.ID === repairItemChoose?.ID);
    const flat = listChoose?.filter((e) => e?.ProductDetailID === productChoose?.ProductDetailID);
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
        repairItemChoose: repairItemChoose,
      });
      setListProductAdd(product);
      setIsClear(true);
      setProductChoose({
        quantity: 0,
      });
    }
  };

  const removeProductAdd = (ProductDetailID) => {
    const listTemp = [...listProductAdd];
    const listNewProduct = listTemp?.filter((e) => e?.ProductDetailID !== ProductDetailID);

    setListProductAdd(listNewProduct);
  };

  const handleAddServiceToList = () => {
    const listChoose = listServiceAdd?.filter((e) => e?.repairItemChoose?.ID === repairItemChoose?.ID);
    const flat = listChoose?.filter((e) => e?.ServiceID === serviceChoose?.ServiceID);
    if (!serviceChoose?.ServiceID) {
      setContentToastHere('Vui lòng chọn dịch vụ sửa chửa');
      setOpenToastHere(true);
      setSeverityHere('error');
    } else if (flat?.length > 0) {
      setContentToastHere('Dịch vụ này đã có trong phiếu báo giá');
      setOpenToastHere(true);
      setSeverityHere('error');
    } else {
      const service = [...listServiceAdd];
      service.push({
        ...serviceChoose,
        index: listServiceAdd?.length > 0 ? listServiceAdd?.[listServiceAdd?.length - 1]?.index + 1 : 1,
        repairItemChoose: repairItemChoose,
      });
      setListServiceAdd(service);
      setIsClearService(true);
      setIsClear(true);
      setServiceChoose({
        staff: {},
      });
    }
  };

  const removeServiceAdd = (ServiceID, IDRepairItem) => {
    const listTemp = [...listServiceAdd];

    const listNewProduct = [];

    // listTemp?.filter((e) => e?.ServiceID !== ServiceID);
    listTemp?.forEach((e) => {
      if (e?.serviceID !== ServiceID && e?.repairItemChoose?.ID !== IDRepairItem) {
        listNewProduct?.push(e);
      }
    });
    setListServiceAdd(listNewProduct);
  };

  const handleChooseProduct = (field, value) => {
    if (field === 'quantity') {
      if (!onlyNumber(value)) {
        if (value === '') {
          setErrorMsg(Vi.quantityMore0);
          const temp = { ...productChoose, [field]: value };
          setProductChoose(temp);
        }
      } else if (value > 100 || value === 0 || value === '') {
        setErrorMsg(Vi.quantityMore0);
        const temp = { ...productChoose, [field]: value };
        setProductChoose(temp);
      } else {
        const temp = { ...productChoose, [field]: value };
        setProductChoose(temp);
        setErrorMsg('');
      }
    } else {
      const temp = { ...productChoose, [field]: value };
      setProductChoose(temp);
    }
  };
  const handleChooseNameProduct = (value) => {
    const temp = { ...productChoose, ...value };
    setProductChoose(temp);
  };

  const handleChooseServce = (value) => {
    const temp = { ...serviceChoose, ...value };
    setServiceChoose(temp);
  };
  const handleChooseStaffToServce = (value) => {
    const temp = { ...serviceChoose, staff: value };
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
            width: 1200,
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
          <Box style={{ display: 'flex', padding: 4, width: 240 }}>
            <Typography style={{ width: 215, textAlign: 'center' }}>{item?.repairItemChoose?.Name}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Button
            onClick={() => removeProductAdd(item?.ProductDetailID)}
            style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}
          >
            <Typography style={{ width: 100, textAlign: 'center' }}>X</Typography>
            {/* <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} /> */}
          </Button>
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray', width: 1200 }} />
      </Box>
    );
  };
  const renderItemService = (item, index) => {
    console.log('pon console', item);
    return (
      <Box>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            //   justifyContent: 'space-between',
            // backgroundColor: 'cyan',
            width: 1000,
          }}
        >
          <Box style={{ display: 'flex', padding: 4, width: 60, justifyContent: 'space-between' }}>
            <Typography style={{ width: 50, textAlign: 'center' }}>{index + 1}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', width: 106, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.ServiceID}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 268, justifyContent: 'space-between' }}>
            <Typography style={{ width: 250, textAlign: 'center' }}>{item?.ServiceName}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>

          <Box style={{ display: 'flex', padding: 4, width: 250, justifyContent: 'space-between' }}>
            <Typography style={{ width: 300, textAlign: 'center' }}>
              {formatMoneyWithDot(parseInt(item?.Price || '0.00'))}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 200, justifyContent: 'space-between' }}>
            <Typography style={{ width: 190, textAlign: 'center' }}>{item?.staff?.name || ''}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 220, justifyContent: 'space-between' }}>
            <Typography style={{ width: 220, textAlign: 'center' }}>{item?.repairItemChoose?.Name}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>

          <Button
            onClick={() => removeServiceAdd(item?.ServiceID, item?.repairItemChoose?.ID)}
            style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}
          >
            <Typography style={{ width: 100, textAlign: 'center' }}>X</Typography>
          </Button>
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray', width: 1200 }} />
      </Box>
    );
  };

  const renderTitleServices = () => {
    return (
      <Box style={{ width: 1200 }}>
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
          <Box style={{ display: 'flex', padding: 4, width: 190 }}>
            <Typography style={{ width: 190, textAlign: 'center' }}>Hạng mục sửa chửa</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray' }} />
      </Box>
    );
  };

  const renderTitleProduct = () => {
    return (
      <Box style={{ width: 1200 }}>
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
          <Box style={{ display: 'flex', padding: 4, width: 220 }}>
            <Typography style={{ width: 190, textAlign: 'center' }}>Hạng mục sửa chửa</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 40 }}>
            <Typography style={{ width: 100, textAlign: 'center' }}></Typography>
            {/* <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} /> */}
          </Box>
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray' }} />
      </Box>
    );
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
        {/* <DialogTitle>{Vi.quote}</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{Vi.quote}</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
        <DialogContent sx={{ height: 650, width: 1300 }}>
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
                size="small"
                required
              />
              <TextField
                id="createAt"
                label={Vi.createAt}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                value={createAt}
                size="small"
              />
              <TextField
                id="createName"
                label={Vi.createName}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                value={InfoAdmin?.name}
                size="small"
                required
              />
            </Box>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <TextField
              id="nameCustomer"
              label={Vi.nameCustomer}
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

          <Box style={{ display: 'flex', marginTop: 12 }}>
            <Autocomplete
              disablePortal
              //   id="manufacturer"
              options={repairItem}
              getOptionLabel={(option) => option?.Name}
              sx={{ width: 300, mr: 2 }}
              onChange={(e, newValue) => {
                setRepairItemChoose(newValue);
              }}
              size="small"
              // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
              renderInput={(params) => <TextField {...params} label={'chọn hạng mục sửa chửa'} />}
            />
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
                  setIsClearService(false);
                }}
                size="small"
                key={serviceChoose?.ServiceName}
                value={isClearService ? null : serviceChoose}
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
                renderInput={(params) => <TextField {...params} label={Vi.nameProduct} />}
              />
            )}

            {/* {type === ENUM_PRODUCT_TYPE?.[0]?.name ? (
              <Autocomplete
                disablePortal
                id="staff"
                options={listStaff}
                getOptionLabel={(option) => option?.name}
                sx={{ width: 200, mr: 2 }}
                onChange={(e, newValue) => {
                  handleChooseStaffToServce(newValue);

                  setIsClear(false);
                }}
                key={serviceChoose?.staff}
                size="small"
                value={isClear ? null : serviceChoose?.staff}
                renderInput={(params) => <TextField {...params} label={Vi.staffWork} />}
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
          {errorMsg ? <Typography style={{ color: 'red', marginTop: 12 }}>{errorMsg}</Typography> : null}
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

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {'Xem phiếu tiếp nhận'}
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            {'Xem lệnh sửa chửa'}
          </Button>
          <Button variant="outlined" onClick={() => handleAddProduct(0)} type="submit">
            {Vi.save}
          </Button>
          <Button variant="outlined" onClick={reset} type="submit">
            {Vi.reset}
          </Button>
          <Button variant="outlined" onClick={() => handleAddProduct(1)} type="submit">
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
