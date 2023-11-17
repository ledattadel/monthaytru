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

export default function ImportProductDialog(props) {
  const { openDialog, setOpenDialog } = props;

  const [openToastHere, setOpenToastHere] = useState(false);
  const [contentToastHere, setContentToastHere] = useState('');
  const [severityHere, setSeverityHere] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isErrors, setIsErrors] = React.useState(false);

  /// services/product

  const [listProduct, setListProduct] = useState([
    {
      ProductID: 3,
      ProductName: 'Test sản phẩm',
      ProductDescription: 'sản phẩm test',
      Price: '1000.00',
      isActive: true,
      BrandId: 2,
      Unit: '15',
      brand: {
        BrandID: 2,
        BrandName: 'Toyota',
        isActive: true,
      },
    },
    {
      ProductID: 4,
      ProductName: 'sản phẩm test\t',
      ProductDescription: 'sản phẩm test\t',
      Price: '100000.00',
      isActive: true,
      BrandId: 3,
      Unit: null,
      brand: {
        BrandID: 3,
        BrandName: 'Honda after edit',
        isActive: true,
      },
    },
    {
      ProductID: 5,
      ProductName: 'Test sản phẩm\t',
      ProductDescription: 'Test sản phẩm\t',
      Price: '1000000.00',
      isActive: true,
      BrandId: 1,
      Unit: null,
      brand: {
        BrandID: 1,
        BrandName: 'Edited',
        isActive: true,
      },
    },
    {
      ProductID: 6,
      ProductName: 'kính xe',
      ProductDescription: 'kính xe nè',
      Price: '1000000.00',
      isActive: true,
      BrandId: 2,
      Unit: null,
      brand: {
        BrandID: 2,
        BrandName: 'Toyota',
        isActive: true,
      },
    },
    {
      ProductID: 7,
      ProductName: 'kính xe o to',
      ProductDescription: 'kính xe o to',
      Price: '1000000.00',
      isActive: true,
      BrandId: 1,
      Unit: null,
      brand: {
        BrandID: 1,
        BrandName: 'Edited',
        isActive: true,
      },
    },
  ]);
  const [listBrand, setListBrand] = useState([]);
  const [listSupplier, setListSupplier] = useState([
    {
      SupplierID: 2,
      name: 'ông năm - Chợ bà chiểu 123',
      phoneNumber: '0775992477',
      address: 'chợ bà chiểu',
      isActive: true,
    },
    {
      SupplierID: 4,
      name: 'ông năm - Chợ bà chiểu 3',
      phoneNumber: '0775992477',
      address: 'chợ bà chiểu',
      isActive: true,
    },
    {
      SupplierID: 5,
      name: 'ông năm - Chợ bà chiểu 2',
      phoneNumber: '0775992477',
      address: 'chợ bà chiểu',
      isActive: true,
    },
    {
      SupplierID: 6,
      name: 'ông năm - Chợ bà chiểu 12',
      phoneNumber: '0775992477',
      address: 'chợ bà chiểu',
      isActive: true,
    },
  ]);
  const [supplierChoose, setSupplierChoose] = useState();
  const InfoAdmin = JSON.parse(localStorage.getItem('profileAdmin'));
  const [isAddProduct, setIsAddProduct] = useState(false);
  ///
  const [createAt, setCreateAt] = useState();

  //
  const [name, setName] = React.useState();
  const [price, setPrice] = React.useState();
  const [brand, setBrand] = React.useState();
  const [description, setDescription] = React.useState();

  const [inforProduct, setInfoProduct] = useState({
    quantity: '',
    purchasePrice: '',
  });
  const [listProductAdd, setListProductAdd] = useState([]);

  ///

  const getAllSupplier = async () => {
    try {
      const res = await getAllSupplierAPI();
      //
      if (res) {
        setListSupplier(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAllProduct = async () => {
    try {
      const res = await getAllProductAPI();
      setListProduct(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllBrand = async () => {
    try {
      const res = await getAllBrandAPI();
      setListBrand(res?.data);
      // console.log("res:::",res);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setCreateAt(moment().format('DD-MM-yyyy hh:mm'));
    getAllSupplier();
    getAllProduct();
    fetchAllBrand();
  }, []);

  const totalPayment = React.useMemo(() => {
    const totalMoney = listProductAdd.reduce((a, b) => a * 1 + b?.purchasePrice * b?.quantity, 0);
    // listProductAdd?.forEach((e)=>{
    //   const total =
    // })
    return totalMoney;
  }, [listProductAdd]);

  const handleClose = () => {
    setListProductAdd([]);
    setIsError(false);
    setErrorMsg('');

    setOpenDialog(false);
  };

  const addNewProduct = async (data) => {
    try {
      const res = await addNewProductAPI(data);
      let errorMessage = res.message || 'Thêm sản phẩm thất bại';
      let successMessage = res.message || 'Thêm sản phẩm thành công';
      if (res.status === 201) {
        setName(null);
        setPrice(null);
        setBrand(null);
        setDescription(null);
        setContentToastHere(successMessage);
        setSeverityHere('success');
        setOpenToastHere(true);
        // setOpenDialog(false);
        getAllProduct();
        setIsAddProduct(false);
      } else {
        setContentToastHere(errorMessage);
        setOpenToastHere(true);
        setSeverityHere('error');
      }
    } catch (error) {
      console.log(error);
      setContentToastHere('Thêm product thất bại');
      setOpenToastHere(true);
      setSeverityHere('error');
    }
  };
  const handleAddNewProduct = () => {
    if (!name || !price || !brand) {
      setContentToastHere('Vui lòng nhập đủ thông tin sản phẩm');
      setSeverityHere('error');
      setOpenToastHere(true);
    } else {
      const data = {
        ProductName: name,
        ProductDescription: description,
        BrandName: brand,
        Price: price,
      };
      getAllProduct();
      addNewProduct(data);
    }
  };

  const handleAddProduct = () => {
    const flat = listProductAdd?.filter((e) => e?.ProductID === inforProduct?.ProductID);
    if (!inforProduct?.ProductID || inforProduct?.purchasePrice === '' || !inforProduct?.quantity === '') {
      setContentToastHere('Vui lòng nhập đủ thông tin');
      setOpenToastHere(true);
      setSeverityHere('error');
    } else if (flat?.length > 0) {
      setErrorMsg(Vi.productIsExit);
      setInfoProduct({
        purchasePrice: '',
        quantity: '',
      });
    } else if (inforProduct?.purchasePrice % 1000 !== 0) {
      setErrorMsg(Vi.price1000);
    } else {
      const product = [...listProductAdd];
      product.push(inforProduct);
      setListProductAdd(product);
      setInfoProduct({
        ...inforProduct,
        purchasePrice: '',
        quantity: '',
      });
    }
  };

  const addNewImportProduct = async (data) => {
    try {
      const res = await addNewImportProductAPI(data);
      let errorMessage = res.message || 'Thêm phiếu nhập thất bại';
      let successMessage = res.message || 'Thêm  phiếu nhập thành công';
      if (res.status === 201) {
        setName(null);
        setPrice(null);
        setBrand(null);
        setDescription(null);
        setContentToastHere(successMessage);
        setSeverityHere('success');
        setOpenToastHere(true);
        setOpenDialog(false);
        getAllProduct();
        handleClose();
      } else {
        setContentToastHere(errorMessage);
        setOpenToastHere(true);
        setSeverityHere('error');
      }
    } catch (error) {}
  };

  const handleNext = () => {
    if (!supplierChoose?.SupplierID) {
      setContentToastHere(Vi.chooseSupplier);
      setSeverityHere('error');
      setOpenToastHere(true);
    } else if (listProductAdd?.length === 0) {
      setContentToastHere(Vi.listProductAddNull);
      setSeverityHere('error');
      setOpenToastHere(true);
    } else {
      const newList = [];
      listProductAdd?.forEach((e) => {
        const tempProduct = {
          productID: e?.ProductID,
          supplierId: supplierChoose?.SupplierID,
          purchasePrice: e?.purchasePrice,
          sellingPrice: e?.Price,
          quantity: e?.quantity,
        };
        newList?.push(tempProduct);
      });
      const data = {
        userId: InfoAdmin?.userId,
        // supplierId: supplierChoose?.SupplierID,
        createAt: moment()?.format('DD-MM-yyyy hh:mm'),
        listProduct: [...newList],
      };
      addNewImportProduct(data);
      console.log('pon console', data);
    }
  };

  const removeProduct = (ProductID) => {
    const listTemp = [...listProductAdd];
    const listNewProduct = listTemp?.filter((e) => e?.ProductID !== ProductID);

    setListProductAdd(listNewProduct);
  };

  const handleDataProduct = (field, value) => {
    if (field === 'quantity') {
      if (!onlyNumber(value)) {
        if (value === '') {
          setErrorMsg(Vi.quantityMore0);
          const tempDate = { ...inforProduct, quantity: '' };
          setInfoProduct(tempDate);
        }
      } else if (value > 100 || value === 0 || value === '') {
        setErrorMsg(Vi.quantityMore0);
        const tempDate = { ...inforProduct, [field]: value };
        setInfoProduct(tempDate);
      } else {
        const tempDate = { ...inforProduct, [field]: value };
        setInfoProduct(tempDate);
        setErrorMsg('');
      }
    } else if (field === 'purchasePrice') {
      if (!onlyNumber(value)) {
        if (value === '') {
          const tempDate = { ...inforProduct, [field]: value };
          setInfoProduct(tempDate);
        }
      } else if (value?.length < 4) {
        setErrorMsg(Vi.pusecharprice);
        const tempDate = { ...inforProduct, [field]: value };
        setInfoProduct(tempDate);
      } else if (value === '') {
        if (field === 'product') {
          const tempDate = { ...inforProduct, ...value };
          setInfoProduct(tempDate);
        } else {
          const tempDate = { ...inforProduct, [field]: value };
          setInfoProduct(tempDate);
        }
      } else {
        const tempDate = { ...inforProduct, [field]: value };
        setInfoProduct(tempDate);
        setErrorMsg('');
      }
    } else {
      if (field === 'product') {
        const tempDate = { ...inforProduct, ...value };
        setInfoProduct(tempDate);
      } else {
        const tempDate = { ...inforProduct, [field]: value };
        setInfoProduct(tempDate);
      }
    }
  };
  const onlyNumber = (value) => {
    const pattern = /^\d+$/;
    let flat = false;
    if (pattern.test(value)) {
      flat = true;
    }
    return flat;
  };

  const onlyNumber1 = (value) => {
    const pattern = /^\d+$/;
    let flat = false;
    if (pattern.test(value)) {
      flat = true;
    } else if (value === '') {
      setPrice('');
    }
    return flat;
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
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.ProductID}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 168, justifyContent: 'space-between' }}>
            <Typography style={{ width: 130, textAlign: 'center' }}>{item?.ProductName}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 146, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item?.brand?.BrandName}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 140, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>
              {formatMoneyWithDot(item?.purchasePrice)}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 100, justifyContent: 'space-between' }}>
            <Typography style={{ width: 100, textAlign: 'center' }}>{item.quantity}</Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Box style={{ display: 'flex', padding: 4, width: 156, justifyContent: 'space-between' }}>
            <Typography style={{ width: 140, textAlign: 'center' }}>
              {formatMoneyWithDot(item.purchasePrice * item?.quantity || 0)}
            </Typography>
            <Box style={{ height: 25, width: 1, backgroundColor: 'grey', marginLeft: 6 }} />
          </Box>
          <Button style={{ display: 'flex', padding: 4, width: 40, justifyContent: 'space-between' }}>
            <Typography onClick={() => removeProduct(item?.ProductID)} style={{ width: 100, textAlign: 'center' }}>
              X
            </Typography>
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
    <div style={{ width: '1800px' }}>
      <Dialog open={openDialog} onClose={handleClose} maxWidth={'1500px'}>
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{Vi.addNewImportProduct}</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
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
                value={InfoAdmin?.name}
                size="small"
                //   onChange={(e) => handleDataCustomer(e.target.value)}
                required
              />

              <Autocomplete
                disablePortal
                id="supplier"
                options={listSupplier}
                getOptionLabel={(option) => option?.name}
                sx={{ width: 200, mr: 2 }}
                onChange={(e, newValue) => {
                  setSupplierChoose(newValue);
                }}
                size="small"
                // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
                renderInput={(params) => <TextField {...params} label={Vi.supplier} />}
              />
            </Box>
          </Box>

          <Typography style={{ fontSize: 14, marginTop: 24, marginBottom: 12 }}>{Vi.addProductService}</Typography>
          <Box style={{ display: 'flex' }}>
            <Autocomplete
              disablePortal
              id="nameService"
              options={listProduct}
              getOptionLabel={(option) => `${option?.ProductName} - ${option?.brand?.BrandName} -${option?.Price}đ`}
              sx={{ width: 350, mr: 2 }}
              onChange={(e, newValue) => {
                setErrorMsg('');
                handleDataProduct('product', newValue);
              }}
              size="small"
              // defaultValue={ENUM_PRODUCT_TYPE?.[0]}
              renderInput={(params) => <TextField {...params} label={Vi.nameProduct} />}
            />

            <TextField
              id="quantity"
              label={Vi.quantity}
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              required
              value={inforProduct?.quantity}
              size="small"
              style={{ width: 150 }}
              onChange={(e) => handleDataProduct('quantity', e.target.value)}
            />
            <TextField
              id="purchasePrice"
              label={'Giá nhập'}
              sx={{ mr: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              required
              value={inforProduct?.purchasePrice || ''}
              size="small"
              style={{ width: 180 }}
              onChange={(e) => handleDataProduct('purchasePrice', e.target.value)}
            />

            <Button variant="outlined" sx={{ mr: 2 }} onClick={handleAddProduct} size="small" type="submit">
              {Vi.add}
            </Button>
            <Button variant="outlined" onClick={() => setIsAddProduct(true)} size="small" type="submit">
              {Vi.addNewProduct}
            </Button>
          </Box>
          {errorMsg ? <Typography style={{ color: 'red', marginTop: 12 }}>{errorMsg}</Typography> : null}
          {isAddProduct ? (
            <Box style={{ height: 350, marginTop: 30 }}>
              <Box>Tạo mới sản phẩm</Box>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <TextField
                    margin="dense"
                    id="name"
                    label="Tên sản phẩm"
                    type="text"
                    // fullWidth
                    variant="outlined"
                    // sx={{ mt: 2 }}
                    sx={{ width: 500, mr: 2 }}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <TextField
                    id="price"
                    label="Giá"
                    // type="Number"
                    sx={{ width: 500, mr: 2 }}
                    // fullWidth
                    value={price}
                    onChange={(e) => {
                      if (!onlyNumber1(e.target.value)) {
                        return;
                      } else {
                        if (e.target.value?.length < 4) {
                          setIsErrors(true);
                        } else {
                          setIsErrors(false);
                        }

                        setPrice(e.target.value);
                      }
                    }}
                    required
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    // alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Autocomplete
                    disablePortal
                    id="brand"
                    options={listBrand}
                    getOptionLabel={(option) => option?.BrandName}
                    sx={{ width: 500, mr: 2 }}
                    onChange={(e, newValue) => {
                      setBrand(newValue?.BrandName);
                    }}
                    renderInput={(params) => <TextField {...params} label="brand" />}
                  />
                  <TextField
                    margin="dense"
                    id="description"
                    label="Description"
                    minRows={4}
                    multiline
                    fullWidth
                    variant="outlined"
                    // sx={{ mt: 4 }}
                    sx={{ width: 500, mr: 2 }}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Box>

                <p
                  style={{
                    margin: '10px',
                    color: 'red',
                    fontWeight: 'Bold',
                    justifyContent: 'flex-end',
                    display: isError ? 'flex' : 'none',
                  }}
                >
                  Nhập đủ thông tin sản phẩm
                </p>
              </Box>
              {isErrors ? <Typography style={{ color: 'red' }}>Gía phải lớn hơn 1.000d</Typography> : null}
              <DialogActions>
                <Button onClick={() => setIsAddProduct(false)}>Huỷ</Button>
                <Button onClick={handleAddNewProduct} type="submit">
                  Tạo sản phẩm
                </Button>
              </DialogActions>
            </Box>
          ) : null}
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
          {/* <Button variant="outlined" onClick={handleClose}>
            {Vi.Cancel}
          </Button> */}

          <Button variant="outlined" onClick={handleNext} type="submit">
            Tạo phiếu nhập
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
