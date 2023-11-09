import * as React from 'react';
import { Button, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addNewProductSaleAPI, getAllSaleAPI, getAllProductAndServiceAPI } from '../components/services/index';

export default function ProductSaleDialog(props) {
  const { openDialog, setOpenDialog, setContentToast, setSeverity, setOpenToast } = props;
  const [isError, setIsError] = React.useState(false);

  const [percent, setPercent] = React.useState();
  const [listSale, setListSale] = React.useState();
  const [listProduct, setListProduct] = React.useState();
  const [saleItem, setSaleItem] = React.useState();
  const [productItem, setProductItem] = React.useState();

  const addNewProductSale = async (data) => {
    try {
      const res = await addNewProductSaleAPI(data);
      if (res.status === 200) {
        setPercent(null);
        setSaleItem(null);
        setProductItem(null);
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
      }
    } catch (error) {
      console.log(error);
      setContentToast('Thêm product thất bại');
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const getAllSale = async () => {
    try {
      const res = await getAllSaleAPI();
      // setListSale(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProductAndService = async () => {
    try {
      const res = await getAllProductAndServiceAPI();
      // setListProduct(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getAllSale();
    getAllProductAndService();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
    setPercent(null);
    setSaleItem(null);
    setProductItem(null);
  };

  const handleAddProduct = () => {
    if (!percent || !saleItem || !productItem) {
      setIsError(true);
    } else {
      setIsError(false);
      const data = {
        productId: productItem,
        saleId: saleItem,
        salePercent: percent,
      };

      // CALL API add new product
      addNewProductSale(data);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent sx={{ height: 550 }}>
          <Autocomplete
            disablePortal
            id="sale"
            options={listSale}
            getOptionLabel={(option) => option?.description}
            sx={{ width: 500, mt: 4 }}
            onChange={(e, newValue) => {
              setSaleItem(newValue?.id);
            }}
            renderInput={(params) => <TextField {...params} label="Sale" />}
          />
          <Autocomplete
            disablePortal
            id="product"
            options={listProduct}
            getOptionLabel={(option) => option?.name}
            sx={{ width: 500, mt: 4 }}
            onChange={(e, newValue) => {
              setProductItem(newValue?.id);
            }}
            renderInput={(params) => <TextField {...params} label="Product" />}
          />
          <TextField
            id="percent"
            label="Percent"
            type="Number"
            sx={{ mt: 4 }}
            fullWidth
            onChange={(e) => setPercent(e.target.value)}
            required
          />
          <p
            style={{
              margin: '10px',
              color: 'red',
              fontWeight: 'Bold',
              justifyContent: 'flex-end',
              display: isError ? 'flex' : 'none',
            }}
          >
            Please enter full information
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddProduct} type="submit">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
