import { Router } from 'express';
import { ProductdetailService } from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();

// router.get('/',authenticateJwt,checkManageAndAdminRole, BrandService.getAll);

// router.get('/:id',authenticateJwt,checkManageAndAdminRole,BrandService.getById);

// router.post('/',authenticateJwt,checkManageAndAdminRole, BrandService.create);

// router.put('/:id',authenticateJwt,checkManageAndAdminRole, BrandService.update);

// router.delete('/:id',authenticateJwt,checkManageAndAdminRole, BrandService.delete);



router.get('/', ProductdetailService.getAll);

router.get('/:id',ProductdetailService.getById);

// router.post('/', BrandService.create);

router.patch('/:id', ProductdetailService.update);

// router.delete('/:id', ProductdetailService.delete);
export default router;
