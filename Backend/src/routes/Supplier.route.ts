import { Router } from 'express';
import {SupplierService} from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();

// // GET all suppliers
// router.get('/',authenticateJwt,checkManageAndAdminRole, SupplierService.getAll);

// // GET a supplier by ID
// router.get('/:id',authenticateJwt,checkManageAndAdminRole, SupplierService.getById);

// // CREATE a new supplier
// router.post('/',authenticateJwt,checkManageAndAdminRole, SupplierService.create);

// // UPDATE a supplier by ID
// router.put('/:id',authenticateJwt,checkManageAndAdminRole, SupplierService.update);

// // DELETE a supplier by ID
// router.delete('/:id',authenticateJwt,checkManageAndAdminRole, SupplierService.delete);





// GET all suppliers

router.get('/', SupplierService.getAll);



// GET a supplier by ID

router.get('/:id', SupplierService.getById);



// CREATE a new supplier

router.post('/',SupplierService.create);



// UPDATE a supplier by ID

router.patch('/:id', SupplierService.update);



// DELETE a supplier by ID

router.delete('/:id', SupplierService.delete);

export default router;
