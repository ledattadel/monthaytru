import { Router } from 'express';
import { PurchaseService } from '../service';

const router = Router();

router.get('/', PurchaseService.getAll); 

router.get('/:id',PurchaseService.getById);

router.post('/', PurchaseService.create);

router.patch('/:id', PurchaseService.update);

// router.delete('/:id', PurchaseService.delete);


export default router;
