import { Router } from 'express';
import { ProductService } from '../service';

const router = Router();

//GET
router.get('/', ProductService.getAll); 

router.get('/:id',ProductService.getById);

router.post('/', ProductService.create);

router.patch('/:id', ProductService.update);

router.delete('/:id', ProductService.delete);


export default router;
