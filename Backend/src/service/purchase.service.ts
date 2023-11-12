import { AppDataSource } from '../data-source';
import { Receipt , Staff, Customer, Vehicle, Brand , PurchaseOrder, PurchaseOrderDetail, ProductDetail, Product} from '../model'; // Đảm bảo bạn import model `Receipt`
import messages from '../messageResponse.js';
import {calculateTotalPurchasePrice} from './support.function'

class PurchaseService {

async getAll(req, res) {
  try {
    const purchaseOrderRepository = AppDataSource.getRepository(PurchaseOrder);
    const purchaseOrderDetailRepository = AppDataSource.getRepository(PurchaseOrderDetail);
    const productDetailRepository = AppDataSource.getRepository(ProductDetail);

    const allPurchaseOrders = await purchaseOrderRepository.find({ relations: ['staff','purchaseOrderDetails','purchaseOrderDetails.productDetail','purchaseOrderDetails.productDetail.supplier','purchaseOrderDetails.productDetail.product','purchaseOrderDetails.productDetail.product.brand'] });
    return res.status(200).json({
      purchaseOrders: allPurchaseOrders.reverse(),
      
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Lỗi máy chủ nội bộ: ' + error,
    });
  }
}

      
  

  async getById(req, res) {
    try {

      const id = req.params.id;

      const purchaseOrderRepository = AppDataSource.getRepository(PurchaseOrder);
      const purchaseOrderDetailRepository = AppDataSource.getRepository(PurchaseOrderDetail);
      const productDetailRepository = AppDataSource.getRepository(ProductDetail);
  
      const purchaseOrder = await purchaseOrderRepository.findOne({
        where: {
          OrderID: id,
          isActive: true
        },
        relations: [
          'staff',
          'purchaseOrderDetails',
          'purchaseOrderDetails.productDetail',
          'purchaseOrderDetails.productDetail.supplier',
          'purchaseOrderDetails.productDetail.product',
          'purchaseOrderDetails.productDetail.product.brand'
        ]
      });
      
      let totalMoney =  calculateTotalPurchasePrice(purchaseOrder);
      
      // console.log(totalMoney);
      
      return res.status(200).json({
        purchaseOrder: purchaseOrder,
        totalMoney: totalMoney
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Lỗi máy chủ nội bộ: ' + error,
      });
    }
  }


  


  async create(req, res) {
    try {
      const purchaseOrderRepository =  AppDataSource.getRepository(PurchaseOrder);
      const purchaseOrderDetailRepository = AppDataSource.getRepository(PurchaseOrderDetail);
      const productDetailRepository = AppDataSource.getRepository(ProductDetail);
  
      const {
        userId,
        createAt,
        listProduct
      } = req.body;
  

        const newPurchaseOrder = new PurchaseOrder();
        newPurchaseOrder.OrderDate = createAt;
        newPurchaseOrder.StaffID = userId;
        newPurchaseOrder.isActive = true;  
        let purchaseOrderDetails = []; 
        await purchaseOrderRepository.save(newPurchaseOrder);
        


      let i = 0;
      for (const productData of listProduct) {

    
        let productDetailID = null;

        
        const existingProductDetail = await productDetailRepository.findOne({where:{
            ProductID: productData.productID,
            SupplierID: productData.supplierId
          }});
    
        if (!existingProductDetail) {
              // Nếu chi tiết sản phẩm chưa tồn tại, tạo mới chi tiết sản phẩm
              const newProductDetail = new ProductDetail();
              newProductDetail.ProductID = productData.productID;
              newProductDetail.SupplierID = productData.supplierId;
              newProductDetail.SellingPrice = productData.sellingPrice;
              newProductDetail.PurchasePrice = productData.purchasePrice;
              newProductDetail.Quantity = productData.quantity;
              newProductDetail.isActive = true;
              
              // Lưu chi tiết sản phẩm vào cơ sở dữ liệu

  
              const newPurchaseOrderDetail = new PurchaseOrderDetail();
              newPurchaseOrderDetail.PurchasePrice = productData.purchasePrice;
              newPurchaseOrderDetail.Quantity = productData.quantity;
              newPurchaseOrderDetail.productDetail = newProductDetail; //YES
              newPurchaseOrderDetail.purchaseOrder = newPurchaseOrder;
              newPurchaseOrderDetail.OrderId = newPurchaseOrder.OrderID;
              newPurchaseOrderDetail.isActive = true;
        
              newProductDetail.purchaseOrderDetails = [newPurchaseOrderDetail]; //YES
              await productDetailRepository.save(newProductDetail);//YES
              
              
              purchaseOrderDetails.push(newPurchaseOrderDetail);



              await purchaseOrderDetailRepository.save(newPurchaseOrderDetail);
              
           
          } else {
            // Nếu chi tiết sản phẩm đã tồn tại, cập nhật số lượng và giá mua
            existingProductDetail.Quantity += Number(productData.quantity);
            existingProductDetail.PurchasePrice = productData.purchasePrice;
    
            // Lưu chi tiết sản phẩm đã cập nhật vào cơ sở dữ liệu
            await productDetailRepository.save(existingProductDetail);
            productDetailID = existingProductDetail.ProductDetailID;
            
            
            const newPurchaseOrderDetail = new PurchaseOrderDetail();
            newPurchaseOrderDetail.PurchasePrice = productData.purchasePrice;
            newPurchaseOrderDetail.Quantity = productData.quantity;
            newPurchaseOrderDetail.productDetail = existingProductDetail;
            newPurchaseOrderDetail.OrderId = newPurchaseOrder.OrderID;
            
            newPurchaseOrderDetail.purchaseOrder = newPurchaseOrder;
            newPurchaseOrderDetail.isActive = true;
      
            existingProductDetail.purchaseOrderDetails = [newPurchaseOrderDetail];
            await productDetailRepository.save(existingProductDetail);

            purchaseOrderDetails.push(newPurchaseOrderDetail);
            
            await purchaseOrderDetailRepository.save(newPurchaseOrderDetail);

          }

      }
  
      newPurchaseOrder.purchaseOrderDetails = purchaseOrderDetails
      
      
      // Sau khi hoàn thành, trả về thông báo thành công
      return res.status(201).json({
        message: 'Đã tạo đơn hàng mua thành công',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Lỗi máy chủ nội bộ'+ error ,
      });
    }
  }
  
  async update(req, res) {
    try {
      const purchaseOrderRepository = AppDataSource.getRepository(PurchaseOrder);
      const purchaseOrderDetailRepository = AppDataSource.getRepository(PurchaseOrderDetail);
      const productDetailRepository = AppDataSource.getRepository(ProductDetail);
  
      const {
        orderId,
        listProduct
      } = req.body;
  
      // Tìm đơn hàng mua cần cập nhật
      const existingPurchaseOrder = await purchaseOrderRepository.findOne(orderId);
  
      if (!existingPurchaseOrder) {
        return res.status(404).json({
          error: 'Không tìm thấy đơn hàng mua',
        });
      }
  
      // Cập nhật thông tin đơn hàng mua (nếu cần)
      // Ví dụ: existingPurchaseOrder.OrderDate = updatedOrderDate;
      // let totalPurchasePrice = 0;
      let purchaseOrderDetails = existingPurchaseOrder.purchaseOrderDetails || [];
  
      for (const productData of listProduct) {
        // totalPurchasePrice+=productData.purchasePrice;
        const existingProductDetail = await productDetailRepository.findOne({
          where: {
            ProductID: productData.productID,
            SupplierID: productData.supplierId
          }
        });
  
        if (!existingProductDetail) {
          // Tạo mới chi tiết sản phẩm nếu không tồn tại
          // Sử dụng logic tạo mới từ hàm create
  
          const newProductDetail = new ProductDetail();
          newProductDetail.ProductID = productData.productID;
          newProductDetail.SupplierID = productData.supplierId;
          newProductDetail.SellingPrice = productData.sellingPrice;
          newProductDetail.PurchasePrice = productData.purchasePrice;
          newProductDetail.Quantity = productData.quantity;
          newProductDetail.isActive = true;
  
          // Lưu chi tiết sản phẩm vào cơ sở dữ liệu
          await productDetailRepository.save(newProductDetail);
  
          const newPurchaseOrderDetail = new PurchaseOrderDetail();
          newPurchaseOrderDetail.PurchasePrice = productData.purchasePrice;
          newPurchaseOrderDetail.Quantity = productData.quantity;
          newPurchaseOrderDetail.productDetail = newProductDetail;
          newPurchaseOrderDetail.purchaseOrder = existingPurchaseOrder;
          newPurchaseOrderDetail.OrderId = existingPurchaseOrder.OrderID;
          newPurchaseOrderDetail.isActive = true;
  
          newProductDetail.purchaseOrderDetails = [newPurchaseOrderDetail];
          await productDetailRepository.save(newProductDetail);
  
          purchaseOrderDetails.push(newPurchaseOrderDetail);
  
          await purchaseOrderDetailRepository.save(newPurchaseOrderDetail);
        } else {
          // Cập nhật số lượng và giá mua nếu chi tiết sản phẩm đã tồn tại
          existingProductDetail.Quantity += Number(productData.quantity);
          existingProductDetail.PurchasePrice = productData.purchasePrice;
  
          // Lưu chi tiết sản phẩm đã cập nhật vào cơ sở dữ liệu
          await productDetailRepository.save(existingProductDetail);
  
          const newPurchaseOrderDetail = new PurchaseOrderDetail();
          newPurchaseOrderDetail.PurchasePrice = productData.purchasePrice;
          newPurchaseOrderDetail.Quantity = productData.quantity;
          newPurchaseOrderDetail.productDetail = existingProductDetail;
          newPurchaseOrderDetail.OrderId = existingPurchaseOrder.OrderID;
  
          existingProductDetail.purchaseOrderDetails = [newPurchaseOrderDetail];
          await productDetailRepository.save(existingProductDetail);
  
          purchaseOrderDetails.push(newPurchaseOrderDetail);
          await purchaseOrderDetailRepository.save(newPurchaseOrderDetail);
        }
      }
      
      existingPurchaseOrder.purchaseOrderDetails = purchaseOrderDetails;
  
      // Cập nhật thông tin đơn hàng mua trong cơ sở dữ liệu
      await purchaseOrderRepository.save(existingPurchaseOrder);
  
      return res.status(200).json({
        message: 'Đã cập nhật đơn hàng mua thành công',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Lỗi máy chủ nội bộ' + error,
      });
    }
  }
  



}

export default new PurchaseService();
