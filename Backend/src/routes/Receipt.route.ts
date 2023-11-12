// import { Router } from 'express';
// import { ReceiptService } from '../service';

// const router = Router();

// router.get('/', ReceiptService.getAll); 

// router.get('/:id',ReceiptService.getById);

// router.post('/', ReceiptService.create);

// router.patch('/:id', ReceiptService.update);

// router.delete('/:id', ReceiptService.delete);


// export default router;
import { Router } from 'express';
import { ReceiptService } from '../service';

const router = Router();


router.get('/', ReceiptService.getAll);
router.get('/:id', ReceiptService.getById);
router.post('/', ReceiptService.create);
router.patch('/:id', ReceiptService.update);
router.delete('/:id', ReceiptService.delete);
router.get('/statistics/total-by-time', ReceiptService.getTotalReceiptsByTimeRange);


export default router;
