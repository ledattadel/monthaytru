import { Product, Brand } from '../model';
import { AppDataSource } from '../data-source';
import { Customer } from '../model/index';
import messages from '../messageResponse.js'

class ProductService {
  async getAll(_, res) {
    try {
      const products = await AppDataSource.getRepository(Product)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.brand", "brand")
      .where("product.isActive = :isActive", { isActive: true })
      .getMany();
      
      return res.json(products.reverse());
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async getById(req, res) {
    try {
      const productId = req.params.id;
      const product = await AppDataSource.getRepository(Product).findOne({ where: { ProductID: productId, isActive: true } });

      if (!product) {
        return res.status(404).json({ message: messages.notFound });
      }

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async create(req, res) {
    try {
      const { ProductName, ProductDescription, BrandName,  Price } = req.body;

      if (!ProductName || !BrandName  || !Price) {
        return res.status(400).json({
          code: 400,
          message: messages.missingProductFields,
        });
      }

      const productRepo = AppDataSource.getRepository(Product);
      const brandRepo = AppDataSource.getRepository(Brand);
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

      const product = new Product();
      product.ProductName = ProductName;
      product.ProductDescription = ProductDescription;
      product.BrandId = brandId;
      product.Price = Price;
      // product.Unit = Unit;
      product.isActive = true;

      await productRepo.save(product);

      return res.status(201).json({
        message: messages.createProductSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }

  async update(req, res) {
    try {
      const productId = req.params.id;
      const { ProductName, ProductDescription, BrandName } = req.body;

      if (!ProductName || !BrandName ) {
        return res.status(400).json({
          code: 400,
          message: messages.missingProductFields,
        });
      }

      const brandRepo = AppDataSource.getRepository(Brand);
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


      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({
        where: { ProductID: productId, isActive: true },
      });

      if (!product) {
        return res.status(404).json({ message: messages.notFound });
      }

      product.ProductName = ProductName || product.ProductName;
      product.ProductDescription = ProductDescription || product.ProductDescription;
      product.BrandId = brandId || product.BrandId;
      // product.Unit = Unit || product.Unit;

      await productRepo.save(product);

      return res.status(200).json({
        message: messages.updateProductSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }

  async delete(req, res) {
    try {
      const productId = req.params.id;
      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOne({
        where: { ProductID: productId, isActive: true },
      });

      if (!product) {
        return res.status(404).json({ message: messages.notFound });
      }
      product.isActive = false;

      await productRepo.save(product);

      return res.status(200).json({
        message: messages.deleteProductSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }
}

export default new ProductService();
