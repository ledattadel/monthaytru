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
  addUpdateQuoteAPI,
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

export default function QuoteDetail(props) {
  const { openDialog, setOpenDialog, receiptChoose, getAllCart } = props;

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

  const [listServiceAddDefault, setListServiceAddDefault] = useState([]);
  const [listProductAddDefault, setListProductAddDefault] = useState([]);
  ///
  const [listServiceAdd, setListServiceAdd] = useState([]);
  const [listProductAdd, setListProductAdd] = useState([]);

  //
  const [listServiceAdd1, setListServiceAdd1] = useState([]);
  const [listProductAdd1, setListProductAdd1] = useState([]);

  const [productChoose, setProductChoose] = useState({
    quantity: 0,
  });
  const [serviceChoose, setServiceChoose] = useState({
    staff: {},
  });

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
      handleDataCustomer('phoneNumber', receiptChoose?.receipt?.customer?.phoneNumber);
      handleDataCustomer('name', receiptChoose?.receipt?.customer?.name);
      handleDataVehicle('vehicleNumber', receiptChoose?.receipt?.vehicle?.NumberPlate);

      const dataProduct = [];
      receiptChoose?.priceQuoteProductDetails?.forEach((e, index) => {
        const temp = {
          ...e?.productDetail,
          quantity: e?.Quantity,
          supplier: e?.supplier,
          isRemove: e?.Status === 1 ? true : false,
          index: index + 1,
          isAcceptedRepair: e?.isAcceptedRepair,
        };
        dataProduct?.push(temp);
      });
      setListProductAddDefault(dataProduct);
      setListProductAdd(dataProduct);

      const dataService = [];
      receiptChoose?.priceQuoteServiceDetails?.forEach((e, index) => {
        const temp = {
          ...e?.service,
          staff: e?.repairOrderDetails?.[0]?.staff,
          isRemove: e?.Status === 1 ? true : false,
          index: index + 1,
          isAcceptedRepair: e?.isAcceptedRepair,
        };
        dataService?.push(temp);
      });
      setListServiceAddDefault(dataService);
      setListServiceAdd(dataService);
    }
  }, [receiptChoose, openDialog]);

  // useEffect(()=)

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

  const reNew = () => {
    setListProductAdd(listProductAddDefault);
    setListServiceAdd(listServiceAddDefault);
    setListServiceAdd1([]);
    setListProductAdd1([]);
  };

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
    setListServiceAdd1([]);
    setListProductAdd1([]);

    setAdditionPrice(0);
    setOpenDialog(false);
    setType(ENUM_PRODUCT_TYPE?.[0]?.name);
  };

  const addNewQuote = async (data, id) => {
    // try {
    //   const res = await addNewQuoteAPI(data)
    // } catch (error) {

    // }
    try {
      const res = await addUpdateQuoteAPI(data, id);
      let errorMessage = res.message || 'Tạo báo giá thất bại';
      let successMessage = res.message || 'Tạo báo giá thành công';
      if (res.status === 201) {
        setContentToastHere(successMessage);
        setSeverityHere('success');
        setAdditionPrice(0);
        setOpenToastHere(true);
        setOpenDialog(false);
        getAllCart();
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
  const handleAddProduct = (status) => {
    const dataService = [];

    const dataProduct = [];

    // if (receiptChoose?.Status === '2' || receiptChoose?.Status === '1') {
    //   const listProductAddTemp = listProductAdd?.filter((e) => e?.isAcceptedRepair !== true);
    //   listProductAddTemp?.forEach((e) => {
    //     const temp = {
    //       SellingPrice: e?.SellingPrice,
    //       PurchasePrice: e?.PurchasePrice,
    //       Quantity: e?.quantity,
    //       productDetailID: e?.ProductDetailID,
    //       isAcceptedRepair: e?.isAcceptedRepair ? true : false,
    //     };
    //     dataProduct?.push(temp);
    //   });

    //   /// services

    //   const listServiceAddTemp = listServiceAdd?.filter((e) => e?.isAcceptedRepair !== true);

    //   listServiceAddTemp?.forEach((e) => {
    //     const temp = {
    //       ServiceID: e?.ServiceID,
    //       Price: e?.Price,
    //       Technician: e?.staff?.id,
    //       isAcceptedRepair: e?.isAcceptedRepair ? true : false,
    //     };
    //     dataService?.push(temp);
    //   });
    // } else {
    listProductAdd?.forEach((e) => {
      const temp = {
        SellingPrice: e?.SellingPrice,
        PurchasePrice: e?.PurchasePrice,
        Quantity: e?.quantity,
        productDetailID: e?.ProductDetailID,
        isAcceptedRepair:
          status === 1 ? true : status === 0 ? false : status === 2 && e?.isAcceptedRepair ? true : false,
      };
      dataProduct?.push(temp);
      /// service
      listServiceAdd?.forEach((e) => {
        const temp = {
          ServiceID: e?.ServiceID,
          Price: e?.Price,
          Technician: e?.staff?.id,
          isAcceptedRepair:
            status === 1 ? true : status === 0 ? false : status === 2 && e?.isAcceptedRepair ? true : false,
        };
        dataService?.push(temp);
      });
    });
    // }

    const data = {
      Status: status,
      TimeUpdate: moment().format('DD-MM-yyyy hh:mm'),
      EditorID: InfoAdmin?.userId,
      // ReceiptID: receiptChoose?.ReceiptID,
      priceQuoteServiceDetails: dataService,
      priceQuoteProductDetails: dataProduct,
      TimeCreateRepair: receiptChoose?.repairOrder?.TimeCreate ?? moment().format('DD-MM-yyyy hh:mm'),
    };
    // console.log('pon console', receiptChoose);
    addNewQuote(data, receiptChoose?.QuoteID);
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

      const tempData1 = listProductAdd1?.filter((e) => e?.ProductDetailID !== productChoose?.ProductDetailID);
      const product1 = [...tempData1, data]?.sort((a, b) => a.index - b.index);

      setListProductAdd1(product1);
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

      ////
      const product1 = [];
      product1.push({
        ...productChoose,
        index: listProductAdd?.length > 0 ? listProductAdd?.[listProductAdd?.length - 1]?.index + 1 : 1,
      });
      setListProductAdd1(product1);
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
    const flat = listServiceAdd?.filter((e) => e?.ServiceID === serviceChoose?.ServiceID);
    if (!serviceChoose?.staff?.id) {
      setContentToastHere('Vui lòng chọn nhân viên sửa chửa');
      setOpenToastHere(true);
      setSeverityHere('error');
    } else if (!serviceChoose?.ServiceID) {
      setContentToastHere('Vui lòng chọn dịch vụ sửa chửa');
      setOpenToastHere(true);
      setSeverityHere('error');
    } else if (flat?.length > 0) {
      setContentToastHere('Dịch vụ này đã có trong phiếu báo giá');
      setOpenToastHere(true);
      setSeverityHere('error');
      setErrorMsg('');
    } else {
      const service = [...listServiceAdd];
      const service1 = [];

      service.push({
        ...serviceChoose,
        index: listServiceAdd?.length > 0 ? listServiceAdd?.[listServiceAdd?.length - 1]?.index + 1 : 1,
      });
      service1.push({
        ...serviceChoose,
        index: listServiceAdd?.length > 0 ? listServiceAdd?.[listServiceAdd?.length - 1]?.index + 1 : 1,
      });
      setListServiceAdd(service);
      setListServiceAdd1(service1);
      setIsClearService(true);
      setIsClear(true);
      setServiceChoose({
        staff: {},
      });
    }
  };

  const removeServiceAdd = (ServiceID) => {
    const listTemp = [...listServiceAdd];
    const listNewProduct = listTemp?.filter((e) => e?.ServiceID !== ServiceID);
    const listTemp1 = [...listServiceAdd1];
    const listNewProduct1 = listTemp?.filter((e) => e?.ServiceID !== ServiceID);

    setListServiceAdd(listNewProduct);
    setListServiceAdd1(listNewProduct1);
  };

  // const handleChooseProduct = (field, value) => {
  //   const temp = { ...productChoose, [field]: value };
  //   setProductChoose(temp);

  // };
  const onlyNumber = (value) => {
    const pattern = /^\d+$/;
    let flat = false;
    if (pattern.test(value)) {
      flat = true;
    }
    return flat;
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
      } else if (value > productChoose?.Quantity) {
        setErrorMsg(`sản phẩm trong kho k đủ chỉ còn ${productChoose?.Quantity}`);
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
  // const countPrice = () => {
  //   const priceQuoteService = priceQuoteServiceDetails?.reduce((a, b) => a * 1 + parseInt(b?.Price || '0.0'), 0);
  //   const priceQuoteProduct = priceQuoteProductDetails?.reduce(
  //     (a, b) => a * 1 + parseInt(b?.SellingPrice || '0.0') * b?.Quantity || 1,
  //     0
  //   );
  //   return priceQuoteService * 1 + priceQuoteProduct * 1;
  // };

  const priceQuoteService = listServiceAdd?.reduce((a, b) => a * 1 + parseInt(b?.Price || '0.0'), 0);

  const priceQuoteProduct = listProductAdd?.reduce(
    (a, b) => a * 1 + parseInt(b?.SellingPrice || '0.0') * b?.quantity || 1,
    0
  );
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
            disabled={item?.isAcceptedRepair}
            style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}
          >
            <Typography style={{ width: 100, textAlign: 'center' }}>X</Typography>
            {/* <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} /> */}
          </Button>
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
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.ServiceID}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 268, justifyContent: 'space-between' }}>
            <Typography style={{ width: 230, textAlign: 'center' }}>{item?.ServiceName}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>

          <Box style={{ display: 'flex', padding: 4, width: 248, justifyContent: 'space-between' }}>
            <Typography style={{ width: 210, textAlign: 'center' }}>
              {formatMoneyWithDot(parseInt(item?.Price || '0.00'))}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 200, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.staff?.name}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>

          <Button
            onClick={() => removeServiceAdd(item?.ServiceID)}
            disabled={item?.isAcceptedRepair}
            style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}
          >
            <Typography style={{ width: 100, textAlign: 'center' }}>X</Typography>
          </Button>
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
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray' }} />
      </Box>
    );
  };

  return (
    <div style={{ width: '1500px' }}>
      <Dialog open={openDialog} onClose={handleClose} maxWidth={'1500px'}>
        {/* <DialogTitle>{Vi.quote}</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{Vi.quote}</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
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
                value={receiptChoose?.QuoteID}
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
                value={'Pôn'}
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
          {receiptChoose?.repairOrder?.IsDone && receiptChoose?.Status === '1' ? null : (
            <Typography style={{ fontSize: 14, marginTop: 24, marginBottom: 12 }}>{Vi.addProductService}</Typography>
          )}

          {/* <Typography style={{ fontSize: 14, marginTop: 24, marginBottom: 12 }}>{'Hư kính'}</Typography> */}

          {receiptChoose?.repairOrder?.IsDone && receiptChoose?.Status === '1' ? null : (
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

              {type === ENUM_PRODUCT_TYPE?.[0]?.name ? (
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
              ) : null}

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
          )}
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

          <Box style={{ display: 'flex', justifyContent: 'space-between', width: 330, marginLeft: 620 }}>
            <Typography textAlign={'right'} style={{ fontSize: 18, marginTop: 12 }}>
              Tổng tiền sản phẩm :{' '}
            </Typography>
            <Typography style={{ fontSize: 18, marginTop: 12 }}>
              {formatMoneyWithDot(priceQuoteProduct || 0)}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'space-between', width: 330, marginLeft: 620 }}>
            <Typography textAlign={'right'} style={{ fontSize: 18, marginTop: 12 }}>
              Tổng tiền dịch vụ:{' '}
            </Typography>
            <Typography style={{ fontSize: 18, marginTop: 12 }}>
              {formatMoneyWithDot(priceQuoteService || 0)}
            </Typography>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'space-between', width: 330, marginLeft: 620 }}>
            <Typography textAlign={'right'} style={{ fontSize: 18, marginTop: 12 }}>
              Tổng tiền:{' '}
            </Typography>
            <Typography style={{ fontSize: 18, marginTop: 12 }}>
              {formatMoneyWithDot(parseInt(priceQuoteService * 1 + priceQuoteProduct * 1) || 0)}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'space-between', width: 330, marginLeft: 620 }}>
            <Typography textAlign={'right'} style={{ fontSize: 18, marginTop: 12 }}>
              (VAT 8%) :{' '}
            </Typography>
            <Typography style={{ fontSize: 18, marginTop: 12 }}>
              {formatMoneyWithDot(parseInt((priceQuoteService * 1 + priceQuoteProduct * 1) * 0.08) || 0)}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'space-between', width: 330, marginLeft: 620 }}>
            <Typography textAlign={'right'} style={{ fontSize: 18, marginTop: 12 }}>
              Tổng tiền(VAT 8%) :{' '}
            </Typography>
            <Typography style={{ fontSize: 18, marginTop: 12 }}>
              {formatMoneyWithDot(parseInt((priceQuoteService * 1 + priceQuoteProduct * 1) * 1.08) || 0)}
            </Typography>
          </Box>
        </DialogContent>

        {receiptChoose?.repairOrder?.IsDone && receiptChoose?.Status === '1' ? (
          <DialogActions>
            {/* <Button variant="outlined" onClick={handleClose}>
              {Vi.Cancel}
            </Button> */}
          </DialogActions>
        ) : (
          <DialogActions>
            {/* <Button variant="outlined" onClick={handleClose}>
              {Vi.Cancel}
            </Button> */}
            <Button
              variant="outlined"
              onClick={() => handleAddProduct(receiptChoose?.Status === 0 ? 0 : 2)}
              type="submit"
            >
              {Vi.save}
            </Button>
            <Button variant="outlined" onClick={reNew} type="submit">
              {Vi.reset}
            </Button>
            <Button variant="outlined" onClick={() => handleAddProduct(1)} type="submit">
              {Vi.next}
            </Button>
          </DialogActions>
        )}
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
