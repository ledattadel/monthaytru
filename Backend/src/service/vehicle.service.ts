import { AppDataSource } from '../data-source';
import { Brand, Vehicle } from '../model/index';
import messages from '../messageResponse.js'

class VehicleService {
  
    async getAll(_, res) {
      try {
        const Vehicles = await AppDataSource.getRepository(Vehicle).find({ where: { isActive: true } });
        return res.json(Vehicles);
      } catch (error) {
        return res.status(500).json({ error: messages.internalServerError });
      }
    }
  
    async getById(req, res) {
      try {
        const vehicleId = req.params.id;
        const vehicle = await AppDataSource.getRepository(Vehicle).findOne({ where: { VehicleID: vehicleId, isActive: true } });
  
        if (!vehicle) {
          return res.status(404).json({ message: messages.notFound });
        }
  
        return res.json(vehicle);
      } catch (error) {
        return res.status(500).json({ error: messages.internalServerError });
      }
    }
  
    async create(req, res) {
      try {
        const { 
            NumberPlate, Type, Color, EngineNumber, ChassisNumber, BrandName } = req.body;
  
            const vehicleRepo = AppDataSource.getRepository(Vehicle);
            const brandRepo =  AppDataSource.getRepository(Brand);
            
        if (!NumberPlate) {
          return res.status(400).json({
            code: 400,
            message: messages.missingVehicleFields,
          });
        }
  
        const existingVehicle = await vehicleRepo.findOne({
          where: { NumberPlate },
        });
  
        if (existingVehicle) {
          return res.status(400).json({
            code: 400,
            message: messages.findExistingVehicleWhenCreate,
          });
        }
        
        const existBrand = await brandRepo.findOne({
          where:{BrandName: BrandName}
        })
        let brandId = null;
        if (existBrand) {
          brandId = existBrand.BrandID;
        }else{
          let newBrand = new Brand();
          newBrand.BrandName = BrandName;
          brandRepo.save(newBrand);
          let findIdOfNewBrand = await brandRepo.findOne({
            where:{BrandName: BrandName}
          })
          brandId = findIdOfNewBrand.BrandID;
        }
  
        const vehicle = new Vehicle();
        vehicle.NumberPlate = NumberPlate || vehicle.NumberPlate; 
        vehicle.Type = Type || vehicle.Type;
        vehicle.Color = Color || vehicle.Color;
        vehicle.EngineNumber = EngineNumber || vehicle.EngineNumber;
        vehicle.ChassisNumber = ChassisNumber || vehicle.ChassisNumber;
        vehicle.BrandId=brandId;
        vehicle.isActive = true;
  
        await vehicleRepo.save(vehicle);
  
        return res.status(201).json({
          message: messages.createVehicleSuccessful,
        });
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
    }
  

    async update(req, res) {
      try {
        const vehicleId = req.params.id;
        const { 
          NumberPlate, Type, Color, EngineNumber, ChassisNumber } = req.body;

      if (!NumberPlate) {
        return res.status(400).json({
          code: 400,
          message: messages.missingVehicleFields,
        });
      }

  
        const vehicleRepo = AppDataSource.getRepository(Vehicle);
        const vehicle = await vehicleRepo.findOne({
          where: { VehicleID: vehicleId },
        });
  
        if (!vehicle) {
          return res.status(404).json({ message: messages.notFound });
        }
  
       
        vehicle.NumberPlate = NumberPlate || vehicle.NumberPlate; 
        vehicle.Type = Type || vehicle.Type;
        vehicle.Color = Color || vehicle.Color;
        vehicle.EngineNumber = EngineNumber || vehicle.EngineNumber;
        vehicle.ChassisNumber = ChassisNumber || vehicle.ChassisNumber;
  
        await vehicleRepo.save(vehicle);
  
        return res.status(200).json({
          message: messages.updateVehicleSuccessful,
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
        const vehicleId = req.params.id;
        const vehicleRepo = AppDataSource.getRepository(Vehicle);
        const vehicle = await vehicleRepo.findOne({
          where: { VehicleID: vehicleId,  isActive: true  },
        });
  
        if (!vehicle) {
          return res.status(404).json({ message: messages.notFound });
        }
        vehicle.isActive = false;
  
        await vehicleRepo.save(vehicle);
  
        return res.status(200).json({
          message: messages.deleteVehicleSuccessful,
        });
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
    }

    async searchByNumberPlate(req, res) {
      try {
        const { NumberPlate } = req.query;
    
        if (!NumberPlate) {
          return res.status(400).json({
            code: 400,
            message: messages.missingNumberPlate,
          });
        }
    
        const vehicleRepo = AppDataSource.getRepository(Vehicle);
        const vehicles = await vehicleRepo.find({
          where: {
            isActive: true,
            NumberPlate,
          },
        });
    
        return res.json(vehicles);
      } catch (error) {
        return res.status(500).json({
          error: messages.internalServerError,
        });
      }
    }
    


  }
  
  export default new VehicleService();
  