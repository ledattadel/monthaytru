import { Router } from 'express';
import { RoleService } from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();

//GET
router.get('/get-all',authenticateJwt,checkManageAndAdminRole, RoleService.getAll);


//POST
router.post('/create',authenticateJwt,checkManageAndAdminRole, RoleService.create);

export default router;
