
import BrandRoute from './Brand.route'
import StaffRoute from './Staff.route'
import CustomerRoute from './Customer.route'
import RoleRoute from './Role.route'
import SupplierRoute from './Supplier.route'
import VehicleRoute from './Vehicle.route'
import ServiceRoute from './Service.route'
import ProductRoute from './Product.route'
import PurchaseRoute from './Purchase.route'
import ReceiptRoute from './Receipt.route'
import PriceQuoteRoute from './Pricequote.route'
import productdetailRoute from './Productdetail.route'
import RepairRoute from './Repair.route'
import InvoiceRoute from './invoice.route'
const router = (app) => {

	app.use('/api/staff',StaffRoute);
	app.use('/api/role', RoleRoute);
	app.use('/api/customer', CustomerRoute);
	app.use('/api/supplier',SupplierRoute);
	app.use('/api/brand', BrandRoute);
	app.use('/api/vehicle',VehicleRoute);
	app.use('/api/service',ServiceRoute);
	app.use('/api/product',ProductRoute);
	app.use('/api/purchase',PurchaseRoute);
	app.use('/api/receipt', ReceiptRoute);
	app.use('/api/pricequote', PriceQuoteRoute)
	app.use('/api/productdetail', productdetailRoute)
	app.use('/api/repair', RepairRoute)
	app.use('/api/invoice', InvoiceRoute)
}

export default router;