// component
import { Vi } from 'src/_mock/Vi';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  //  {
  //    title: 'dashboard',
  //    path: '/dashboard/app',
  //    icon: getIcon('eva:pie-chart-2-fill'),
  //  },
  {
    title: Vi.customer,
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: Vi.staff,
    path: '/dashboard/Staff',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: Vi.product,
    path: '/dashboard/accessory',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: Vi.importProduct,
    path: '/dashboard/ImportProducts',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: Vi.saleProducts,
    path: '/dashboard/SaleProducts',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: Vi.brand,
    path: '/dashboard/brand',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: Vi.supplier,
    path: '/dashboard/supplier',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: Vi.service,
    path: '/dashboard/service',
    icon: getIcon('eva:lock-fill'),
  },
  // {
  //   title: 'Sale',
  //   path: '/dashboard/sale',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  {
    title: Vi.receipt,
    path: '/dashboard/order',
    icon: getIcon('eva:alert-triangle-fill'),
  },
  {
    title: Vi.Quote,
    path: '/dashboard/Quote',
    icon: getIcon('eva:alert-triangle-fill'),
  },
  {
    title: Vi.bill,
    path: '/dashboard/bill',
    icon: getIcon('eva:person-add-fill'),
  },
  //  {
  //    title: 'Not found',
  //    path: '/404',
  //    icon: getIcon('eva:alert-triangle-fill'),
  //  },
];

export default navConfig;
