import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Box,
  Divider,
} from '@mui/material';
// components
import axios from 'axios';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import TableProduct from './tableDetailProduct';

const TABLE_HEAD = [
  { id: 'sản phẩm', label: 'sản phẩm', alignRight: false },
  { id: 'size', label: 'size', alignRight: false },
  { id: 'giá', label: 'giá', alignRight: false },
  { id: 'số lượng', label: 'số lượng', alignRight: false },
  { id: 'thành tiền', label: 'thành tiền', alignRight: false },
];

function DetailOrder() {
  const { search } = useLocation();
  const id = search.split('=')[1];

  const [orderDetail, setOrderDetail] = useState([]);
  async function getOrderDetail() {
    const res = await axios.get(`http://localhost:3000/api/v1/ordereds/${id}`);
    // setOrderDetail(res.data);
  }

  useEffect(() => {
    getOrderDetail();
  }, []);
  console.log(orderDetail[0]?.size_list);
  return (
    <>
      {orderDetail && (
        <Box>
          <Box style={{ margin: '20px 0px 50px 30px' }}> Chi tiết đơn hàng</Box>
          <Box style={{ width: '80%', margin: '0 auto', display: 'flex', justifyContent: 'space-evenly' }}>
            <Box>
              <h2 style={{ lineHeight: '30px' }}>thông tin người nhận</h2>
              <Divider />
              <Typography style={{ lineHeight: '30px' }}>Người nhận : {orderDetail[0]?.recipient_name}</Typography>
              <Typography style={{ lineHeight: '25px' }}>Địa chỉ : {orderDetail[0]?.recipient_address}</Typography>
              <Typography style={{ lineHeight: '25px' }}>số điện thoại : {orderDetail[0]?.recipient_phone}</Typography>
              <Typography style={{ lineHeight: '25px' }}>email : {orderDetail[0]?.recipient_email}</Typography>
            </Box>
            <Box>
              <h2 style={{ lineHeight: '30px' }}>thông tin đơn hàng</h2>
              <Divider />
              <Typography style={{ lineHeight: '30px' }}>vận chuyển:thông thường</Typography>
              {/* <Typography style={{ lineHeight: '25px' }}>ngày giao : pham phong pon</Typography> */}
              <Typography style={{ lineHeight: '25px' }}>phí vận chuyển : miễn phí</Typography>
              <Typography style={{ lineHeight: '25px' }}>tổng đơn hàng : {orderDetail[0]?.total_price}</Typography>
            </Box>
            <Box>
              <h2 style={{ lineHeight: '30px' }}>ghi chú khách hàng</h2>
              <Divider />

              {/* <Typography style={{ lineHeight: '25px' }}></Typography> */}
            </Box>
          </Box>
          <Box
            style={{
              width: '80%',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-evenly',
              marginTop: '50px',
            }}
          >
            <Table>
              <UserListHead headLabel={TABLE_HEAD} />
              <TableBody>
                {orderDetail[0]?.products.map((value, index) => (
                  <TableRow hover tabIndex={-1} role="checkbox">
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>

                    <TableCell align="left">{value.data.name}</TableCell>
                    <TableCell align="left">{orderDetail[0]?.size_list[index]}</TableCell>
                    <TableCell align="left">{value.data.price * (1 - value.data.discount * 0.01)}</TableCell>
                    <TableCell align="left">{orderDetail[0]?.quantity_list[index]}</TableCell>

                    <TableCell align="left">
                      {value.data.price * (1 - value.data.discount * 0.01) * orderDetail[0]?.quantity_list[index]}
                    </TableCell>
                  </TableRow>
                ))}

                {/* );
            })} */}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
    </>
  );
}

export default DetailOrder;
