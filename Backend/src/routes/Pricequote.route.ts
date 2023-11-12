import { Router } from 'express';
import { PriceQuoteService } from '../service';

const router = Router();

router.get('/', PriceQuoteService.getAll); 

router.get('/:id',PriceQuoteService.getById);

router.post('/', PriceQuoteService.create);

router.patch('/:id', PriceQuoteService.update);

// router.delete('/:id', PriceQuoteService.delete);


export default router;
