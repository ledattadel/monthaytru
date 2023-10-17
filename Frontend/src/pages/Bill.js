import { filter } from 'lodash';
import React, { useState, useEffect } from 'react';
// material
import {
  Box,
  Card,
  Table,
  Stack,
  Collapse,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  IconButton,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import KeyboardArrowUpIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/ArrowUpward';

// function
import formatMoneyWithDot from '../utils/formatMoney';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import ExportExcel from '../components/exportExcel';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// Chart
import BarChart from '../chart/BarChart';
import BarChartMonth from '../chart/BarChartMonth';

// mock
import { getAllBillAPI, getCartDescriptionAPI } from '../components/services/index';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Cart ID', alignRight: false },
  { id: 'owner', label: 'Owner', alignRight: false },
  { id: 'createAt', label: 'Create At', alignRight: false },
  { id: 'completeAt', label: 'Complete At', alignRight: false },
  { id: 'price', label: 'Price', alignRight: false },
  { id: 'confirmBy', label: 'Confirm By', alignRight: false },
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
    return filter(array, (_user) => _user?.customer?.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

function formatDate(str) {
  const date = str?.split('T');
  const day = date?.[0]?.split('-');
  return `${day?.[2]}/${day?.[1]}/${day?.[0]}`;
}

export default function Bill() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listBill, setListBill] = useState([]);
  const [monthInChart, setMonthInChart] = useState('2022-12');

  const getAllBill = async () => {
    try {
      const res = await getAllBillAPI();
      // setListBill(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBill();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listBill?.map((n) => n?.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listBill?.length) : 0;
  const filteredUsers = applySortFilter(listBill, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers?.length === 0;

  const dataExportExcel = filteredUsers?.map((value) => ({
    CartId: value?.id,
    Owner: value?.customer?.name,
    CreateAt: formatDate(value?.createTime),
    CompleteAt: formatDate(value?.deleteAt),
    // Price: formatMoneyWithDot(value?.totalPrice),				// old
    Price: value?.totalPrice,
    ConfirmBy: value?.approvalEmployee?.name,
  }));

  return (
    <Page title="Product">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Bill
          </Typography>
          <ExportExcel excelData={dataExportExcel} fileName={'Thống kê doanh thu Garage'} />
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected?.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={listBill?.length}
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
                      <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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
            count={listBill?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        <div style={{ marginTop: '150px' }}>
          <span style={{ marginBottom: '50px', display: 'inline-block' }}>
            <span>Month: </span>
            <input
              style={{
                width: '200px',
                height: '40px',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginLeft: '15px',
              }}
              onChange={(e) => setMonthInChart(e?.target?.value)}
              type="month"
              id="startDate"
              value={monthInChart}
            />
          </span>
          <BarChartMonth data={filteredUsers} monthInChart={monthInChart} />
        </div>
      </Container>
    </Page>
  );
}

function Row(props) {
  const { row } = props;
  const {
    id,
    createTime,
    approvalEmployee,
    totalPrice,
    customer: { name: userName },
    deleteAt: completeAt,
  } = row || {};
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = useState([]);

  const getCartDescription = async (id) => {
    try {
      const res = await getCartDescriptionAPI(id);
      setItem(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    setOpen(!open);
    getCartDescription(id);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleClick}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {id}
        </TableCell>
        <TableCell align="center">{userName}</TableCell>
        <TableCell align="center">{formatDate(createTime)}</TableCell>
        <TableCell align="center">{formatDate(completeAt)}</TableCell>
        <TableCell align="center">{formatMoneyWithDot(totalPrice)}</TableCell>
        <TableCell align="center">{approvalEmployee?.name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {item?.length > 0 ? (
              <Box sx={{ margin: 4 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Sản phẩm
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell align="center">Số lượng</TableCell>
                      <TableCell align="right">Giá tiền</TableCell>
                      <TableCell align="right">Bảo hành đến</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item?.map((value) => (
                      <TableRow key={value?.cartDesId}>
                        <TableCell component="th" scope="row" sx={{ width: '400px' }}>
                          {value?.product?.name}
                        </TableCell>
                        <TableCell align="center">{value?.quantity}</TableCell>
                        <TableCell align="right">{formatMoneyWithDot(value?.price * value?.quantity)}</TableCell>
                        <TableCell align="right">{value?.usageTime ? formatDate(value?.usageTime) : ''}</TableCell>
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
