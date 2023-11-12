import { Router } from 'express';
import { CustomerService } from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();

// router.get('/',authenticateJwt,checkManageAndAdminRole, CustomerService.getAll); 
// router.post('/',authenticateJwt,checkManageAndAdminRole, CustomerService.create); 
// router.put('/:id',authenticateJwt,checkManageAndAdminRole, CustomerService.updateCustomer); 
// router.delete('/:id',authenticateJwt,checkManageAndAdminRole, CustomerService.deleteCustomer); 
// router.get('/:id', authenticateJwt,checkManageAndAdminRole, CustomerService.getById);
// router.get('/phone/:phoneNumber',authenticateJwt,checkManageAndAdminRole, CustomerService.getByPhoneNumber); 


router.get('/', CustomerService.getAll); 
router.post('/',CustomerService.create); 
router.patch('/:id', CustomerService.updateCustomer); 
router.delete('/:id', CustomerService.deleteCustomer); 
router.get('/:id', CustomerService.getById);
router.get('/phone/:phoneNumber', CustomerService.getByPhoneNumber); 
router.get('/statistics/total-by-time', CustomerService.getTotalCustomersByTimeRange);

export default router;
