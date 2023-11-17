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

export default function PrinterBill(props) {
  const { openDialog, setOpenDialog, receiptChoose, getAllCart } = props;

  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');

  /// services/product

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

  const InfoAdmin = JSON.parse(localStorage.getItem('profileAdmin'));

  //// useEffect

  React.useEffect(() => {
    setCreateAt(moment().format('DD-MM-yyyy hh:mm'));
  }, []);
  React.useEffect(() => {
    // getAllUser();
    getVehicleByNumber(inforVehicle?.vehicleNumber);
  }, [inforVehicle?.vehicleNumber]);

  useEffect(() => {
    if (receiptChoose?.InvoiceID) {
      //   handleDataCustomer('phoneNumber', receiptChoose?.priceQuote?.receipt?.customer?.phoneNumber);
      //   handleDataCustomer('name', receiptChoose?.priceQuote?.receipt?.customer?.name);
      const dataCustomer = { ...receiptChoose?.priceQuote?.receipt?.customer };
      setInforCustomer(dataCustomer);
      handleDataVehicle('vehicleNumber', receiptChoose?.priceQuote?.receipt?.vehicle?.NumberPlate);
      console.log('pon console');
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
      receiptChoose?.priceQuote?.priceQuoteServiceDetails?.forEach((e, index) => {
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
            <Typography style={{ width: 200, textAlign: 'center' }}>Nhân viên kĩ thuật</Typography>
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth={'1500px'}>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{}</DialogTitle>
          <Box>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setContentToastHere('In hoá đơn thành công');
                setOpenToastHere(true);
                setSeverityHere('success');
              }}
            >
              In
            </Button>
            <Button onClick={() => setOpenDialog(false)}>X</Button>
          </Box>
        </Box>

        <DialogContent sx={{ height: 650, width: 1000 }}>
          <Box>
            <Typography>CÔNG TY TNHN BÙA ĐI FEN</Typography>
            <Typography>Địa chỉ : 97 , đường Man Thiện, phường Hiệp Phú , Quận 9 , thành phố Hồ Chí Minh</Typography>
            <Typography>Số điện thoại : 0389803709</Typography>
            <Typography>STK : 0389803709 - VCB - NGUYEN TRAN TRONG HIEU</Typography>
            <Typography>Email : hieutran@gmail.com</Typography>
            {/* <Typography>CÔNG TY TNHN BÙA ĐI FEN</Typography> */}
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <Typography style={{ fontSize: 20, fontWeight: '600' }}>Hoá đơn </Typography>
          </Box>
          <Box style={{ border: '1px solid grey', marginTop: 20 }}>
            <Box style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid grey' }}>
              <Typography style={{ borderRight: '1px solid grey', width: 130 }}>Khách hàng: </Typography>
              <Typography style={{ borderRight: '1px solid grey', width: 400, marginLeft: 30 }}>
                {inforCustomer?.name}
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ borderRight: '1px solid grey', width: 160 }}>
                Số điện thoại :
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ width: 200 }}>
                {' '}
                {inforCustomer?.phoneNumber}
              </Typography>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid grey' }}>
              <Typography style={{ borderRight: '1px solid grey', width: 158 }}>Biển số xe </Typography>
              <Typography style={{ borderRight: '1px solid grey', width: 200, marginLeft: 30 }}>
                {inforVehicleApi?.NumberPlate}{' '}
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ borderRight: '1px solid grey', width: 160 }}>
                Mẫu xe :
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ width: 200, borderRight: '1px solid grey' }}>
                {' '}
                {inforVehicleApi?.Type}
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ borderRight: '1px solid grey', width: 160 }}>
                Hãng :
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ width: 200 }}>
                {' '}
                {inforVehicleApi?.brand?.BrandName}
              </Typography>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid grey' }}>
              <Typography style={{ borderRight: '1px solid grey', width: 158 }}>Số khung xe </Typography>
              <Typography style={{ borderRight: '1px solid grey', width: 200, marginLeft: 30 }}>
                {inforVehicleApi?.ChassisNumber}
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ borderRight: '1px solid grey', width: 160 }}>
                Số máy xe :
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ width: 200, borderRight: '1px solid grey' }}>
                {' '}
                {inforVehicleApi?.EngineNumber}
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ borderRight: '1px solid grey', width: 160 }}>
                Màu xe :
              </Typography>
              <Typography sx={{ ml: 1 }} style={{ width: 200 }}>
                {' '}
                {inforVehicleApi?.Color}
              </Typography>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid grey' }}>
              <Typography style={{ borderRight: '1px solid grey', width: 131 }}>Tình trạng xe : </Typography>
              <Typography style={{ width: 800, marginLeft: 30 }}>
                {receiptChoose?.priceQuote?.receipt?.VehicleStatus}
              </Typography>
            </Box>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Typography style={{ borderRight: '1px solid grey', width: 131 }}>Ghi chú : </Typography>
              <Typography style={{ width: 800, marginLeft: 30 }}>{receiptChoose?.priceQuote?.receipt?.Note}</Typography>
            </Box>
          </Box>

          <Typography sx={{ mt: 2 }}>
            Theo yêu cầu của quý khách và sau khi xem xét, chúng tôi phục vụ các dịch vụ và sản phẩm sau
          </Typography>

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
            <Typography textAlign={'right'} style={{ fontSize: 18, marginTop: 12, fontWeight: '600' }}>
              Tổng tiền (VAT 8%) :{' '}
            </Typography>
            <Typography style={{ fontSize: 18, marginTop: 12 }}>
              {formatMoneyWithDot(parseInt((priceQuoteService * 1 + priceQuoteProduct * 1) * 1.08) || 0)}
            </Typography>
          </Box>
        </DialogContent>
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
