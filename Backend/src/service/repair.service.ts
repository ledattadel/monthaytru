import { Brand, RepairOrderDetail } from '../model';
import { AppDataSource } from '../data-source';
import { RepairOrder } from '../model/index';
import messages from '../messageResponse.js'

class RepairService {
    async getAll(_, res) {
        try {
          const repairOrders = await AppDataSource.getRepository(RepairOrder).find({
            // where: { isActive: true },
            relations: [
              
          "priceQuote.staff",
          "priceQuote.invoice",
          "priceQuote.receipt.vehicle",
          "priceQuote.receipt.customer",
                
          "priceQuote.priceQuoteProductDetails.productDetail.product.brand",
          "priceQuote.priceQuoteProductDetails.productDetail.supplier",
              "repairOrderDetails",
              "repairOrderDetails.pqServiceDetail.service",
              "repairOrderDetails.staff",
            ],
          });
      
          return res.json(repairOrders.reverse());
        } catch (error) {
          return res.status(500).json({ error: messages.internalServerError + error });
        }
      }


      //  check xem phieu bao gia cua lenh sua chua da tao hoa don chua
      

      async getById(req, res) {
        try {
          const repairOrderId = req.params.id;
          const repairOrder = await AppDataSource.getRepository(RepairOrder).findOne({
            where: { RepairOrderID: repairOrderId },
            relations: [

          "priceQuote.staff",
          "priceQuote.receipt",
          "priceQuote.receipt.vehicle",
          "priceQuote.receipt.customer",

          "priceQuote.priceQuoteProductDetails.productDetail.product.brand",
          "priceQuote.priceQuoteProductDetails.productDetail.supplier",
              "repairOrderDetails",
              "repairOrderDetails.pqServiceDetail.service",
              "repairOrderDetails.staff",
            ],
          });
      
          if (!repairOrder) {
            return res.status(404).json({ message: messages.notFound });
          }
      
          return res.json(repairOrder);
        } catch (error) {
          return res.status(500).json({ error: messages.internalServerError });
        }
      }
      

      async update(req, res) {
        try {
          const repairOrderId = req.params.id;
          const repairOrder = await AppDataSource.getRepository(RepairOrder).findOne({
            where: { RepairOrderID: repairOrderId }     
          });
          const repairOrderRepo = AppDataSource.getRepository(RepairOrder);
          const repairOrderDetailRepo =  AppDataSource.getRepository(RepairOrderDetail);
          if (!repairOrder) {
            return res.status(404).json({ message: messages.notFound });
          }

        const { RepairOrderID, priceQuoteServiceDetails } = req.body;
        let isAllDone =  true;  
           
        for (const repairElement of priceQuoteServiceDetails) {
            let repairOrderElementQuery = await AppDataSource.getRepository(RepairOrderDetail).findOne({
                where: { RODID: repairElement.RODID }     
            });
            repairOrderElementQuery.IsDone = repairElement.IsDone             
            repairOrderDetailRepo.save(repairOrderElementQuery);
            if (repairElement.IsDone === false) {
                isAllDone = false;
            }


        }

        if (isAllDone) {
            repairOrder.IsDone = true;
        }else{
            repairOrder.IsDone = false;
        }
        repairOrderRepo.save(repairOrder);

          return res.json(repairOrder);
        } catch (error) {
          return res.status(500).json({ error: messages.internalServerError });
        }
      }


}

export default new RepairService();
