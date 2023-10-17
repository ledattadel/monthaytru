import { filter } from 'lodash';
import { useState, useEffect } from 'react';

import axios from 'axios';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableHead,
  Box,
  Collapse,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  Button,
} from '@mui/material';

// components
import formatMoneyWithDot from '../utils/formatMoney';
import { changeRoleFromEnToVi, changeRoleFromViToEn} from '../utils/formatLanguage'
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import {
  deleteStaffAPI,
  deleteUserAPI,
  getAllStaffAPI,
  getAllUserMainAPI,
  getCartByUserIdAPI,
} from '../components/services/index';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import KeyboardArrowUpIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/ArrowUpward';
// import { RouterOutlined } from '@material-ui/icons';
// import Iconify from 'src/components/Iconify';
import UserDialog from 'src/dialog/User/UserDialog';
import UserEditDialog from 'src/dialog/User/UserEditDialog';
import Iconify from '../components/Iconify';
import { Vi } from 'src/_mock/Vi';
import AppToast from 'src/myTool/AppToast';
import StaffDialog from 'src/dialog/Staff/StaffDialog';
import StaffEditDialog from 'src/dialog/Staff/StaffEditDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: Vi.nameStaff, alignRight: false },
  { id: 'username', label: Vi.userName, alignRight: false },
  { id: 'phoneNumber', label: Vi.phoneStaff, alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'address', label: Vi.address, alignRight: false },
  { id: 'Role', label: Vi.role, alignRight: false },
  // { id: 'purchase', label: 'Purchase Count Number', alignRight: false },
  // { id: 'totalMoney', label: 'Total Money Use', alignRight: false },
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
    return filter(array, (item) => item?.user?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function Staff() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listUser, setListUser] = useState([
    {
      id: 3,
      idCardNumber: '000000003',
      name: 'John Doe',
      address: '123 Main St',
      dob: '1989-12-31T17:00:00.000Z',
      username: 'technician',
      password: '$2b$10$.x/Ug54zFEyL.XRzgL8GpeV6ecLoxr63JWQttNYAASUSUTmv90zTm',
      isActive: true,
      email: 'tech3@example.com',
      phoneNumber: '123-456-7890',
      deleteAt: null,
    },
    {
      id: 4,
      idCardNumber: '000000113',
      name: 'John Doe',
      address: '123 Main St',
      dob: '1989-12-31T17:00:00.000Z',
      username: 'technician2',
      password: '$2b$10$1.Tnk2lvdXX5iAZla4fz/ecPf1hnP/EWlXLd/xYw0rL2zHg92vtse',
      isActive: true,
      email: 'techs3@example.com',
      phoneNumber: '123-456-7890',
      deleteAt: null,
    },
  ]);

  //
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [contentToast, setContentToast] = useState('');
  const [severity, setSeverity] = useState('');
  const [currentProduct, setCurrentProduct] = useState({});

  const getAllUser = async () => {
    try {
      const res = await getAllStaffAPI();
      const temp = res?.data || [];
      setListUser(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listUser.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listUser.length) : 0;

  const filteredUsers = applySortFilter(listUser, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers?.length === 0;

  const handleAddProduct = () => {
    setOpenDialog(true);
  };


  return (
    <Page title="User">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {Vi.staff}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddProduct}
          >
            {Vi.addNewStaff}
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
                  rowCount={listUser?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => {
                    return (
                      <Row
                        row={row}
                        key={index}
                        selected={selected}
                        setOpenDialogEdit={setOpenDialogEdit}
                        setCurrentProduct={setCurrentProduct}
                        setContentToast={setContentToast}
                        setSeverity={setSeverity}
                        setOpenToast={setOpenToast}
                      />
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
            count={listUser?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <StaffDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        getAllStaff={getAllUser}
        setContentToast={setContentToast}
        setSeverity={setSeverity}
        setOpenToast={setOpenToast}
      />
      <StaffEditDialog
        user={currentProduct}
        openDialog={openDialogEdit}
        setOpenDialog={setOpenDialogEdit}
        getAllStaff={getAllUser}
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
// setContentToast={setContentToast}
// setSeverity={setSeverity}
// setOpenToast={setOpenToast}

function Row({
  row,
  index,
  selected,
  setCurrentProduct,
  setOpenDialogEdit,
  setContentToast,
  setSeverity,
  setOpenToast,
}) {
  const [open, setOpen] = useState(false);
  const [listCart, setListCart] = useState([]);

  function formatDate(str) {
    const date = str.split('T');
    const day = date[0].split('-');
    return day[2] + '/' + day[1] + '/' + day[0];
  }

  const { user, purchaseCount } = row || {};

  const { id, name, phoneNumber, email, address, username , Role} = row;
  const isItemSelected = selected.indexOf(phoneNumber) !== -1;

  const getCartByUserId = async (id) => {
    try {
      const res = await getCartByUserIdAPI(id);
      // setListCart(res?.data);
    } catch (error) {}
  };

  const handleClick = (id) => {
    setOpen(!open);
    getCartByUserId(id);
  };
  const deleteAPI = async () => {
    const res = await deleteStaffAPI(id);

    if (res?.status === 200) {
      setContentToast(res?.message);
      setSeverity('success');
      setOpenToast(true);
    } else {
      setContentToast(res?.message || 'Xoá nhân viên thất bại');
      setSeverity('error');
      setOpenToast(true);
    }
  };
  return (
    <>
      <TableRow
        hover
        key={phoneNumber}
        tabIndex={-1}
        role="checkbox"
        selected={isItemSelected}
        aria-checked={isItemSelected}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => handleClick(id)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{name}</TableCell>
        <TableCell align="center">{username}</TableCell>
        <TableCell align="center">{phoneNumber}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center">{address}</TableCell>
        <TableCell align="center">{changeRoleFromEnToVi(Role)}</TableCell>
        {/* 
       
        <TableCell align="center">{purchaseCount}</TableCell>
        <TableCell align="center">{formatMoneyWithDot(totalMoneyUse)}</TableCell> */}
        <TableCell align="right">
          <UserMoreMenu
            id={id}
            name={name}
            entity={row}
            type={'khách hàng'}
            deleteAPI={deleteAPI}
            setSeverity={setSeverity}
            setOpenToast={setOpenToast}
            // setOpenDialog={setOpenDialog}
            setContentToast={setContentToast}
            setOpenDialogEdit={setOpenDialogEdit}
            setCurrentEntity={setCurrentProduct}
          />
        </TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {listCart?.length > 0 ? (
              <Box sx={{ margin: 4 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Đơn hàng
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Mã đơn hàng</TableCell>
                      <TableCell align="center">Thời gian tạo</TableCell>
                      <TableCell align="center">Trạng thái</TableCell>
                      <TableCell align="center">Giá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listCart?.map((value) => (
                      <TableRow key={value?.id}>
                        <TableCell align="center" component="th" scope="row" sx={{ width: '400px' }}>
                          {value?.id}
                        </TableCell>
                        <TableCell align="center">{formatDate(value?.createTime)}</TableCell>
                        <TableCell align="center">{value?.status?.name}</TableCell>
                        <TableCell align="center">{formatMoneyWithDot(value?.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : null}
          </Collapse>
        </TableCell>
      </TableRow> */}
    </>
  );
}
