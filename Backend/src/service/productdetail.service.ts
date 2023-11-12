import { AppDataSource } from '../data-source';
import messages from '../messageResponse.js';
import { ProductDetail } from '../model'; 

class ProductDetailService {
  async getAll(_, res) {
    try {
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const productDetails = await productDetailRepo.find({
        where: { isActive: true },
        relations: ['supplier','product','product.brand']
      });
            return res.json(productDetails.reverse());
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async getById(req, res) {
    try {
      const productDetailId = req.params.id;
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const productDetail = await productDetailRepo.findOne({
        where: { ProductDetailID: productDetailId, isActive: true },
        
        relations: ['supplier','product','product.brand']
      });

      if (!productDetail) {
        return res.status(404).json({ message: messages.notFound });
      }

      return res.json(productDetail);
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async create(req, res) {
    try {
      const { ProductID, SupplierID, SellingPrice, PurchasePrice, Quantity } = req.body;

      if (!ProductID || !SupplierID || !SellingPrice || !PurchasePrice || !Quantity) {
        return res.status(400).json({
          code: 400,
          message: messages.missingProductDetailFields,
        });
      }

      const productDetailRepo = AppDataSource.getRepository(ProductDetail);

      const existingProductDetail = await productDetailRepo.findOne({
        where: { ProductID, SupplierID }
      });

      if (existingProductDetail) {
        return res.status(400).json({
          code: 400,
          message: messages.findExistingProductDetailWhenCreate,
        });
      }

      const productDetail = new ProductDetail();
      productDetail.ProductID = ProductID;
      productDetail.SupplierID = SupplierID;
      productDetail.SellingPrice = SellingPrice;
      productDetail.PurchasePrice = PurchasePrice;
      productDetail.Quantity = Quantity;
      productDetail.isActive = true;

      await productDetailRepo.save(productDetail);

      return res.status(201).json({
        message: messages.createProductDetailSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }

  async update(req, res) {
    try {
      const productDetailId = req.params.id;
      const { SellingPrice } = req.body;

      if (!SellingPrice) {
        return res.status(400).json({
          code: 400,
          message: messages.missingProductDetailFields,
        });
      }

      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const productDetail = await productDetailRepo.findOne({
        where: { ProductDetailID: productDetailId },
      });

      if (!productDetail) {
        return res.status(404).json({ message: messages.notFound });
      }

      productDetail.SellingPrice = SellingPrice || productDetail.SellingPrice;
     
      await productDetailRepo.save(productDetail);

      return res.json({
        message: messages.updateProductDetailSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }

  async delete(req, res) {
    try {
      const productDetailId = req.params.id;
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const productDetail = await productDetailRepo.findOne({
        where: { ProductDetailID: productDetailId },
      });

      if (!productDetail) {
        return res.status(404).json({ message: messages.notFound });
      }

      productDetail.isActive = false;

      await productDetailRepo.save(productDetail);

      return res.status(200).json({
        message: messages.deleteProductDetailSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }
}

export default new ProductDetailService();
