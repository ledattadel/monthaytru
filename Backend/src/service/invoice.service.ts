import { Invoice, Staff } from '../model';
import { AppDataSource } from '../data-source';
import {parseDateStringToDate, spitDateFromString, compareDateStrings, compare2DateBetweenStrings, addDecimals, sumDecimalArray} from '../utils/support'
import messages from '../messageResponse.js';
import {Decimal} from 'decimal.js';

class InvoiceService {

  async getTotalPricesByTimeRange(req, res) {
    try {
      const { startDate, endDate } = req.query; 
    

      const invoices = await AppDataSource.getRepository(Invoice).find({
        where: { isActive: true },
        relations: [
       
          "priceQuote.priceQuoteServiceDetails",
          "priceQuote.priceQuoteProductDetails",

        ],
      });
      
   
    const filteredData = invoices.filter(item => {    
      return compare2DateBetweenStrings(startDate,spitDateFromString(item.Time),endDate)
    });



    let totalPurchasePricesProduct = 0;
    let totalSellingPricesProduct = 0;
    let totalPriceService = 0;
    

    filteredData.forEach(item => {
    if (item.priceQuote.priceQuoteProductDetails) {
        item.priceQuote.priceQuoteProductDetails.forEach(productDetail => {
            totalPurchasePricesProduct += productDetail.PurchasePrice*productDetail.Quantity;
            totalSellingPricesProduct += productDetail.SellingPrice*productDetail.Quantity;
        });
    }
    if (item.priceQuote.priceQuoteServiceDetails) {
      item.priceQuote.priceQuoteServiceDetails.forEach(serviceItem =>{
        totalPriceService+=serviceItem.Price;
      })
    }
  });


      return res.json({
        total: filteredData.length,
        totalPurchasePricesProduct:totalPurchasePricesProduct,
        totalSellingPricesProduct:totalSellingPricesProduct,
        totalPriceService:totalPriceService,
        invoices:filteredData});
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError + error});
    }
  }

  async getTotalInvoicesByTimeRange(req, res) {
    try {
      const { startDate, endDate } = req.query; 
    

    const receipts = await AppDataSource.getRepository(Invoice).find({ 
      where: { isActive: true } 
    });
    
    const filteredData = receipts.filter(item => {    
      return compare2DateBetweenStrings(startDate,spitDateFromString(item.Time),endDate)
    });


      return res.json({total: filteredData.length, filteredData});
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError + error});
    }
  }
  

  async getAll(_, res) {
    try {
      const invoices = await AppDataSource.getRepository(Invoice).find({
        where: { isActive: true },
        relations: [
       
          "staff",
          "priceQuote.priceQuoteServiceDetails.service",
          "priceQuote.priceQuoteServiceDetails.repairOrderDetails.staff",
          "priceQuote.priceQuoteProductDetails.productDetail.product.brand",
          "priceQuote.priceQuoteProductDetails.productDetail.supplier",
          "priceQuote.repairOrder",
          "priceQuote.receipt.vehicle",
          "priceQuote.receipt.customer",
        ],
      });
      
      return res.json(invoices.reverse());
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async getById(req, res) {
    try {
      const invoiceId = req.params.id;
      const invoice = await AppDataSource.getRepository(Invoice).findOne({
        where: { InvoiceID: invoiceId, isActive: true },
        relations: [
          "staff",
          "priceQuote.priceQuoteServiceDetails.service",
          "priceQuote.priceQuoteServiceDetails.repairOrderDetails.staff",
          "priceQuote.priceQuoteProductDetails.productDetail.product.brand",
          "priceQuote.priceQuoteProductDetails.productDetail.supplier",
          "priceQuote.repairOrder",
          "priceQuote.receipt.vehicle",
          "priceQuote.receipt.customer",
        ],
      });

      if (!invoice) {
        return res.status(404).json({ message: messages.notFound });
      }

      return res.json(invoice);
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async create(req, res) {
    try {
      const { Time, StaffID, QuoteID } = req.body;



      if (!Time || !StaffID || !QuoteID) {
        return res.status(400).json({
          code: 400,
          message: messages.missingInvoiceFields,
        });
      }

      const invoiceRepo = AppDataSource.getRepository(Invoice);
      const invoice = new Invoice();
      invoice.Time = Time;
      invoice.StaffID = StaffID;
      invoice.QuoteID = QuoteID;
      invoice.isActive = true;

      await invoiceRepo.save(invoice);

      return res.status(201).json({
        message: messages.createInvoiceSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }

  async update(req, res) {
    try {
      const invoiceId = req.params.id;
      const { Time, StaffID, QuoteID } = req.body;

      if (!Time || !StaffID || !QuoteID) {
        return res.status(400).json({
          code: 400,
          message: messages.missingInvoiceFields,
        });
      }

      const invoiceRepo = AppDataSource.getRepository(Invoice);
      const invoice = await invoiceRepo.findOne({
        where: { InvoiceID: invoiceId, isActive: true },
      });

      if (!invoice) {
        return res.status(404).json({ message: messages.notFound });
      }

      invoice.Time = Time || invoice.Time;
      invoice.StaffID = StaffID || invoice.StaffID;
      invoice.QuoteID = QuoteID || invoice.QuoteID;

      await invoiceRepo.save(invoice);

      return res.status(200).json({
        message: messages.updateInvoiceSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }

  async delete(req, res) {
    try {
      const invoiceId = req.params.id;
      const invoiceRepo = AppDataSource.getRepository(Invoice);
      const invoice = await invoiceRepo.findOne({
        where: { InvoiceID: invoiceId, isActive: true },
      });

      if (!invoice) {
        return res.status(404).json({ message: messages.notFound });
      }
      invoice.isActive = false;

      await invoiceRepo.save(invoice);

      return res.status(200).json({
        message: messages.deleteInvoiceSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }
}

export default new InvoiceService();
