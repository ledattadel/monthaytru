import { Box, Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import moment from 'moment';
import {
  addNewImportProductAPI,
  addNewProductAPI,
  getAllBrandAPI,
  getAllProductAPI,
  getAllSupplierAPI,
} from 'src/components/services';
import AppToast from 'src/myTool/AppToast';
import formatMoneyWithDot from 'src/utils/formatMoney';
import { Vi } from 'src/_mock/Vi';

export default function DetailImportProductDialog(props) {
  const { openDialog, setOpenDialog, product } = props;

  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');

  /// services/product

  const [supplierChoose, setSupplierChoose] = useState();
  const InfoAdmin = JSON.parse(localStorage.getItem('profileAdmin'));
  ///
  const [createAt, setCreateAt] = useState();

  //

  const [listProductAdd, setListProductAdd] = useState([]);

  // const getAllProduct = async () => {
  //   try {
  //     const res = await getAllCartAPI();
  //     if (res?.data?.purchaseOrders?.length > 0) {
  //       setListProduct(res?.data?.purchaseOrders);
  //     }
  //     // console.log('pon console', res?.data?.purchaseOrders);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  ///

  React.useEffect(() => {
    setCreateAt(moment().format('DD-MM-yyyy hh:mm'));
    setListProductAdd(product?.purchaseOrderDetails);
  }, [product, openDialog]);

  const totalPayment = React.useMemo(() => {
    const totalMoney = listProductAdd?.reduce(
      (a, b) => a * 1 + parseInt(b?.productDetail?.PurchasePrice || '0.0') * b?.Quantity,
      0
    );
    // listProductAdd?.forEach((e)=>{
    // parseInt(item?.productDetail?.PurchasePrice || '0.0') * item?.Quantity
    //   const total =
    // })
    return totalMoney;
  }, [listProductAdd]);

  const handleClose = () => {
    setListProductAdd([]);

    setOpenDialog(false);
  };

  const renderItemProduct = (item, index) => {
    console.log('pon console ahah', item);
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
            <Typography style={{ width: 100, textAlign: 'center' }}>
              {item?.productDetail?.product?.ProductID}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 168, justifyContent: 'space-between' }}>
            <Typography style={{ width: 130, textAlign: 'center' }}>
              {item?.productDetail?.product?.ProductName}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 146, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>
              {item?.productDetail?.product?.brand?.BrandName}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 140, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>
              {formatMoneyWithDot(parseInt(item?.productDetail?.PurchasePrice || '0.0'))}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 100, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item.Quantity}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 156, justifyContent: 'space-between' }}>
            <Typography style={{ width: 140, textAlign: 'center' }}>
              {formatMoneyWithDot(parseInt(item?.productDetail?.PurchasePrice || '0.0') * item?.Quantity || 0)}
            </Typography>
            {/* <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} /> */}
          </Box>

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
    <div style={{ width: '1800px' }}>
      <Dialog open={openDialog} onClose={handleClose} maxWidth={'1500px'}>
        <DialogTitle>{Vi.addNewImportProduct}</DialogTitle>
        <DialogContent sx={{ height: 650, width: 1000 }}>
          <Box style={{ borderWidth: 1, borderColor: 'grey' }}>
            <Typography style={{ fontSize: 14, marginTop: 8, marginBottom: 12 }}>{Vi.inforImportProduct}</Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField
                id="importProductId"
                label={Vi.importProductId}
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={Vi.autoRenderId}
                disabled={true}
                value={product?.OrderID}
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
                value={product?.OrderDate}
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
                value={product?.staff?.name}
                size="small"
                //   onChange={(e) => handleDataCustomer(e.target.value)}
                required
              />
              <TextField
                id="supplier"
                label={Vi.supplier}
                //   type="Number"
                sx={{ mr: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={true}
                value={product?.purchaseOrderDetails?.[0]?.productDetail?.supplier?.name}
                size="small"
                //   onChange={(e) => handleDataCustomer(e.target.value)}
                required
              />
            </Box>
          </Box>

          <Box mt={2}>
            <Typography style={{ fontSize: 18, marginBottom: 12, fontWeight: 600 }}> {Vi.product}:</Typography>
          </Box>
          {renderTitleProduct()}
          {listProductAdd?.map((e, index) => renderItemProduct(e, index))}

          <Box style={{ display: 'flex', justifyContent: 'space-between', width: 330, marginLeft: 620 }}>
            <Typography textAlign={'right'} style={{ fontSize: 18, marginTop: 12 }}>
              Tổng tiền :{' '}
            </Typography>
            <Typography style={{ fontSize: 18, marginTop: 12 }}>{formatMoneyWithDot(totalPayment || 0)}</Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            {Vi.Cancel}
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
