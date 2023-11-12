import { Router } from 'express';
import { invoiceService } from '../service';

const router = Router();

//GET
router.get('/', invoiceService.getAll); 

router.get('/:id',invoiceService.getById);

router.post('/', invoiceService.create);

router.patch('/:id', invoiceService.update);

router.delete('/:id', invoiceService.delete);
router.get('/statistics/total-by-time', invoiceService.getTotalInvoicesByTimeRange);
router.get('/statistics/price-by-time', invoiceService.getTotalPricesByTimeRange);


export default router;
