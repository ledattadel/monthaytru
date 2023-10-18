import { Router } from 'express';
import { BrandService } from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();

// router.get('/',authenticateJwt,checkManageAndAdminRole, BrandService.getAll);

// router.get('/:id',authenticateJwt,checkManageAndAdminRole,BrandService.getById);

// router.post('/',authenticateJwt,checkManageAndAdminRole, BrandService.create);

// router.put('/:id',authenticateJwt,checkManageAndAdminRole, BrandService.update);

// router.delete('/:id',authenticateJwt,checkManageAndAdminRole, BrandService.delete);



router.get('/', BrandService.getAll);

router.get('/:id',BrandService.getById);

router.post('/', BrandService.create);

router.patch('/:id', BrandService.update);

router.delete('/:id', BrandService.delete);
export default router;
