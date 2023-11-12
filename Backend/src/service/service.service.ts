import { AppDataSource } from '../data-source';
import { Service } from '../model/index';
import messages from '../messageResponse.js'

class ServiceService {
    // GET all services
    async getAll(_, res) {
      try {
        const services = await AppDataSource.getRepository(Service).find({ where: { isActive: true } });
        return res.json(services.reverse());
      } catch (error) {
        return res.status(500).json({ error: messages.internalServerError });
      }
    }
  
    // GET a service by ID
    async getById(req, res) {
      try {
        const serviceId = req.params.id;
        const service = await AppDataSource.getRepository(Service).findOne({ where: { ServiceID: serviceId ,  isActive: true} });
  
        if (!service) {
          return res.status(404).json({ message: messages.notFound });
        }
  
        return res.json(service);
      } catch (error) {
        return res.status(500).json({ error: messages.internalServerError });
      }
    }
  
    async create(req, res) {
        try {
          const { ServiceName, Description, Price } = req.body;
      
          if (!ServiceName || !Price) {
            return res.status(400).json({
              code: 400,
              message: messages.missingServiceFields,
            });
          }
      
          const serviceRepo = AppDataSource.getRepository(Service);
      
          const existingService = await serviceRepo.findOne({
            where: { ServiceName },
          });
      
          if (existingService) {
            return res.status(400).json({
              code: 400,
              message: messages.findExistingServiceWhenCreate,
            });
          }
      
          const service = new Service();
          service.ServiceName = ServiceName;
          service.Description = Description;
          service.Price = Price;
          service.isActive = true
      
          await serviceRepo.save(service);
      
          return res.status(201).json({
            message: messages.createServiceSuccessful,
          });
        } catch (error) {
          return res.status(500).json({
            error: messages.internalServerError,
          });
        }
      }
  
    // UPDATE a service by ID
    // UPDATE a service by ID
async update(req, res) {
    try {
      const serviceId = req.params.id;
      const { ServiceName, Description, Price } = req.body;
  
      if (!ServiceName || !Price) {
        return res.status(400).json({
          code: 400,
          message: messages.missingServiceFields,
        });
      }
  
      const serviceRepo = AppDataSource.getRepository(Service);
      const service = await serviceRepo.findOne({
        where: { ServiceID: serviceId },
      });
  
      if (!service) {
        return res.status(404).json({ message: messages.notFound });
      }
  
      service.ServiceName = ServiceName || service.ServiceName ;
      service.Description = Description || service.Description;
      service.Price = Price || service.Price;
  
      await serviceRepo.save(service);
  
      return res.json({
        message: messages.updateServiceSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }
  
    // DELETE a service by ID
    async delete(req, res) {
        try {
          const serviceId = req.params.id;
          const serviceRepo = AppDataSource.getRepository(Service);
          const service = await serviceRepo.findOne({
            where: { ServiceID: serviceId,  isActive: true },
          });
      
          if (!service) {
            return res.status(404).json({ message: messages.notFound });
          }
          service.isActive = false;
      
          await serviceRepo.save(service);
      
         return res.status(200).json({ message: messages.deleteServiceSuccessful });
        } catch (error) {
          return res.status(500).json({
            error: messages.internalServerError,
          });
        }
  }
}
  export default new ServiceService();
  