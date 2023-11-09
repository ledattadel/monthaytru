import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
import ServiceDialog from '../dialog/ServiceDialog';
import ServiceEditDialog from '../dialog/ServiceEditDialog';

// components
import formatMoneyWithDot from '../utils/formatMoney';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
// mock
import { deleteProductAPI, deleteServiceAPI, getAllServiceAPI, getAllServicesAPI } from '../components/services/index';
import { Vi } from 'src/_mock/Vi';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  // { id: 'image', label: 'Image', alignRight: false },
  { id: 'serviceName', label: Vi.nameService, alignRight: false },
  { id: 'email', label: Vi.priceService, alignRight: false },
  { id: 'address', label: Vi.Description, alignRight: false },
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
    return filter(array, (_user) => _user.ServiceName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
  // return array;
}

export default function Service() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listService, setListService] = useState([
    {
      ServiceID: 2,
      ServiceName: 'Thay bánh xe',
      Description: 'Thay bánh xe giá rẻ',
      isActive: true,
      Price: '100000.00',
    },
    {
      ServiceID: 3,
      ServiceName: 'Thay bánh xe 2',
      Description: 'Thay bánh xe giá rẻ',
      isActive: true,
      Price: '100000.00',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [contentToast, setContentToast] = useState('');
  const [severity, setSeverity] = useState('');
  const [currentService, setCurrentService] = useState({});

  const getAllService = async () => {
    try {
      const res = await getAllServiceAPI();
      const temp = res?.data;
      setListService(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAPI = async (id) => {
    try {
      const res = await deleteServiceAPI(id);
      let errorMessage = res.message || 'Xoá dịch vụ thất bại';
      let successMessage = res.message || 'Xoá dịch vụ thành công';
      if (res.status === 200) {
        console.log('res', res);
        setContentToast(errorMessage);
        setSeverity('success');
        setOpenToast(true);
        getAllService();
      } else {
        setContentToast(errorMessage);
        setSeverity('error');
        setOpenToast(true);
      }
    } catch (error) {
      console.log(error);
      setContentToast('Xoá dịch vụ thất bại');
      setSeverity('error');
      setOpenToast(true);
    }
  };

  useEffect(() => {
    getAllService();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listService.map((n) => n.ServiceName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleAddUser = () => {
    setOpenDialog(true);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listService.length) : 0;
  const filteredUsers = applySortFilter(listService, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers?.length === 0;

  return (
    <Page title="User">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {Vi.service}
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddUser}
          >
            {Vi.addNewService}
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
                  rowCount={listService?.length}
                  numSelected={selected?.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row) => {
                    const {
                      ServiceID,
                      // image,
                      ServiceName,
                      Price,
                      // serviceType: { name: serviceName },
                      Description,
                    } = row || {};
                    const isItemSelected = selected.indexOf(ServiceID) !== -1;

                    return (
                      <TableRow
                        hover
                        key={ServiceID}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} /> */}
                        </TableCell>
                        <TableCell align="center">{ServiceID}</TableCell>

                        <TableCell align="center">{ServiceName}</TableCell>
                        <TableCell align="center">{formatMoneyWithDot(parseInt(Price || '0.00'))}</TableCell>
                        <TableCell align="center">{Description}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu
                            id={ServiceID}
                            name={ServiceName}
                            entity={row}
                            type={'Dịch vụ'}
                            deleteAPI={deleteAPI}
                            setSeverity={setSeverity}
                            setOpenToast={setOpenToast}
                            setOpenDialog={setOpenDialog}
                            setContentToast={setContentToast}
                            setOpenDialogEdit={setOpenDialogEdit}
                            setCurrentEntity={setCurrentService}
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
            count={listService?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ServiceDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        getAllService={getAllService}
        setContentToast={setContentToast}
        setSeverity={setSeverity}
        setOpenToast={setOpenToast}
      />
      <ServiceEditDialog
        service={currentService}
        openDialog={openDialogEdit}
        setOpenDialog={setOpenDialogEdit}
        getAllService={getAllService}
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
