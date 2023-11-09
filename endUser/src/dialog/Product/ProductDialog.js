// import * as React from 'react';
// import { Button, Box } from '@mui/material';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import { addNewProductAPI, getAllManufacturerAPI, getAllAccessoryTypeAPI } from 'src/components/services';

// export default function ProductDialog(props) {
//   const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast } = props;
//   const [name, setName] = React.useState();
//   // const [quantity, setQuantity] = React.useState();
//   const [price, setPrice] = React.useState();
//   // const [manufacturer, setManufacturer] = React.useState();
//   const [accessoryType, setAccessoryType] = React.useState();
//   const [description, setDescription] = React.useState();
//   const [isError, setIsError] = React.useState(false);
//   // const [listManufacturer, setListManufacturer] = React.useState([]);
//   const [listAccessoryType, setListAccessoryType] = React.useState([]);
//   const [selectedFile, setSelectedFile] = React.useState();
//   const [imageUrl, setImageUrl] = React.useState();

//   const addNewProduct = async (data) => {
//     try {
//       const res = await addNewProductAPI(data);
//       if (res.status === 200) {
//         setName(null);
//         // setQuantity(null);
//         setPrice(null);
//         // setManufacturer(null);
//         setAccessoryType(null);
//         setDescription(null);
//         setContentToast(res?.data);
//         setSeverity('success');
//         setOpenToast(true);
//         setOpenDialog(false);
//         getAllProduct();
//       } else {
//         setContentToast('Thêm product thất bại');
//         setOpenToast(true);
//         setSeverity('error');
//       }
//     } catch (error) {
//       console.log(error);
//       setContentToast('Thêm product thất bại');
//       setOpenToast(true);
//       setSeverity('error');
//     }
//   };

//   const getAllManufacturer = async () => {
//     try {
//       const res = await getAllManufacturerAPI();
//       // setListManufacturer(res?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getAllAccessoryType = async () => {
//     try {
//       const res = await getAllAccessoryTypeAPI();
//       // setListAccessoryType(res?.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   React.useEffect(() => {
//     getAllManufacturer();
//     getAllAccessoryType();
//   }, []);

//   const handleClose = () => {
//     setOpenDialog(false);
//     setName(null);
//     // setQuantity(null);
//     setPrice(null);
//     // setManufacturer(null);
//     setAccessoryType(null);
//     setDescription(null);
//   };

//   const handleAddProduct = () => {
//     if (!name || !price || !accessoryType || !description) {
//       setIsError(true);
//     } else {
//       setIsError(false);
//       //const data = {
//       //  name,
//       //  quantity,
//       //  price,
//       //  manufacturer,
//       //  accessoryType,
//       //  productType: 2,
//       //	image: selectedFile,
//       //  description: [
//       //    {
//       //      type: 'Content',
//       //      description: description || '',
//       //    },
//       //  ],
//       //};
//       const bodyFormData = new FormData();
//       bodyFormData.append('name', name);
//       // bodyFormData.append('quantity', quantity);
//       bodyFormData.append('price', price);
//       // bodyFormData.append('manufacturer', manufacturer);
//       bodyFormData.append('accessoryType', accessoryType);
//       bodyFormData.append('productType', 2);
//       bodyFormData.append('image', selectedFile);
//       bodyFormData.append('description', description);

//       // CALL API add new product
//       addNewProduct(bodyFormData);
//     }
//   };

//   const handleUploadImage = (e) => {
//     let file = e.target.files[0];
//     const reader = new FileReader();

//     reader.addEventListener(
//       'load',
//       () => {
//         setImageUrl(reader.result);
//       },
//       false
//     );

//     if (file) {
//       reader.readAsDataURL(file);
//       setSelectedFile(file);
//     }
//   };

//   return (
//     <div>
//       <Dialog open={openDialog} onClose={handleClose}>
//         <DialogTitle>Tạo mới sản phẩm</DialogTitle>
//         <DialogContent sx={{ height: 650, width: 500 }}>
//           <TextField
//             margin="dense"
//             id="name"
//             label="Tên sản phẩm"
//             type="text"
//             fullWidth
//             variant="outlined"
//             sx={{ mt: 2 }}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               mt: 2,
//             }}
//           >
//             {/* <TextField
//               autoFocus
//               id="quantity"
//               label="Quantity"
//               type="number"
//               size="medium"
//               sx={{ width: 500, mr: 2 }}
//               onChange={(e) => setQuantity(e.target.value)}
//               required
//             /> */}
//             <TextField
//               id="price"
//               label="Giá"
//               type="Number"
//               fullWidth
//               onChange={(e) => setPrice(e.target.value)}
//               required
//             />
//           </Box>
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               mt: 2,
//             }}
//           >
//             {/* <Autocomplete
//               disablePortal
//               id="manufacturer"
//               options={listManufacturer}
//               getOptionLabel={(option) => option?.name}
//               sx={{ width: 500, mr: 2 }}
//               onChange={(e, newValue) => {
//                 setManufacturer(newValue?.id);
//               }}
//               renderInput={(params) => <TextField {...params} label="Manufacturer" />}
//             /> */}
//             <Autocomplete
//               disablePortal
//               id="accessoryType"
//               options={listAccessoryType}
//               getOptionLabel={(option) => option?.name}
//               fullWidth
//               onChange={(e, newValue) => {
//                 setAccessoryType(newValue?.id);
//               }}
//               renderInput={(params) => <TextField {...params} label="Hãng" />}
//             />
//           </Box>
//           <TextField
//             margin="dense"
//             id="description"
//             label="Mô tả"
//             minRows={10}
//             multiline
//             fullWidth
//             variant="outlined"
//             sx={{ mt: 4 }}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />

//           <p
//             style={{
//               margin: '10px',
//               color: 'red',
//               fontWeight: 'Bold',
//               justifyContent: 'flex-end',
//               display: isError ? 'flex' : 'none',
//             }}
//           >
//             Nhập đủ thông tin
//           </p>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Huỷ</Button>
//           <Button onClick={handleAddProduct} type="submit">
//             Tạo sản phẩm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

import * as React from 'react';
import { Button, Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { addNewProductAPI, getAllBrand, getAllAccessoryTypeAPI } from '../../components/services/index';
import { Vi } from 'src/_mock/Vi';

export default function ProductDialog(props) {
  const { openDialog, setOpenDialog, getAllProduct, setContentToast, setSeverity, setOpenToast } = props;
  const [name, setName] = React.useState();
  const [quantity, setQuantity] = React.useState();
  const [price, setPrice] = React.useState();
  const [brand, setBrand] = React.useState();
  const [description, setDescription] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [isErrors, setIsErrors] = React.useState(false);
  const [listBrand, setListBrand] = React.useState([]);

  const addNewProduct = async (data) => {
    try {
      const res = await addNewProductAPI(data);
      let errorMessage = res.message || Vi.createProductFail;
      let successMessage = res.message || Vi.createProductSucces;
      if (res.status === 201) {
        setName(null);
        setQuantity(null);
        setPrice(null);
        setBrand(null);
        setDescription(null);
        setContentToast(successMessage);
        setSeverity('success');
        setOpenToast(true);
        setOpenDialog(false);
        getAllProduct();
      } else {
        setContentToast(errorMessage);
        setOpenToast(true);
        setSeverity('error');
      }
    } catch (error) {
      console.log(error);
      setContentToast(Vi.createProductFail);
      setOpenToast(true);
      setSeverity('error');
    }
  };

  const fetchAllBrand = async () => {
    try {
      const res = await getAllBrand();
      setListBrand(res?.data);
      // console.log("res:::",res);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllAccessoryType = async () => {
    try {
      // const res = await getAllAccessoryTypeAPI();
      // setListAccessoryType(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    // getAllManufacturer();
    // getAllAccessoryType();
    fetchAllBrand();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
    setName(null);
    setQuantity(null);
    setPrice(null);
    setBrand(null);
    // setAccessoryType(null);
    setDescription(null);
  };

  const handleAddProduct = () => {
    if (!name?.trim() || !price || !brand) {
      console.log(quantity, name, price, brand);
      setIsError(true);
    } else {
      setIsError(false);

      const data = {
        ProductName: name,
        ProductDescription: description,
        BrandName: brand,
        Unit: quantity,
        Price: price,
      };

      addNewProduct(data);
    }
  };

  const onlyNumber = (value) => {
    const pattern = /^\d+$/;
    let flat = false;
    if (pattern.test(value)) {
      flat = true;
    } else if (value === '') {
      setPrice('');
    }
    return flat;
  };
  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        {/* <DialogTitle>Tạo mới sản phẩm</DialogTitle> */}
        <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>Tạo mới sản phẩm</DialogTitle>

          <Button onClick={() => setOpenDialog(false)}>X</Button>
        </Box>
        <DialogContent sx={{ height: 650 }}>
          <TextField
            margin="dense"
            id="name"
            label="Tên sản phẩm"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
            }}
          >
            {/* <TextField
              autoFocus
              id="quantity"
              label="Số lượng"
              type="number"
              size="medium"
              sx={{ width: 500, mr: 2 }}
              onChange={(e) => setQuantity(e.target.value)}
              required
            /> */}
            <TextField
              id="price"
              label="Giá"
              // type="number"
              // type="number"
              fullWidth
              onChange={(e) => {
                if (!onlyNumber(e.target.value)) {
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
              value={price}
            />
          </Box>
          {isErrors ? <Typography style={{ color: 'red' }}>Gía phải lớn hơn 1.000d</Typography> : null}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
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
          </Box>
          <TextField
            margin="dense"
            id="description"
            label="Description"
            minRows={10}
            multiline
            fullWidth
            variant="outlined"
            sx={{ mt: 4 }}
            onChange={(e) => setDescription(e.target.value)}
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
            Vui lòng điền đủ thông tin
          </p>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Huỷ</Button> */}
          <Button onClick={handleAddProduct} type="submit">
            Tạo sản phẩm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
