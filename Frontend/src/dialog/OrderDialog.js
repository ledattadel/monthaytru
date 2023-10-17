import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
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
import AppToast from '../myTool/AppToast';
import formatMoneyWithDot from '../utils/formatMoney';
import {
  addCarDesAPI,
  getAllProductAndServiceAPI,
  getCartDescriptionAPI,
  getAllServicesAPI,
} from '../components/services/index';

const ENUM_PRODUCT_TYPE = {
  PHU_KIEN: 'Phụ kiện',
  DICH_VU: 'Dịch vụ',
};

function formatDate(str) {
  const date = str.split('T');
  const day = date[0].split('-');
  return `${day[2]}/${day[1]}/${day[0]}`;
}

export default function OrderDialog(props) {
  const { openDialog, setOpenDialog, listCart } = props;
  const [listProduct, setListProduct] = useState([]);
  const [listService, setListService] = useState([]);
  const [productFocus, setProductFocus] = useState(null);
  const [serviceFocus, setServiceFocus] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [price, setPrice] = useState(null);
  const [additionPrice, setAdditionPrice] = useState(0);
  const [productAdd, setProductAdd] = useState([]);
  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [cartId, setCartId] = useState(0);
  const [listProductInCart, setListProductInCart] = useState([]);
  const [listProductWaitingConfirm, setListProductWaitingConfirm] = useState([]);

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
        setListProductInCart([]);
        setListProductWaitingConfirm([]);
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

  const getAllService = async () => {
    try {
      const res = await getAllServicesAPI();
      // setListService(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAndService = async () => {
    try {
      const res = await getAllProductAndServiceAPI();
      // setListProduct(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCartDescription = async (cartId) => {
    try {
      const res = await getCartDescriptionAPI(cartId);
      if (res?.status === 200) {
        // setListProductInCart(res?.data?.filter((value) => value?.type !== 'Báo giá'));
        const listProductAdd = res?.data
          ?.filter((value) => value?.type === 'Báo giá')
          .map((value) => {
            const { product, price, quantity, type } = value;
            return {
              id: product?.id,
              name: product?.name,
              price: price,
              quantity: quantity,
              totalPrice: price * quantity,
              type: type,
            };
          });
        // setListProductWaitingConfirm(listProductAdd);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllAndService();
    getAllService();
  }, []);

  useEffect(() => {
    getCartDescription(cartId);
  }, [cartId]);

  const handleClose = () => {
    setCartId(null);
    setProductAdd([]);
    setListProductInCart([]);
    setListProductWaitingConfirm([]);
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

  const getSalePriceOfProduct = (product) => {
    if (!product) return;
    const { saleDescriptions, price } = product;
    if (saleDescriptions.length === 0) return price;
    return price - price * (saleDescriptions?.[saleDescriptions.length - 1].salePercent / 100);
  };

  const handleAddProductToList = () => {
    if (!price || !productFocus || !quantity) {
      setIsError(true);
      setErrorMsg('(Product & Quantity & Price & Guarantee)');
    } else {
      setIsError(false);
      setErrorMsg('');
      const exist = productAdd?.find((value) => value.id === productFocus?.id);
      if (exist) {
        setOpenToastHere(true);
        setContentToastHere('Sản phẩm này đã có trong giỏ hàng, không thể thêm vào nữa!!');
        setSeverityHere('error');
      } else {
        const data = {
          id: productFocus?.id,
          quantity,
          name: productFocus?.name,
          price: price,
          totalPrice: price * quantity,
          type: 'Báo giá',
        };
        setProductAdd([...productAdd, data]);
        setQuantity('');
        setPrice('');
        setProductFocus(null);
      }
    }
  };

  const handleSetQuantity = (quantity) => {
    if (Number(quantity) > productFocus?.quantity) {
      setQuantity(productFocus?.quantity);
    } else {
      setQuantity(quantity);
    }
  };

  return (
    <div style={{ width: '1000px' }}>
      <Dialog open={openDialog} onClose={handleClose} maxWidth={'1000px'}>
        <DialogTitle>Add Product To Order</DialogTitle>
        <DialogContent sx={{ height: 650 }}>
          <Autocomplete
            disablePortal
            id="cart"
            options={listCart}
            getOptionLabel={(option) => option?.id.toString()}
            sx={{ mt: 2, mb: '60px' }}
            onChange={(e, newValue) => {
              setCartId(newValue?.id);
            }}
            renderInput={(params) => <TextField {...params} label="Cart" />}
          />
          <ExistProductInCart productExist={listProductInCart} title={'Sản phẩm đã trong giỏ hàng'} />
          {listProductWaitingConfirm.length > 0 && (
            <DenseTable productAdd={listProductWaitingConfirm} title={'Sản phẩm đang chờ chấp nhận'} />
          )}
          <DenseTable productAdd={productAdd} title={'Sản phẩm báo giá'} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: '60px',
            }}
          >
            <Autocomplete
              disablePortal
              id="product"
              options={listProduct}
              value={productFocus}
              getOptionLabel={(option) => option?.name.toString()}
              sx={{ width: 300, mr: 2 }}
              onChange={(e, newValue) => {
                setProductFocus(newValue);
                setPrice(getSalePriceOfProduct(newValue));
                if (newValue?.productType?.name === ENUM_PRODUCT_TYPE.DICH_VU) {
                  setQuantity(1);
                } else {
                  setQuantity(null);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Accessory" />}
            />
            <TextField
              id="price"
              label="Price"
              type="Number"
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <TextField
              id="quantity"
              label="Quantity"
              type="Number"
              sx={{ mr: 2 }}
              disabled={productFocus?.productType?.name === ENUM_PRODUCT_TYPE.DICH_VU ? true : false}
              InputLabelProps={{
                shrink: true,
              }}
              value={quantity}
              onChange={(e) => handleSetQuantity(e.target.value)}
              required
            />
          </Box>
          <Button
            style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', width: '100%' }}
            onClick={handleAddProductToList}
          >
            Thêm
          </Button>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: '60px',
            }}
          >
            <p style={{ width: 200 }}>Phí dịch vụ: </p>
            <TextField
              id="additionPrice"
              label="Addition Price"
              type="Number"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={additionPrice}
              onChange={(e) => setAdditionPrice(e.target.value)}
              required
            />
          </Box>
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

function ExistProductInCart({ productExist, title }) {
  console.log('productExist', productExist);
  return (
    <TableContainer component={Paper}>
      <h4 style={{ marginBottom: 20, color: 'red' }}>{title}</h4>
      <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Mã SP</TableCell>
            <TableCell align="center">Tên</TableCell>
            <TableCell align="center">Giá</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="center">Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productExist?.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="center">
                {row?.product?.id}
              </TableCell>
              <TableCell align="center">{row?.product?.name}</TableCell>
              <TableCell align="center">{formatMoneyWithDot(row?.price)}</TableCell>
              <TableCell align="center">{row?.quantity}</TableCell>
              <TableCell align="center">{formatMoneyWithDot(row?.price * row?.quantity)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function DenseTable({ productAdd, title }) {
  console.log('productAdd', productAdd);
  return (
    <TableContainer component={Paper}>
      <h4 style={{ marginBottom: 20, marginTop: 60, color: 'red' }}>{title}</h4>
      <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Mã SP</TableCell>
            <TableCell align="center">Tên</TableCell>
            <TableCell align="center">Giá</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="center">Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productAdd?.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="center">
                {row?.id}
              </TableCell>
              <TableCell align="center">{row?.name}</TableCell>
              <TableCell align="center">{formatMoneyWithDot(row?.price)}</TableCell>
              <TableCell align="center">{row?.quantity}</TableCell>
              <TableCell align="center">{formatMoneyWithDot(row?.totalPrice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
