import { Box, Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import moment from 'moment';
import { addUpdateQuoteAPI, getAllStaffAPI } from 'src/components/services';
import AppToast from 'src/myTool/AppToast';
import { Vi } from 'src/_mock/Vi';

export default function AssignService(props) {
  const { openDialog, setOpenDialog, receiptChoose, getAllCart } = props;

  const [additionPrice, setAdditionPrice] = useState(0);
  const [productAdd, setProductAdd] = useState([]);
  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');

  const [cartId, setCartId] = useState(0);

  /// services/product

  const [listStaff, setListStaff] = useState([]);

  const [errorMsg, setErrorMsg] = useState('');
  ///

  /// state list services / product

  ///
  const [listServiceAdd, setListServiceAdd] = useState([{ ServiceName: 'Hư kính xe' }, { ServiceName: 'Hư bánh xe' }]);
  const [listProductAdd, setListProductAdd] = useState([]);

  //

  const InfoAdmin = JSON.parse(localStorage.getItem('profileAdmin'));

  //// useEffect

  React.useEffect(() => {
    getAllStaff();
  }, []);

  useEffect(() => {
    if (receiptChoose?.ReceiptID) {
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
      setListProductAdd(dataProduct);

      const dataService = [];
      receiptChoose?.priceQuoteServiceDetails?.forEach((e, index) => {
        const temp = {
          ...e?.service,
          //   staff: e?.repairOrderDetails?.[0]?.staff,
          isRemove: e?.Status === 1 ? true : false,
          index: index + 1,
          isAcceptedRepair: e?.isAcceptedRepair,
        };
        dataService?.push(temp);
      });
      setListServiceAdd(dataService);
    }
  }, [receiptChoose, openDialog]);

  // useEffect(()=)

  /// function

  const chooseStaff = (id, staff) => {
    const tempList = listServiceAdd?.filter((e) => e?.servicesId === id);
    const tempList1 = listServiceAdd?.filter((e) => e?.servicesId !== id);

    const tempData = { ...tempList?.[0], staff: { ...staff } };
    const newList = [...tempList1, tempData]?.sort((a, b) => a?.index - b?.index);
    setListServiceAdd(newList);
  };

  const getAllStaff = async () => {
    try {
      const res = await getAllStaffAPI();
      setListStaff(res?.data);
    } catch (error) {}
  };

  const handleClose = () => {
    setCartId(null);
    setProductAdd([]);
    setListProductAdd([]);
    setListServiceAdd([]);

    setAdditionPrice(0);
    setOpenDialog(false);
  };

  const addNewQuote = async (data, id) => {
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
    addNewQuote(data, receiptChoose?.QuoteID);
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
            width: 470,
          }}
        >
          <Box style={{ display: 'flex', padding: 4, width: 60, justifyContent: 'space-between' }}>
            <Typography style={{ width: 50, textAlign: 'center' }}>{index + 1}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>

          <Box style={{ display: 'flex', padding: 4, width: 230, justifyContent: 'space-between' }}>
            <Typography style={{ width: 220, textAlign: 'center' }}>{item?.ServiceName}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>

          <Box style={{ display: 'flex', padding: 4, width: 250, justifyContent: 'space-between' }}>
            {/* <Typography style={{ width: 100, textAlign: 'center' }}>{item?.staff?.name}</Typography> */}
            <Autocomplete
              disablePortal
              //   id="manufacturer"
              options={listStaff}
              getOptionLabel={(option) => option?.name}
              sx={{ width: 300, mr: 2 }}
              onChange={(e, newValue) => {
                chooseStaff(item?.servicesId, newValue);
              }}
              size="small"
              // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
              renderInput={(params) => <TextField {...params} label={'chọn nhân viên sửa chửa'} />}
            />
            {/* <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} /> */}
          </Box>
        </Box>
        <Box style={{ height: 1, backgroundColor: 'gray', width: 530 }} />
      </Box>
    );
  };

  const renderTitleServices = () => {
    return (
      <Box style={{ width: 530 }}>
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

          {/* <Box style={{ display: 'flex', width: 240 }}>
            <Typography style={{ width: 220, textAlign: 'center' }}>{Vi.nameService}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box> */}
          <Box style={{ display: 'flex', padding: 4, width: 230 }}>
            <Typography style={{ width: 220, textAlign: 'center' }}>Hạng mục sửa chửa</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>

          <Box style={{ display: 'flex', padding: 4, width: 200 }}>
            <Typography style={{ width: 200, textAlign: 'center' }}>Nhân viên kỉ thuật</Typography>
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
          <DialogTitle>Chọn nhân viên sửa chửa cho dịch vụ </DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
        <DialogContent sx={{ height: 650, width: 600 }}>
          {renderTitleServices()}
          {listServiceAdd?.map((e, index) => renderItemService(e, index))}
        </DialogContent>

        <DialogActions>
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
