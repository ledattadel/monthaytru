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
  updateRepairAPI,
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

export default function RepairDetail(props) {
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
  const [isDoneAll, setIsDoneAll] = useState(false);

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
    // setCreateAt(moment().format('DD-MM-yyyy hh:mm'));
    getAllStaff();
  }, []);
  React.useEffect(() => {
    // getAllUser();
    getVehicleByNumber(inforVehicle?.vehicleNumber);
  }, [inforVehicle?.vehicleNumber]);

  useEffect(() => {
    if (receiptChoose?.RepairOrderID) {
      handleDataCustomer('phoneNumber', receiptChoose?.priceQuote?.receipt?.customer?.phoneNumber);
      handleDataCustomer('name', receiptChoose?.priceQuote?.receipt?.customer?.name);
      handleDataVehicle('vehicleNumber', receiptChoose?.priceQuote?.receipt?.vehicle?.NumberPlate);

      const dataProduct = [];
      receiptChoose?.priceQuote?.priceQuoteProductDetails?.forEach((e, index) => {
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
      receiptChoose?.repairOrderDetails?.forEach((e, index) => {
        const temp = {
          ...e?.pqServiceDetail?.service,
          staff: e?.staff,
          isRemove: e?.Status === 1 ? true : false,
          index: index + 1,
          isAcceptedRepair: e?.isAcceptedRepair,
          IsDone: e?.IsDone,
          RODID: e?.RODID,
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

  const addNewQuote = async (data, id) => {
    try {
      const res = await updateRepairAPI(data, id);
      let errorMessage = res.message || 'Chỉnh sửa thất bại';
      let successMessage = res.message || 'Chỉnh sửa thành công';
      if (res.status === 200) {
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
      setContentToastHere('Chỉnh sửa thất bại');
      setOpenToastHere(true);
      setSeverityHere('error');
    }
  };
  const handleAddProduct = () => {
    const dataService = [];
    listServiceAdd?.forEach((e) => {
      const temp = {
        RODID: e?.RODID,
        IsDone: e?.IsDone,
      };
      dataService?.push(temp);
    });

    const data = {
      RepairOrderID: receiptChoose?.RepairOrderID,
      priceQuoteServiceDetails: dataService,
    };
    console.log('pon console ne ', data);
    // console.log('pon console', receiptChoose);
    addNewQuote(data, receiptChoose?.RepairOrderID);
  };

  const handleDataVehicle = (field, value) => {
    const tempDate = { ...inforVehicle, [field]: value };
    setInforVehicle(tempDate);
  };
  const handleDataCustomer = (field, value) => {
    const tempDate = { ...inforCustomer, [field]: value };
    setInforCustomer(tempDate);
  };

  const handleDone = (status, id) => {
    const listService = listServiceAdd?.filter((e) => e?.ServiceID === id);
    const tempList = listServiceAdd?.filter((e) => e?.ServiceID !== id);
    const dataNew = { ...listService?.[0], IsDone: !status };

    const newList = [...tempList, dataNew]?.sort((a, b) => a?.index - b?.index);
    setListServiceAdd(newList);
  };

  const handleAllDone = () => {
    const listData = [];
    listServiceAdd?.forEach((e) => {
      const dataNew = { ...e, IsDone: true };
      listData?.push(dataNew);
    });
    setListServiceAdd(listData);
    setIsDoneAll(true);
  };
  const handleAllNotDone = () => {
    const listData = [];
    listServiceAdd?.forEach((e) => {
      const dataNew = { ...e, IsDone: false };
      listData?.push(dataNew);
    });
    setListServiceAdd(listData);
    setIsDoneAll(false);
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
          {/* <Button
            onClick={() => removeProductAdd(item?.ProductDetailID)}
            disabled={item?.isRemove}
            style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}
          >
            <Typography style={{ width: 100, textAlign: 'center' }}>X</Typography>
          </Button> */}
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
            onClick={() => handleDone(item?.IsDone, item?.ServiceID)}
            disabled={item?.isRemove}
            style={{ display: 'flex', padding: 4, width: 30, height: 30, justifyContent: 'space-between' }}
          >
            <Typography style={{ width: 30, height: 30, textAlign: 'center', border: '1px solid red' }}>
              {item?.IsDone ? 'V' : ''}
            </Typography>
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

          <Box
            onClick={isDoneAll ? handleAllNotDone : handleAllDone}
            style={{ display: 'flex', padding: 4, width: 40 }}
          >
            <Typography style={{ width: 30, height: 30, textAlign: 'center', border: '1px solid red' }}>
              {isDoneAll ? 'V' : ''}
            </Typography>
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
                value={receiptChoose?.priceQuote?.ReceiptID}
                size="small"
                required
              />
              <TextField
                id="receiptId"
                label={Vi.quoteId}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                value={receiptChoose?.QuoteID}
                size="small"
                required
              />
              <TextField
                id="quoteId"
                label={'Mã phiếu lệnh sửa chửa'}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={'Hệ thống tự sinh'}
                disabled={true}
                size="small"
                required
                value={receiptChoose?.RepairOrderID}
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
              {/* <TextField
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
              /> */}
            </Box>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 }}>
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
          {/* <Typography style={{ fontSize: 14, marginTop: 24, marginBottom: 12 }}>{Vi.addProductService}</Typography>
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
         */}
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
            {Vi.Cancel}
          </Button>

          <Button variant="outlined" onClick={() => handleAddProduct()} type="submit">
            Lưu
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
