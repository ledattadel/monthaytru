import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  Collapse,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import AppToast from '../myTool/AppToast';
import SaleDialog from '../dialog/SaleDialog';
import ProductSaleDialog from '../dialog/ProductSaleDialog';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import formatMoneyWithDot from '../utils/formatMoney';

import KeyboardArrowUpIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/ArrowUpward';
// mock
//import { deleteProductAPI, getAllServicesAPI } from '../components/services/index';
import { deleteProductAPI, getAllSaleAPI, getSaleDescriptionAPI } from '../components/services/index';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Sale ID', alignRight: false },
  { id: 'startTime', label: 'Start Time', alignRight: false },
  { id: 'endTime', label: 'End Time', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b?.[orderBy] < a?.[orderBy]) {
    return -1;
  }
  if (b?.[orderBy] > a?.[orderBy]) {
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
    return filter(array, (_user) => _user?.description.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Service() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openToast, setOpenToast] = useState(false);
  const [contentToast, setContentToast] = useState('');
  const [severity, setSeverity] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogAddProductSale, setOpenDialogAddProductSale] = useState(false);

  const [listSale, setListSale] = useState();

  const getAllSale = async () => {
    try {
      const res = await getAllSaleAPI();
      setListSale(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAPI = async (id) => {
    try {
      const res = await deleteProductAPI(id);
      if (res.status === 200) {
        console.log('res', res);
        setContentToast(res?.data);
        setSeverity('success');
        setOpenToast(true);
        getAllSale();
      } else {
        setContentToast(res?.data);
        setSeverity('error');
        setOpenToast(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSale();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listSale.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listSale.length) : 0;
  const filteredUsers = applySortFilter(listSale, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers?.length === 0;

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Sales
          </Typography>
          <div>
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setOpenDialogAddProductSale(true)}
              sx={{ mr: 2 }}
            >
              Add Sale To Product
            </Button>
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setOpenDialog(true)}
              //onClick={handleAddSale}
            >
              Add New Sale
            </Button>
          </div>
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
                  rowCount={listSale?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => {
                    return <Row row={row} key={index} />;
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
            count={listSale?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <SaleDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        getAllSale={getAllSale}
        setContentToast={setContentToast}
        setSeverity={setSeverity}
        setOpenToast={setOpenToast}
      />
      <ProductSaleDialog
        openDialog={openDialogAddProductSale}
        setOpenDialog={setOpenDialogAddProductSale}
        getAllSale={getAllSale}
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

function Row(props) {
  const { row } = props;
  const { id, startTime, endTime, description } = row || {};

  const [open, setOpen] = useState(false);
  const [saleDescription, setSaleDescription] = useState([]);

  function formatDate(str) {
    const date = str?.split('T');
    const day = date?.[0]?.split('-');
    return `${day?.[2]}/${day?.[1]}/${day?.[0]}`;
  }

  const getSaleDescription = async (id) => {
    try {
      const res = await getSaleDescriptionAPI(id);
      setSaleDescription(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    setOpen(!open);
    getSaleDescription(id);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleClick}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{id}</TableCell>
        <TableCell align="center">{formatDate(startTime)}</TableCell>
        <TableCell align="center">{formatDate(endTime)}</TableCell>
        <TableCell align="center">{description}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {saleDescription?.length > 0 ? (
              <Box sx={{ margin: 4 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Sản phẩm
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Tên sản phẩm</TableCell>
                      <TableCell align="center">Sale dịp</TableCell>
                      <TableCell align="center">Phần trăm sale</TableCell>
                      <TableCell align="center">Giá trước sale</TableCell>
                      <TableCell align="center">Giá sau sale</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleDescription?.map((value) => (
                      <TableRow key={value?.saleId}>
                        <TableCell align="center" component="th" scope="row" sx={{ width: '400px' }}>
                          {value?.product?.name}
                        </TableCell>
                        <TableCell align="center">{value?.sale?.description}</TableCell>
                        <TableCell align="center">{value?.salePercent}</TableCell>
                        <TableCell align="center">{formatMoneyWithDot(value?.product?.price)}</TableCell>
                        <TableCell align="center">
                          {formatMoneyWithDot(
                            value?.product?.price - (value?.product?.price * value?.salePercent) / 100
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : null}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
