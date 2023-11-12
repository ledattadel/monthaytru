import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
  getAllReceiptAPI,
  getAllStatusAPI,
  getAllVehicleStatusAPI,
  getUserInfoAPI,
} from '../components/services/index';
import EditReceipt from 'src/dialog/Receipt/EditReceipt';
import ReceiptDetail from 'src/dialog/Receipt/ReceiptDetail';
import CreateQuote from 'src/dialog/Receipt/CreateQuote';
import RepairItemDialog from 'src/dialog/RepairItem/RepairItemDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'cardId', label: 'Id', alignRight: false },
  { id: 'owner', label: Vi.nameCustomer, alignRight: false },
  { id: 'carNumber', label: Vi.plateNumber, alignRight: false },
  { id: 'createTime', label: Vi.createAt, alignRight: false },
  { id: 'createName', label: Vi.createName, alignRight: false },
  { id: 'description', label: Vi.descriptionReceipt, alignRight: false },
  // { id: 'price', label: Vi.price, alignRight: false },
  { id: 'vehicleCondition', label: Vi.vehicleCondition, alignRight: false },
  // { id: 'status', label: Vi.status, alignRight: false },
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
    return filter(array, (_user) => _user?.customer?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Receipt() {
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
  const [openCreateQuoteDialog, setOpenCreateQuoteDialog] = useState(false);
  const [openCreateRepairItemDialog, setOpenRepairItemDialog] = useState(false);
  const [receiptChoose, setReceiptChoose] = useState({});

  ///
  const [openToast, setOpenToast] = useState(false);
  const [contentToast, setContentToast] = useState('');
  const [severity, setSeverity] = useState('');

  ///
  const [listVehicleStatus, setListVehicleStatus] = useState([]);

  const getAllVehicleStatus = async () => {
    try {
      const res = await getAllVehicleStatusAPI();
      setListVehicleStatus(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllVehicleStatus();
  }, []);

  const getEmployeeInfo = async () => {
    try {
      const res = await getUserInfoAPI();
      if (res?.status === 200) {
        // setEmployeeInfo(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCart = async () => {
    try {
      const res = await getAllReceiptAPI();
      if (res?.data) {
        setListCart(res?.data);
      }
    } catch (error) {}
  };

  const getAllStatus = async () => {
    try {
      const res = await getAllStatusAPI();
      // setListStatus(res?.data);
    } catch (error) {}
  };

  useEffect(() => {
    getAllCart();
    getEmployeeInfo();
    getAllStatus();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

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
            {Vi.receipt}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenDialog}
          >
            {Vi.addNewReceipt}
          </Button>
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
      <CreateReceipt
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        listCart={listCart}
        getAllCart={getAllCart}
        openCreateRepairItemDialog={openCreateRepairItemDialog}
        setOpenRepairItemDialog={setOpenRepairItemDialog}
        listVehicleStatus={listVehicleStatus}
      />
      <EditReceipt
        openDialog={openEditDialog}
        setOpenDialog={setOpenEditDialog}
        getAllCart={getAllCart}
        receiptChoose={receiptChoose}
        openCreateRepairItemDialog={openCreateRepairItemDialog}
        setOpenRepairItemDialog={setOpenRepairItemDialog}
        listVehicleStatus={listVehicleStatus}
      />
      <ReceiptDetail
        openDialog={openDetailDialog}
        setOpenDialog={setOpenDetailDialog}
        getAllCart={getAllCart}
        receiptChoose={receiptChoose}
        setOpenCreateQuoteDialog={setOpenCreateQuoteDialog}
        listVehicleStatus={listVehicleStatus}
      />

      <CreateQuote
        openDialog={openCreateQuoteDialog}
        setOpenDialog={setOpenCreateQuoteDialog}
        receiptChoose={receiptChoose}
        listCart={listCart}
      />
      <RepairItemDialog
        getAllProduct={getAllVehicleStatus}
        openDialog={openCreateRepairItemDialog}
        setOpenDialog={setOpenRepairItemDialog}
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
      {/* <AssignStaff openDialog={openDialog} setOpenDialog={setOpenDialog} listCart={listCart} /> */}
    </Page>
  );
}

const Row = ({ row, setReceiptChoose, setOpenEditDialog, setOpenDetailDialog }) => {
  const {
    ReceiptID,
    TimeCreate,
    Note,
    customer,
    staff,
    vehicle,
    VehicleStatus,
    // status: { id },
    // totalPrice,
    // carNumber,
    // timeToDone,
  } = row;
  console.log('pon console row', row);
  const [status, setStatus] = useState(ReceiptID);

  const [openToast, setOpenToast] = useState(false);
  const [severity, setSeverity] = useState(false);
  const [contentToast, setContentToast] = useState('');

  const [openToastDatePicker, setOpenToastDatePicker] = useState(false);

  return (
    <>
      <TableRow hover key={ReceiptID} tabIndex={-1} role="checkbox">
        <TableCell></TableCell>
        <TableCell align="center">{ReceiptID}</TableCell>
        {/* <TableCell align="center">{staff?.name}</TableCell> */}
        <TableCell align="center">{customer?.name}</TableCell>
        <TableCell align="center">{vehicle?.NumberPlate}</TableCell>

        <TableCell align="center">{TimeCreate}</TableCell>
        <TableCell align="center">{staff?.name}</TableCell>
        {/* <TableCell align="center">{updateTime ? formatDateTime(updateTime) : ''}</TableCell> */}
        {/* <TableCell align="center">{timeToDone ? formatDate(timeToDone) : ''}</TableCell> */}
        {/* <TableCell align="center">{approvalEmployee?.name || ''}</TableCell> */}
        <TableCell align="center">{Note || ''}</TableCell>
        <TableCell align="center">{VehicleStatus || ''}</TableCell>
        {/* <TableCell align="center">{formatMoneyWithDot(totalPrice)}</TableCell> */}
        {/* <TableCell align="center"><T</TableCell> */}

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
        <TableCell>
          <UserBillMoreMenu
            id={ReceiptID}
            status={status}
            entity={row}
            handleEditCart={() => {
              setOpenEditDialog(true);
              setReceiptChoose(row);
            }}
            // handleRefuseCart={() => setOpenToastDatePicker(true)}
            // handleDeleteCart={() => setOpenModalCancelOrder(true)}
            // handleConfirmCart={handleCreateBill}
          />
        </TableCell>
      </TableRow>

      {/* <DatePickerDialog
        open={openToastDatePicker}
        setOpen={setOpenToastDatePicker}
        email={ReceiptID}
        cartId={ReceiptID}
      /> */}
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
