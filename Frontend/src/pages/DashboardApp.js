import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, TextField, Box, Button as BaseButton } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import DatePickerDialog from 'src/dialog/DatePickerDialog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import {
  getDashboardCustomerAPI,
  getDashboardInvoiceAPI,
  getDashboardInvoicePriceAPI,
  getDashboardReceiptAPI,
  getDashboardVehicleAPI,
} from 'src/components/services';
import styled from '@emotion/styled';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  const [value, setValue] = useState();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [trigger, setTrigger] = useState(false);

  const [customer, setCustomer] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [invoice, setInvoice] = useState({});
  const [receipt, setReceipt] = useState({});
  const [invoicePrice, setInvoicePrice] = useState({});

  const getAllDashboard = async () => {
    console.log('pon console', moment(startTime?.$d).format('DD-MM-yyyy'));
    try {
      const startTime1 = moment(startTime?.$d).format('DD-MM-yyyy');
      const endTime1 = moment(endTime?.$d).format('DD-MM-yyyy');
      const res = await getDashboardCustomerAPI(startTime1, endTime1);
      setCustomer(res?.data);
      const res1 = await getDashboardVehicleAPI(startTime1, endTime1);
      const res2 = await getDashboardInvoiceAPI(startTime1, endTime1);
      const res3 = await getDashboardReceiptAPI(startTime1, endTime1);
      const res4 = await getDashboardInvoicePriceAPI(startTime1, endTime1);
      setInvoicePrice(res4?.data);
      setVehicle(res1?.data);
      setInvoice(res2?.data);
      setReceipt(res3?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getAllDashboard();
  }, [trigger]);

  const blue = {
    200: '#99CCFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0066CC',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const Button = styled(BaseButton)(
    ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    background-color: ${blue[500]};
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    border: 1px solid ${blue[500]};
    box-shadow: 0 2px 1px ${
      theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(45, 45, 60, 0.2)'
    }, inset 0 1.5px 1px ${blue[400]}, inset 0 -2px 1px ${blue[600]};
  
    &:hover {
      background-color: ${blue[600]};
    }
  
    &:active {
      background-color: ${blue[700]};
      box-shadow: none;
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
      outline: none;
    }
  
    &:disabled {
      background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[700]};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      cursor: not-allowed;
      box-shadow: none;
  
      &:hover {
        background-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      }
    }
  `
  );

  console.log('pon console', invoicePrice?.totalSellingPricesProduct * 1);
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Box
          style={{
            display: 'flex',
            width: 620,
            justifyContent: 'space-between',
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày bắt đầu"
                inputFormat="DD-MM-YYYY"
                value={startTime}
                maxDate={new Date()}
                onChange={(newValue) => {
                  console.log('pon console e ahahaha', moment(newValue?.$d).format('DD-MM-yyyy'));
                  setStartTime(newValue);
                }}
                renderInput={(params) => <TextField label={'Ngày bắt đầu'} {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày kết thúc"
                // inputFormat="DD-MM-yyyy"
                value={endTime}
                maxDate={new Date()}
                onChange={(newValue) => {
                  setEndTime(newValue);
                }}
                renderInput={(params) => <TextField label={'Ngày bắt đầu'} {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <Button onClick={() => setTrigger(!trigger)}>Thống kê</Button>
          </Box>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Khách hàng mới" total={customer?.total} icon={'ant-design:android-filled'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Xe mới" total={vehicle?.total} color="error" icon={'ant-design:bug-filled'} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Phiếu tiếp nhận"
              total={receipt?.total}
              color="warning"
              icon={'ant-design:windows-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Hoá đơn" total={invoice?.total} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.blue[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              // subheader="(+43%) than last year"
              chartData={[
                { label: 'Sản phẩm', value: invoicePrice?.totalSellingPricesProduct || 0 },
                { label: 'dịch vụ', value: invoicePrice?.totalPriceService * 1 || 0 },
                {
                  label: 'Lợi nhuận sản phẩm',
                  value:
                    invoicePrice?.totalSellingPricesProduct * 1 - invoicePrice?.totalPurchasePricesProduct * 1 || 0,
                },
                // { label: 'Canada', value: 470 },
                // { label: 'France', value: 540 },
                // { label: 'Germany', value: 580 },
                // { label: 'South Korea', value: 690 },
                // { label: 'Netherlands', value: 1100 },
                // { label: 'United States', value: 1200 },
                // { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} height={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} height={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} height={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} height={32} />,
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
