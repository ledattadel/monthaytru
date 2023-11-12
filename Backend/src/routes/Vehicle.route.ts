import { Router } from 'express';
import {VehicleService} from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();


router.get('/', VehicleService.getAll);


router.get('/:id', VehicleService.getById);

router.get('/numberplate/:id',VehicleService.getByNumberPlate)


router.post('/', VehicleService.create);


router.put('/:id', VehicleService.update);


router.delete('/:id', VehicleService.delete);
router.get('/statistics/total-by-time', VehicleService.getTotalVehiclesByTimeRange);


export default router;

