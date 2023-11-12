import { Brand } from '../model';
import { AppDataSource } from '../data-source';
import { Customer } from '../model/index';
import messages from '../messageResponse.js'

class BrandService {
 async getAll(_, res) {
    try {
      const services = await AppDataSource.getRepository(Brand).find({ where: { isActive: true } });
      return res.json(services.reverse());


    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async getById(req, res) {
    try {
      const brandId = req.params.id;
      const service = await AppDataSource.getRepository(Brand).findOne({ where: { BrandID: brandId ,  isActive: true} });

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
        const { BrandName} = req.body;
    
        if (!BrandName ) {
          return res.status(400).json({
            code: 400,
            message: messages.missingBrandFields,
          });
        }
    
        const brandRepo = AppDataSource.getRepository(Brand);
    
        const existingService = await brandRepo.findOne({
          where: { BrandName },
        });
    
        if (existingService) {
          return res.status(400).json({
            code: 400,
            message: messages.findExistingBrandWhenCreate,
          });
        }
    
        const brand = new Brand();
        brand.BrandName = BrandName
        brand.isActive = true
    
        await brandRepo.save(brand);
    
        return res.status(201).json({
          message: messages.createBrandSuccessful,
        });
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
    }

async update(req, res) {
  try {
    const brandId = req.params.id;
    const { BrandName} = req.body;

    if (!BrandName) {
      return res.status(400).json({
        code: 400,
        message: messages.missingBrandFields,
      });
    }

    const brandRepo = AppDataSource.getRepository(Brand);
    const brand = await brandRepo.findOne({
      where: { BrandID: brandId },
    });

    if (!brand) {
      return res.status(404).json({ message: messages.notFound });
    }

    brand.BrandName = BrandName || brand.BrandName;

    await brandRepo.save(brand);

    return res.json({
      message: messages.updateServiceSuccessful,
    });
  } catch (error) {
    return res.status(500).json({
      error: messages.internalServerError,
    });
  }
}

  async delete(req, res) {
      try {
        const brandId = req.params.id;
        const brandRepo = AppDataSource.getRepository(Brand);
        const service = await brandRepo.findOne({
          where: { BrandID: brandId },
        });
    
        if (!service) {
          return res.status(404).json({ message: messages.notFound,  isActive: true });
        }
        service.isActive = false;
    
        await brandRepo.save(service);
    
        return res.status(200).json({
          message: messages.deleteBrandSuccessful,
        });
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
}
}

export default new BrandService();
