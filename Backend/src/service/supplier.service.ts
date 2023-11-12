import { AppDataSource } from '../data-source';
import { Supplier } from '../model/index';
import messages from '../messageResponse.js'

class SupplierService {
    // GET all suppliers
    async getAll(_, res) {
      try {
        const suppliers = await AppDataSource.getRepository(Supplier).find({ where: { isActive: true } });
        return res.json(suppliers.reverse());
      } catch (error) {
        return res.status(500).json({ error: messages.internalServerError });
      }
    }
  
    // GET a supplier by ID
    async getById(req, res) {
      try {
        const supplierId = req.params.id;
        const supplier = await AppDataSource.getRepository(Supplier).findOne({ where: { SupplierID: supplierId, isActive: true } });
  
        if (!supplier) {
          return res.status(404).json({ message: messages.notFound });
        }
  
        return res.json(supplier);
      } catch (error) {
        return res.status(500).json({ error: messages.internalServerError });
      }
    }
  
    // CREATE a new supplier
    async create(req, res) {
      try {
        const { name, phoneNumber, address } = req.body;
  
        if (!name ||  !phoneNumber || !address) {
          return res.status(400).json({
            code: 400,
            message: messages.missingFields,
          });
        }
  
        const supplierRepo = AppDataSource.getRepository(Supplier);
  
        const existingSupplier = await supplierRepo.findOne({
          where: { name },
        });
  
        if (existingSupplier) {
          return res.status(400).json({
            code: 400,
            message: messages.findExistingSupplierWhenCreate,
          });
        }
  
        const supplier = new Supplier();
        supplier.name = name;
        supplier.phoneNumber = phoneNumber;
        supplier.address = address;
        supplier.isActive = true;
  
        await supplierRepo.save(supplier);
  
        return res.status(201).json({
          message: messages.createSupplierSuccessful,
        });
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
    }
  
    // UPDATE a supplier by ID
    async update(req, res) {
      try {
        const supplierId = req.params.id;
        const { name, phoneNumber, address } = req.body;
  
        if (!name ||  !phoneNumber || !address) {
          return res.status(400).json({
            code: 400,
            message: messages.missingSupplierFields,
          });
        }
  
        const supplierRepo = AppDataSource.getRepository(Supplier);
        const supplier = await supplierRepo.findOne({
          where: { SupplierID: supplierId },
        });
  
        if (!supplier) {
          return res.status(404).json({ message: messages.notFound });
        }
  
        supplier.name = name || supplier.name;
        supplier.phoneNumber = phoneNumber || supplier.phoneNumber;
        supplier.address = address || supplier.address;
        await supplierRepo.save(supplier);
  
        return res.status(200).json({
          message: messages.updateSupplierSuccessful,
        });
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
    }
  
    // DELETE a supplier by ID
    async delete(req, res) {
      try {
        const supplierId = req.params.id;
        const supplierRepo = AppDataSource.getRepository(Supplier);
        const supplier = await supplierRepo.findOne({
          where: { SupplierID: supplierId, isActive: true },
        });
  
        if (!supplier) {
          return res.status(404).json({ message: messages.notFound });
        }
        supplier.isActive = false;
  
        await supplierRepo.save(supplier);
  
        return res.status(200).json({
          message: messages.deleteSupplierSuccessful,
        });
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
    }
  }
  
  export default new SupplierService();
  