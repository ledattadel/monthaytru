import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Order';
import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Bill from './pages/Bill';
import Sale from './pages/Sale';
import Service from './pages/Service';
import Products from './pages/Products';
import AddProduct from './pages/addProduct';
import DetailOrder from './pages/detailOrder';
import UpdProduct from './pages/updateProduct';
import Brand from './pages/Brand';
import Supplier from './pages/Supplier';
import SaleProducts from './pages/SaleProducts';
import Staff from './pages/Staff';
import ImportProducts from './pages/ImportProducts';
import Quote from './pages/Quote';
import RepairOrder from './pages/RepairOrder';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'user', element: <User /> },
        { path: 'DashboardApp', element: <DashboardApp /> },
        { path: 'Staff', element: <Staff /> },
        { path: 'accessory', element: <Products /> },
        { path: 'SaleProducts', element: <SaleProducts /> },
        { path: 'ImportProducts', element: <ImportProducts /> },
        { path: 'brand', element: <Brand /> },
        { path: 'supplier', element: <Supplier /> },
        { path: 'service', element: <Service /> },
        { path: 'sale', element: <Sale /> },
        { path: 'order', element: <Blog /> },
        { path: 'Quote', element: <Quote /> },
        { path: 'RepairOrder', element: <RepairOrder /> },
        { path: 'bill', element: <Bill /> },
        //{ path: 'addProduct', element: <AddProduct /> },
        //{ path: 'orderDetail/', element: <DetailOrder /> },
        //{ path: 'updateProduct/', element: <UpdProduct /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/user" /> },
        { path: 'login', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
