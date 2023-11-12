import { Router } from 'express';
import { RepairService } from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();


router.get('/', RepairService.getAll);

router.get('/:id',RepairService.getById);

router.patch('/:id',RepairService.update);

export default router;
