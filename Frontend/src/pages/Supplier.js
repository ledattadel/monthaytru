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
import ProductDialog from '../dialog/ProductDialog';
import ProductEditDialog from '../dialog/ProductEditDialog';

// components
import formatMoneyWithDot from '../utils/formatMoney';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import { deleteProductAPI, deleteSupplierAPI, getAllProductAPI, getAllSupplierAPI } from '../components/services/index';
import BrandDialog from 'src/dialog/Brand/BrandDialog';
import BrandEditDialog from 'src/dialog/Brand/BrandEditDialog';
import { Vi } from 'src/_mock/Vi';
import SupplierDialog from 'src/dialog/Supplier/SupplierDialog';
import SupplierEditDialog from 'src/dialog/Supplier/SupplierEditDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'brandId', label: 'ID', alignRight: false },
  { id: 'name', label: Vi.nameSupplier, alignRight: false },
  { id: 'phoneNumber', label: Vi.phoneNumberSupplier, alignRight: false },
  { id: 'address', label: Vi.addressSupplier, alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Supplier() {
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
  const [listProduct, setListProduct] = useState([
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
  const [currentProduct, setCurrentProduct] = useState({});

  const deleteAPI = async (id) => {
    try {
      const res = await deleteSupplierAPI(id);
      let errorMessage = res.message || 'Xoá nhà cung cấp thất bại';
      let successMessage = res.message || 'Xoá nhà cung cấp thành công';

      if (res.status === 200) {
        setContentToast(successMessage);
        setSeverity('success');
        setOpenToast(true);
        getAllProduct();
      } else {
        setContentToast(errorMessage);
        setSeverity('error');
        setOpenToast(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllProduct = async () => {
    try {
      const res = await getAllSupplierAPI();
      //
      if (res) {
        setListProduct(res?.data);
      }
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

  return (
    <Page title="Product">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {Vi.supplier}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddProduct}
          >
            {Vi.addNewSupplier}
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
                    const { SupplierID, name, phoneNumber, address } = row;

                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={SupplierID}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}

                        <TableCell align="center" />
                        <TableCell align="center">{SupplierID}</TableCell>

                        <TableCell align="center">{name}</TableCell>
                        <TableCell align="center">{phoneNumber}</TableCell>
                        <TableCell align="center">{address}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            id={SupplierID}
                            name={name}
                            entity={row}
                            type={'nhà cung cấp'}
                            deleteAPI={deleteAPI}
                            setSeverity={setSeverity}
                            setOpenToast={setOpenToast}
                            setOpenDialog={setOpenDialog}
                            setContentToast={setContentToast}
                            setOpenDialogEdit={setOpenDialogEdit}
                            setCurrentEntity={setCurrentProduct}
                          />
                        </TableCell>
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
      <SupplierDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        getAllProduct={getAllProduct}
        setContentToast={setContentToast}
        setSeverity={setSeverity}
        setOpenToast={setOpenToast}
      />
      <SupplierEditDialog
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
