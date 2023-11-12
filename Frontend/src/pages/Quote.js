import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// material
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
// components
import Iconify from '../components/Iconify';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import AppToast from '../myTool/AppToast';
import { UserBillMoreMenu, UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// import OrderEditDialog from '../dialog/OrderEditDialog';

import CreateReceipt from 'src/dialog/Receipt/CreateReceipt';
import { Vi } from 'src/_mock/Vi';
import {
  addNewInvoiceAPI,
  getAllQuoteAPI,
  getAllReceiptAPI,
  getAllStatusAPI,
  getUserInfoAPI,
} from '../components/services/index';
import EditReceipt from 'src/dialog/Receipt/EditReceipt';
import ReceiptDetail from 'src/dialog/Receipt/ReceiptDetail';
import QuoteDetail from 'src/dialog/Quote/QuoteDetail';
import formatMoneyWithDot from 'src/utils/formatMoney';
import moment from 'moment';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'cardId', label: 'Mã phiếu tiếp nhận', alignRight: false },
  { id: 'quoteId', label: 'Mã phiếu báo giá', alignRight: false },
  { id: 'owner', label: Vi.nameCustomer, alignRight: false },
  { id: 'carNumber', label: Vi.plateNumber, alignRight: false },
  // { id: 'createTime', label: Vi.createAt, alignRight: false },
  { id: 'createName', label: Vi.createName, alignRight: false },
  // { id: 'description', label: Vi.descriptionReceipt, alignRight: false },
  { id: 'price', label: Vi.price, alignRight: false },
  // { id: 'vehicleCondition', label: Vi.vehicleCondition, alignRight: false },
  { id: 'status', label: Vi.status, alignRight: false },
  { id: 'detail', label: Vi.detail, alignRight: false },
];

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
      return _user?.receipt?.customer?.name?.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Quote() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listCart, setListCart] = useState([]);
  const [listStatus, setListStatus] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState();
  //-------------------------------------------------
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [receiptChoose, setReceiptChoose] = useState({});
  ///

  const location = useLocation();
  const InfoAdmin = JSON.parse(localStorage.getItem('profileAdmin'));
  const getAllCart = async () => {
    try {
      const res = await getAllQuoteAPI();
      if (res?.data) {
        setListCart(res?.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllCart();
    // getEmployeeInfo();
    // getAllStatus();
  }, []);

  useEffect(() => {
    if (location?.state) {
      const tempData = listCart?.filter((e) => e?.QuoteID === location?.state);

      setReceiptChoose(tempData?.[0]);
      setOpenDetailDialog(true);
    }
  }, [location?.state, listCart]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listCart?.map((n) => n?.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listCart?.length) : 0;
  const filteredUsers = applySortFilter(listCart, getComparator(order, orderBy), filterName);

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Phiếu báo giá
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenDialog}
          >
            {Vi.addNewReceipt}
          </Button> */}
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected?.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, overflow: 'hidden' }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listCart?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => (
                    <Row
                      row={row}
                      setReceiptChoose={setReceiptChoose}
                      listStatus={listStatus}
                      getAllCart={getAllCart}
                      employee={employeeInfo}
                      setOpenEditDialog={setOpenEditDialog}
                      setOpenDetailDialog={setOpenDetailDialog}
                      InfoAdmin={InfoAdmin}
                    />
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            createTime
            count={listCart?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      {/* <CreateReceipt
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        listCart={listCart}
        getAllCart={getAllCart}
      /> */}
      <EditReceipt
        openDialog={openEditDialog}
        setOpenDialog={setOpenEditDialog}
        getAllCart={getAllCart}
        receiptChoose={receiptChoose}
      />
      <QuoteDetail
        openDialog={openDetailDialog}
        setOpenDialog={setOpenDetailDialog}
        getAllCart={getAllCart}
        receiptChoose={receiptChoose}
      />

      {/* <CreateQuote openDialog={openDialog} setOpenDialog={setOpenDialog} listCart={listCart} /> */}
      {/* <AssignStaff openDialog={openDialog} setOpenDialog={setOpenDialog} listCart={listCart} /> */}
    </Page>
  );
}

const Row = ({ row, setReceiptChoose, setOpenEditDialog, setOpenDetailDialog, InfoAdmin }) => {
  const {
    ReceiptID,
    Time,
    Note,
    customer,
    staff,
    vehicle,
    VehicleStatus,
    // status: { id },
    // totalPrice,
    // carNumber,
    // timeToDone,
    receipt,
    QuoteID,
    Status,
    priceQuoteServiceDetails,
    priceQuoteProductDetails,
    repairOrder,
  } = row;
  const [openToast, setOpenToast] = useState(false);
  const [severity, setSeverity] = useState(false);
  const [contentToast, setContentToast] = useState('');

  const [openToastDatePicker, setOpenToastDatePicker] = useState(false);

  const returnStatus = (status) => {
    switch (status) {
      case '0':
        return 'chờ xác nhận';
      case '1':
        return 'đã xác nhận';
      case '2':
        return 'xác nhận lại';

      default:
        return 'Chờ xác nhận';
    }
  };

  const addNewInvoice = async () => {
    const data = {
      Time: moment().format('DD-MM-yyyy hh:mm'),
      StaffID: InfoAdmin?.userId,
      QuoteID: QuoteID,
    };
    try {
      const res = await addNewInvoiceAPI(data);
      let errorMessage = res.message || 'Tạo hoá đơn thất bại';
      let successMessage = res.message || 'Tạo hoá đơn thành công';
      if (res.status === 201) {
        setContentToast(successMessage);
        setSeverity('success');

        setOpenToast(true);
      } else {
        setContentToast(errorMessage);
        setSeverity('error');
        setOpenToast(true);
      }
    } catch (error) {
      setContentToast('Tạo hoá đơn thất bại');
      setSeverity('error');
      setOpenToast(true);
    }
  };

  const countPrice = () => {
    const priceQuoteService = priceQuoteServiceDetails?.reduce((a, b) => a * 1 + parseInt(b?.Price || '0.0'), 0);
    const priceQuoteProduct = priceQuoteProductDetails?.reduce(
      (a, b) => a * 1 + parseInt(b?.SellingPrice || '0.0') * b?.Quantity || 1,
      0
    );
    return (priceQuoteService * 1 + priceQuoteProduct * 1) * 1.08;
  };

  return (
    <>
      <TableRow hover key={ReceiptID} tabIndex={-1} role="checkbox">
        <TableCell></TableCell>
        <TableCell align="center">{ReceiptID}</TableCell>
        <TableCell align="center">{QuoteID}</TableCell>

        <TableCell align="center">{receipt?.customer?.name}</TableCell>
        <TableCell align="center">{receipt?.vehicle?.NumberPlate}</TableCell>

        <TableCell align="center">{staff?.name}</TableCell>

        <TableCell align="center">{formatMoneyWithDot(countPrice() || 0)}</TableCell>
        <TableCell align="center">{returnStatus(Status)}</TableCell>

        <TableCell align="center">
          {' '}
          <Button
            onClick={() => {
              setReceiptChoose(row);
              setOpenDetailDialog(true);
            }}
          >
            {Vi.detail}
          </Button>
        </TableCell>
        {/* <TableCell align="center">
          {' '}
          <Button
            onClick={() => {
              // setReceiptChoose(row);
              // setOpenDetailDialog(true);
              addNewInvoice();
            }}
            disabled={Status === '1' && repairOrder?.IsDone ? false : true}
          >
            Tạo hoá đơn
          </Button>
        </TableCell> */}
        <TableCell>
          <UserBillMoreMenu
            id={ReceiptID}
            status={Status}
            entity={row}
            handleEditCart={() => {
              setOpenEditDialog(true);
              setReceiptChoose(row);
            }}
          />
        </TableCell>
      </TableRow>

      <AppToast
        content={contentToast}
        type={0}
        isOpen={openToast}
        severity={severity}
        callback={() => {
          setOpenToast(false);
        }}
      />
    </>
  );
};
