import { Router } from 'express';
import { ServiceService } from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();

router.get('/',authenticateJwt,checkManageAndAdminRole, ServiceService.getAll);

router.get('/:id',authenticateJwt,checkManageAndAdminRole, ServiceService.getById);

router.post('/',authenticateJwt,checkManageAndAdminRole, ServiceService.create);

router.put('/:id',authenticateJwt,checkManageAndAdminRole, ServiceService.update);

router.delete('/:id',authenticateJwt,checkManageAndAdminRole, ServiceService.delete);

export default router;
