import { Router } from 'express';
import { StaffService } from '../service';
import { authenticateJwt, checkAdminRole, checkTechnicianRole, checkManageRole, checkManageAndAdminRole } from '../middlewares';

const router = Router();
// router.get('/get-all',authenticateJwt,checkAdminRole, StaffService.getAllUser); 

// router.get('/get-all-manage',authenticateJwt,checkManageAndAdminRole,StaffService.getAllManage);

// router.get('/get-all-technicians',authenticateJwt,checkManageAndAdminRole, StaffService.getAllTechnicians);

// router.get('/get-role-name/:username',authenticateJwt,checkManageAndAdminRole, StaffService.getRoleNameByUsername);

// router.get('/user-info', authenticateJwt,checkManageAndAdminRole,  StaffService.getUserInfor)

// // //POST
// router.post('/',authenticateJwt,checkAdminRole, StaffService.createStaff)	// createStaff
// router.post('/sign-in', StaffService.signIn)	

// // //PATCH - Update
// router.put('/:staffId',authenticateJwt,checkManageAndAdminRole, StaffService.updateStaff);

// // //DELETE
// router.delete('/:staffId',authenticateJwt,  checkManageAndAdminRole, StaffService.deleteStaff);











router.get('/',StaffService.getAllUser); 

router.get('/get-all-manage',StaffService.getAllManage);

router.get('/get-all-technicians',StaffService.getAllTechnicians);

router.get('/get-role-name/:username',StaffService.getRoleNameByUsername);

router.get('/user-info/:username',  StaffService.getUserInfor)

// //POST
router.post('/', StaffService.createStaff)	// createStaff
router.post('/sign-in', StaffService.signIn)	

// //PATCH - Update
router.patch('/:staffId',StaffService.updateStaff);

// //DELETE
router.delete('/:staffId', StaffService.deleteStaff);
export default router;
