
import BrandRoute from './Brand.route'
import StaffRoute from './Staff.route'
import CustomerRoute from './Customer.route'
import RoleRoute from './Role.route'
import SupplierRoute from './Supplier.route'
import VehicleRoute from './Vehicle.route'
import ServiceRoute from './Service.route'
import ProductRoute from './Product.route'
const router = (app) => {

// NEW VERSION 
	app.use('/api/staff',StaffRoute);
	app.use('/api/role', RoleRoute);
	app.use('/api/customer', CustomerRoute);
	app.use('/api/supplier',SupplierRoute);
	app.use('/api/brand', BrandRoute);
	app.use('/api/vehicle',VehicleRoute);
	app.use('/api/service',ServiceRoute);
	app.use('/api/product',ProductRoute);
}

export default router;