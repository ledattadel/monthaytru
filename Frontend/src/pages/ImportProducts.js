import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import AppToast from '../myTool/AppToast';

// components
import formatMoneyWithDot from '../utils/formatMoney';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import { deleteProductAPI, getAllCartAPI, getAllProductAPI } from '../components/services/index';
import ProductDialog from 'src/dialog/Product/ProductDialog';
import ProductEditDialog from 'src/dialog/Product/ProductEditDialog';
import { Vi } from 'src/_mock/Vi';
import ImportProductDialog from 'src/dialog/ImportProduct/ImportProductDialog';
import ImportProductEditDialog from 'src/dialog/ImportProduct/ImportProductEditDialog';
import { formatCreate } from 'src/utils/formatTime';
import DetailImportProductDialog from 'src/dialog/ImportProduct/DetailImportProductDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'accessoryId', label: 'ID', alignRight: false },
  // { id: 'image', label: 'Image', alignRight: false },
  { id: 'name', label: Vi.createName, alignRight: false },
  { id: 'createAt', label: Vi.createAt, alignRight: false },
  { id: 'supplier', label: Vi.supplier, alignRight: false },
  { id: 'price', label: Vi.totalPriceImport, alignRight: false },
  { id: 'detail', label: Vi.detail, alignRight: false },
  // { id: 'accessoryType', label: 'Product Type', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => {
      return (
        _user?.purchaseOrderDetails?.[0]?.productDetail?.supplier?.name.toLowerCase().indexOf(query.toLowerCase()) !==
        -1
      );
    });
  }
  return stabilizedThis?.map((el) => el[0]);
  // return array;
}

export default function ImportProducts() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [contentToast, setContentToast] = useState('');
  const [severity, setSeverity] = useState('');
  const [listProduct, setListProduct] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({});

  const deleteAPI = async (id) => {
    try {
      const res = await deleteProductAPI(id);
      if (res.status === 200) {
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        getAllProduct();
      } else {
        setContentToast(res?.data);
        setSeverity('error');
        setOpenToast(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProduct = async () => {
    try {
      const res = await getAllCartAPI();
      if (res?.data?.purchaseOrders?.length > 0) {
        setListProduct(res?.data?.purchaseOrders);
      }
      // console.log('pon console', res?.data?.purchaseOrders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listProduct.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listProduct.length) : 0;
  const filteredUsers = applySortFilter(listProduct, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers?.length === 0;

  // -------------------------------------------------------------------------------------------------------------

  const handleAddProduct = () => {
    setOpenDialog(true);
  };

  const totalPriceImportProduct = (data) => {
    const totalMoney = data?.reduce(
      (a, b) => a * 1 + parseInt(b?.productDetail?.PurchasePrice || '0.0') * b?.Quantity,
      0
    );
    // listProductAdd?.forEach((e)=>{
    // parseInt(item?.productDetail?.PurchasePrice || '0.0') * item?.Quantity
    //   const total =
    // })
    return totalMoney;
  };

  return (
    <Page title="Product">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {Vi.importProduct}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddProduct}
          >
            {Vi.createImportProduct}
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listProduct?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      OrderID,
                      name,
                      staff,
                      quantity,
                      OrderDate,
                      purchaseOrderDetails,
                      price,
                      manufacturer,
                      accessoryType,
                    } = row;

                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={OrderID}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}

                        <TableCell align="center" />
                        <TableCell align="center">{OrderID}</TableCell>
                        {/* <TableCell align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                          {
                            <img
                              width="180px"
                              height="100px"
                              src={
                                image
                                  ? `http://localhost:5001/api/image/${image?.filename}`
                                  : require('../assets/images/bg1.png')
                              }
                              alt="detailImage"
                            />
                          }
                        </TableCell> */}
                        <TableCell align="center">{staff?.name}</TableCell>
                        <TableCell align="center">{OrderDate}</TableCell>
                        <TableCell align="center">{purchaseOrderDetails?.[0]?.productDetail?.supplier?.name}</TableCell>
                        <TableCell align="center">
                          {formatMoneyWithDot(totalPriceImportProduct(purchaseOrderDetails))}
                        </TableCell>
                        {/* <TableCell align="center">{manufacturer?.name}</TableCell> */}
                        <TableCell align="center">
                          <Button
                            onClick={() => {
                              setOpenDialogEdit(true);
                              setCurrentProduct(row);
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>

                        {/* <TableCell align="right">
                          <UserMoreMenu
                            id={OrderID}
                            name={staff?.name}
                            entity={row}
                            type={'sản phẩm'}
                            deleteAPI={deleteAPI}
                            setSeverity={setSeverity}
                            setOpenToast={setOpenToast}
                            setOpenDialog={setOpenDialog}
                            setContentToast={setContentToast}
                            setOpenDialogEdit={setOpenDialogEdit}
                            setCurrentEntity={setCurrentProduct}
                          />
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={listProduct?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ImportProductDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        getAllProduct={getAllProduct}
        setContentToast={setContentToast}
        setSeverity={setSeverity}
        setOpenToast={setOpenToast}
      />
      <DetailImportProductDialog
        product={currentProduct}
        openDialog={openDialogEdit}
        setOpenDialog={setOpenDialogEdit}
        getAllProduct={getAllProduct}
        setContentToast={setContentToast}
        setSeverity={setSeverity}
        setOpenToast={setOpenToast}
      />
      <AppToast
        content={contentToast}
        type={0}
        isOpen={openToast}
        severity={severity}
        callback={() => {
          setOpenToast(false);
        }}
      />
    </Page>
  );
}
