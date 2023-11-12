import { AppDataSource } from "../data-source";
import {
  Receipt,
  Staff,
  Service,
  Customer,
  Vehicle,
  Brand,
  PQProductDetail,
  PQServiceDetail,
  PriceQuote,
  Product,
  ProductDetail,
  RepairOrder,
  RepairOrderDetail,
} from "../model";
import messages from "../messageResponse.js";

// {
//   "Status": "Pending",
//   "Time": "2023-10-21T10:00:00Z",
//   "StaffID": 1,
//   "ReceiptID": 123,
//   "priceQuoteServiceDetails": [
//     {
//       "Price": 50.00,
//       "ServiceID": 456
//     },
//     {
//       "Price": 75.00,
//       "ServiceID": 789
//     }
//   ],
//   "priceQuoteProductDetails": [
//     {
//       "SellingPrice": 100.00,
//       "PurchasePrice": 80.00,
//       "Quantity": 5
//     },
//     {
//       "SellingPrice": 150.00,
//       "PurchasePrice": 120.00,
//       "Quantity": 3
//     }
//   }
// }

class PriceQuoteService {
  async getAll(_, res) {
    try {
      const priceQuote = await AppDataSource.getRepository(PriceQuote).find({
        where: { isActive: true },
        relations: [
          "staff",
          "invoice",
          "receipt",
          "receipt.vehicle",
          "receipt.customer",
          "priceQuoteServiceDetails",
          "priceQuoteServiceDetails.service",
          "priceQuoteServiceDetails.repairOrderDetails.staff",
          "priceQuoteProductDetails.productDetail.product.brand",
          "priceQuoteProductDetails.productDetail.supplier",
          "repairOrder"
        ],
      });

      return res.json(priceQuote.reverse());
    } catch (error) {
      return res
        .status(500)
        .json({ error: messages.internalServerError + error });
    }
  }

  async getById(req, res) {
    try {
      const receiptId = req.params.id;
      const receipt = await AppDataSource.getRepository(PriceQuote).findOne({
        where: { QuoteID: receiptId, isActive: true },
        relations: [
          "staff",
          "receipt",
          "priceQuoteServiceDetails",
          "priceQuoteProductDetails",
        ],
      });

      if (!receipt) {
        return res.status(404).json({ message: messages.notFound });
      }

      return res.json(receipt);
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  // async create(req, res) {
  //   try {
  //     const priceQuoteRepository = AppDataSource.getRepository(PriceQuote);
  //     const receiptRepository = AppDataSource.getRepository(Receipt);
  //     const PQProductDetailRepository =
  //       AppDataSource.getRepository(PQProductDetail);
  //     const PQServiceDetailRepository =
  //       AppDataSource.getRepository(PQServiceDetail);
  //     const serviceRepository = AppDataSource.getRepository(Service);
  //     const productDetailRepo = AppDataSource.getRepository(ProductDetail);
  //     const repairOrderRepo = AppDataSource.getRepository(RepairOrder);
  //     const repairOrderDetailRepo =
  //       AppDataSource.getRepository(RepairOrderDetail);

  //     const {
  //       Status,
  //       Time,
  //       StaffID,
  //       ReceiptID,
  //       priceQuoteServiceDetails,
  //       priceQuoteProductDetails,
  //     } = req.body;

  //     const requiredFields = [
  //       "Status",
  //       "Time",
  //       "StaffID",
  //       "ReceiptID",
  //       "priceQuoteServiceDetails",
  //       "priceQuoteProductDetails",
  //     ];

  //     const missingFields = requiredFields.filter(
  //       (field) => !req.body.hasOwnProperty(field)
  //     );

  //     if (missingFields.length > 0) {
  //       return res.status(400).json({
  //         code: 400,
  //         message: `Missing fields: ${missingFields.join(", ")}`,
  //       });
  //     }
  //     console.log("status:", Status);

  //     let CheckAcceptedRepair = false;
  //     if (Status == 1) {
  //       CheckAcceptedRepair = true;
  //     }

  //     let existPriceQuote = await priceQuoteRepository.findOne({
  //       where: { ReceiptID: ReceiptID },
  //     });

  //     if (existPriceQuote) {
  //       return res.status(400).json({
  //         code: 400,
  //         message: `PriceQuote exist !!!`,
  //       });
  //     }

  //     const newPriceQuote = new PriceQuote();
  //     newPriceQuote.Status = Status;
  //     newPriceQuote.ReceiptID = ReceiptID;
  //     newPriceQuote.Time = Time;
  //     newPriceQuote.StaffID = StaffID;
  //     newPriceQuote.isActive = true;
  //     let existReceipt = await receiptRepository.findOne({
  //       where: { ReceiptID: ReceiptID },
  //     });

  //     newPriceQuote.receipt = existReceipt;

  //     console.log("find status of new pricequote:", newPriceQuote.Status);

  //     await priceQuoteRepository.save(newPriceQuote);

  //     // tao phieu sua chua, nhung chua cho sua chua;
  //     const newRepairOrder = new RepairOrder();
  //     newRepairOrder.IsDone = false;
  //     newRepairOrder.QuoteID = newPriceQuote.QuoteID;
  //     newRepairOrder.priceQuote = newPriceQuote;
  //     console.log("newPriceQuote.QuoteID", newPriceQuote.QuoteID);

  //     await repairOrderRepo.save(newRepairOrder);

  //     let newPriceQuoteServiceDetails = [];
  //     let newPriceQuoteProductDetails = [];

  //     for (const priceQuoteServiceElement of priceQuoteServiceDetails) {
  //       let newPriceQuoteService = new PQServiceDetail();
  //       newPriceQuoteService.Price = priceQuoteServiceElement.Price;
  //       newPriceQuoteService.ServiceID = priceQuoteServiceElement.ServiceID;
  //       newPriceQuoteService.QuoteID = newPriceQuote.QuoteID;
  //       newPriceQuoteService.priceQuote = newPriceQuote;
  //       newPriceQuoteService.isAcceptedRepair = CheckAcceptedRepair;
  //       PQServiceDetailRepository.save(newPriceQuoteService);

  //       //tao chi tiet sua chua
  //       let newRepairOrderDetail = new RepairOrderDetail();
  //       newRepairOrderDetail.IsDone = false;
  //       newRepairOrderDetail.RepairOrderID = newRepairOrder.RepairOrderID;
  //       newRepairOrderDetail.StaffID = priceQuoteServiceElement.Technician;
  //       newRepairOrderDetail.pqServiceDetail = newPriceQuoteService;
  //       repairOrderDetailRepo.save(newRepairOrderDetail);

  //       newPriceQuoteServiceDetails.push(newPriceQuoteService);
  //     }

  //     for (const priceQuoteProductElement of priceQuoteProductDetails) {
  //       let newPriceQuoteProduct = new PQProductDetail();
  //       newPriceQuoteProduct.SellingPrice =
  //         priceQuoteProductElement.SellingPrice;
  //       newPriceQuoteProduct.PurchasePrice =
  //         priceQuoteProductElement.PurchasePrice;
  //       newPriceQuoteProduct.Quantity = priceQuoteProductElement.Quantity;
  //       newPriceQuoteProduct.isAcceptedRepair = CheckAcceptedRepair;

  //       let productDetail = await productDetailRepo.findOne({
  //         where: {
  //           ProductDetailID: priceQuoteProductElement.productDetailID,
  //           isActive: true,
  //         },
  //       });
  //       newPriceQuoteProduct.priceQuote = newPriceQuote;
  //       newPriceQuoteProduct.productDetail = productDetail;
  //       newPriceQuoteProduct.QuoteID = newPriceQuote.QuoteID;
  //       PQProductDetailRepository.save(newPriceQuoteProduct);
  //       newPriceQuoteProductDetails.push(newPriceQuoteProduct);
  //     }
  //     newPriceQuote.priceQuoteProductDetails = newPriceQuoteProductDetails;
  //     newPriceQuote.priceQuoteServiceDetails = newPriceQuoteServiceDetails;

  //     return res.status(201).json({
  //       message: "Tao phieu bao gia thanh cong",
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: messages.internalServerError + error,
  //     });
  //   }
  // }

  // 


  async create(req, res) {
    try {
      const priceQuoteRepository = AppDataSource.getRepository(PriceQuote);
      const receiptRepository = AppDataSource.getRepository(Receipt);
      const PQProductDetailRepository = AppDataSource.getRepository(PQProductDetail);
      const PQServiceDetailRepository = AppDataSource.getRepository(PQServiceDetail);
      const serviceRepository = AppDataSource.getRepository(Service);
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const repairOrderRepo = AppDataSource.getRepository(RepairOrder);
      const repairOrderDetailRepo = AppDataSource.getRepository(RepairOrderDetail);
  
      const {
        Status,
        Time,
        StaffID,
        ReceiptID,
        priceQuoteServiceDetails,
        priceQuoteProductDetails,
        TimeCreateRepair
      } = req.body;
  
      const requiredFields = [
        "Status",
        "Time",
        "StaffID",
        "ReceiptID",
        "priceQuoteServiceDetails",
        "priceQuoteProductDetails",
      ];
  
      const missingFields = requiredFields.filter(
        (field) => !req.body.hasOwnProperty(field)
      );
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          code: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }
  
      let CheckAcceptedRepair = false;
      if (Status == 1) {
        CheckAcceptedRepair = true;
      }
  
      // Thử tìm PriceQuote đã tồn tại với ReceiptID
      const existPriceQuote = await priceQuoteRepository.findOne({
        where: { ReceiptID: ReceiptID },
      });
  
      // if (existPriceQuote) {
      //   return res.status(400).json({
      //     code: 400,
      //     message: `PriceQuote exist !!!`,
      //   });
      // }
  
      const newPriceQuote = new PriceQuote();
      newPriceQuote.Status = Status;
      newPriceQuote.ReceiptID = ReceiptID;
      newPriceQuote.Time = Time;
      newPriceQuote.StaffID = StaffID;
      newPriceQuote.isActive = true;


      const existReceipt = await receiptRepository.findOne({
        where: { ReceiptID: ReceiptID },
      });
  
      newPriceQuote.receipt = existReceipt;
  
      await priceQuoteRepository.save(newPriceQuote);
  
      // Tạo phieu sua chua, nhung chua cho sua chua;
      try {
        const newRepairOrder = new RepairOrder();
        newRepairOrder.IsDone = false;
        newRepairOrder.QuoteID = newPriceQuote.QuoteID;
        newRepairOrder.priceQuote = newPriceQuote;
        if (TimeCreateRepair) {
          newRepairOrder.TimeCreate = TimeCreateRepair;
        }

        await repairOrderRepo.save(newRepairOrder);
  
        let newPriceQuoteServiceDetails = [];
        let newPriceQuoteProductDetails = [];
  
        // Bắt lỗi cho phần tạo PriceQuoteServiceDetails
        try {
          for (const priceQuoteServiceElement of priceQuoteServiceDetails) {
            let newPriceQuoteService = new PQServiceDetail();
            newPriceQuoteService.Price = priceQuoteServiceElement.Price;
            newPriceQuoteService.ServiceID = priceQuoteServiceElement.ServiceID;
            newPriceQuoteService.QuoteID = newPriceQuote.QuoteID;
            newPriceQuoteService.priceQuote = newPriceQuote;
            newPriceQuoteService.isAcceptedRepair =CheckAcceptedRepair;
            await PQServiceDetailRepository.save(newPriceQuoteService);
  
            // Tạo chi tiết sua chua
            try {
              let newRepairOrderDetail = new RepairOrderDetail();
              newRepairOrderDetail.IsDone = false;
              newRepairOrderDetail.RepairOrderID = newRepairOrder.RepairOrderID;
              newRepairOrderDetail.StaffID = priceQuoteServiceElement.Technician;
              newRepairOrderDetail.pqServiceDetail = newPriceQuoteService;
              await repairOrderDetailRepo.save(newRepairOrderDetail);
  
              newPriceQuoteServiceDetails.push(newPriceQuoteService);
            } catch (error) {
              return res.status(500).json({
                error: `Error while creating RepairOrderDetail: ${error}`,
              });
            }
          }
        } catch (error) {
          return res.status(500).json({
            error: `Error while creating PriceQuoteServiceDetails: ${error}`,
          });
        }
  
        // Bắt lỗi cho phần tạo PriceQuoteProductDetails
        try {
          for (const priceQuoteProductElement of priceQuoteProductDetails) {
            let newPriceQuoteProduct = new PQProductDetail();    if (existPriceQuote) {
              return res.status(400).json({
                code: 400,
                message: `PriceQuote exist !!!`,
              });
            }
        
            newPriceQuoteProduct.SellingPrice = priceQuoteProductElement.SellingPrice;
            newPriceQuoteProduct.PurchasePrice = priceQuoteProductElement.PurchasePrice;
            newPriceQuoteProduct.Quantity = priceQuoteProductElement.Quantity;
            newPriceQuoteProduct.isAcceptedRepair = CheckAcceptedRepair;
  
            let productDetail = await productDetailRepo.findOne({
              where: {
                ProductDetailID: priceQuoteProductElement.productDetailID,
                isActive: true,
              },
            });
            newPriceQuoteProduct.priceQuote = newPriceQuote;
            newPriceQuoteProduct.productDetail = productDetail;
            newPriceQuoteProduct.QuoteID = newPriceQuote.QuoteID;
            await PQProductDetailRepository.save(newPriceQuoteProduct);
  
            newPriceQuoteProductDetails.push(newPriceQuoteProduct);
          }
        } catch (error) {
          return res.status(500).json({
            error: `Error while creating PriceQuoteProductDetails: ${error}`,
          });
        }
  
        newPriceQuote.priceQuoteProductDetails = newPriceQuoteProductDetails;
        newPriceQuote.priceQuoteServiceDetails = newPriceQuoteServiceDetails;
  
        return res.status(201).json({
          message: "Tao phieu bao gia thanh cong",
        });
      } catch (error) {
        return res.status(500).json({
          error: `Error while creating RepairOrder: ${error}`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }
  

  async update(req, res) {
    try {
      const priceQuoteRepository = AppDataSource.getRepository(PriceQuote);
      const receiptRepository = AppDataSource.getRepository(Receipt);
      const PQProductDetailRepository =
        AppDataSource.getRepository(PQProductDetail);
      const PQServiceDetailRepository =
        AppDataSource.getRepository(PQServiceDetail);
      const serviceRepository = AppDataSource.getRepository(Service);
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const repairOrderRepo = AppDataSource.getRepository(RepairOrder);
      const repairOrderDetailRepo =
        AppDataSource.getRepository(RepairOrderDetail);

      const { id } = req.params;

      const {
        Status,
        TimeUpdate,
        EditorID,
        priceQuoteServiceDetails,
        priceQuoteProductDetails,
        TimeCreateRepair
      } = req.body;

      const requiredFields = [
        "Status",
        "TimeUpdate",
        "EditorID",
        "priceQuoteServiceDetails",
        "priceQuoteProductDetails",
      ];

      const missingFields = requiredFields.filter(
        (field) => !req.body.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          code: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      const existingPriceQuote = await priceQuoteRepository.findOne({
        where: { QuoteID: id },
      });


      if (!existingPriceQuote) {
        return res.status(404).json({
          code: 404,
          message: "Không tìm thấy phieu bao gia cần cập nhật." + id,
        });
      }

      existingPriceQuote.Status = Status;
      existingPriceQuote.Editor = EditorID;
      existingPriceQuote.TimeUpdate = TimeUpdate;

      await priceQuoteRepository.save(existingPriceQuote);

      // TH1: STATUS = 0,1 , Tim phieu sua chua, delete all, va them moi toan bo
      if (Status === 1 || Status === 0 || Status === 2) {

        let CheckAcceptedRepair = false;
        if (Status == 1) {
          CheckAcceptedRepair = true;
        }
      
        try {
         
          // step 1: tim va delete phieu sua chua cu, service cu:
          let existingRepairOrder = await repairOrderRepo.findOne({
            where: { QuoteID: existingPriceQuote.QuoteID },
          });
        
          if (existingRepairOrder) {
            let checkDeleteAll =  await repairOrderDetailRepo
              .createQueryBuilder()
              .delete()
              .from(RepairOrderDetail)
              .where("RepairOrderID = :repairOrderID", {
                repairOrderID: existingRepairOrder.RepairOrderID,
              })
              .execute();
              console.log("checkDeleteAll",checkDeleteAll);
              
            let checkDeleteAllProductPrevious = await PQProductDetailRepository
            .createQueryBuilder()
            .delete()
            .from(PQProductDetail)
            .where("QuoteID = :QuoteID", {
              QuoteID: existingPriceQuote.QuoteID,
            })
            .execute();

            console.log("checkDeleteAllProductPrevious",checkDeleteAllProductPrevious);

              
            let checkDeleteAllServicePrevious = await PQServiceDetailRepository
            .createQueryBuilder()
            .delete()
            .from(PQServiceDetail)
            .where("QuoteID = :QuoteID", {
              QuoteID: existingPriceQuote.QuoteID,
            })
            .execute();


            console.log("checkDeleteAllServicePrevious",checkDeleteAllServicePrevious);
            await repairOrderRepo.remove(existingRepairOrder);
          } else {
            // Xử lý khi không tìm thấy phieu sua chua cu, có thể thông báo hoặc thực hiện hành động khác tùy thuộc vào yêu cầu của bạn.
            // Ví dụ:
            return res.status(404).json({
              code: 404,
              message: "Không tìm thấy phieu sua chua cần xóa.",
            });
          }
        } catch (error) {
          // Xử lý lỗi khi xảy ra trong quá trình xóa
          console.error("Lỗi xóa phieu sua chua:", error);
          return res.status(500).json({
            error: "Lỗi xóa phieu sua chua: " + error.message,
          });
        }
        
        try {
          // Tạo phieu sua chua, nhung chua cho sua chua;
          const newRepairOrder = new RepairOrder();
          newRepairOrder.IsDone = false;
          newRepairOrder.QuoteID = existingPriceQuote.QuoteID;
          newRepairOrder.priceQuote = existingPriceQuote;
      
          if (TimeCreateRepair) {
            newRepairOrder.TimeCreate = TimeCreateRepair;
          }
  
          await repairOrderRepo.save(newRepairOrder);
        
          let newPriceQuoteServiceDetails = [];
          let newPriceQuoteProductDetails = [];
        
          for (const priceQuoteServiceElement of priceQuoteServiceDetails) {
            let newPriceQuoteService = new PQServiceDetail();
            newPriceQuoteService.Price = priceQuoteServiceElement.Price;
            newPriceQuoteService.ServiceID = priceQuoteServiceElement.ServiceID;
            newPriceQuoteService.QuoteID = existingPriceQuote.QuoteID;
            newPriceQuoteService.priceQuote = existingPriceQuote;
            newPriceQuoteService.isAcceptedRepair = priceQuoteServiceElement.isAcceptedRepair ||  CheckAcceptedRepair;
            await PQServiceDetailRepository.save(newPriceQuoteService);
        
            // Tạo chi tiết sua chua
            let newRepairOrderDetail = new RepairOrderDetail();
            newRepairOrderDetail.IsDone = false;
            newRepairOrderDetail.RepairOrderID = newRepairOrder.RepairOrderID;
            newRepairOrderDetail.StaffID = priceQuoteServiceElement.Technician;
            newRepairOrderDetail.pqServiceDetail = newPriceQuoteService;
            await repairOrderDetailRepo.save(newRepairOrderDetail);
        
            newPriceQuoteServiceDetails.push(newPriceQuoteService);
          }
        
          for (const priceQuoteProductElement of priceQuoteProductDetails) {
            let newPriceQuoteProduct = new PQProductDetail();
            newPriceQuoteProduct.SellingPrice = priceQuoteProductElement.SellingPrice;
            newPriceQuoteProduct.PurchasePrice = priceQuoteProductElement.PurchasePrice;
            newPriceQuoteProduct.Quantity = priceQuoteProductElement.Quantity;
            newPriceQuoteProduct.isAcceptedRepair =priceQuoteProductElement.isAcceptedRepair ||  CheckAcceptedRepair;
        
            let productDetail = await productDetailRepo.findOne({
              where: {
                ProductDetailID: priceQuoteProductElement.productDetailID,
                isActive: true,
              },
            });
            newPriceQuoteProduct.priceQuote = existingPriceQuote;
            newPriceQuoteProduct.productDetail = productDetail;
            newPriceQuoteProduct.QuoteID = existingPriceQuote.QuoteID;
            await PQProductDetailRepository.save(newPriceQuoteProduct);
            newPriceQuoteProductDetails.push(newPriceQuoteProduct);
          }
        
          existingPriceQuote.priceQuoteProductDetails = newPriceQuoteProductDetails;
          existingPriceQuote.priceQuoteServiceDetails = newPriceQuoteServiceDetails;
        } catch (error) {
          // Xử lý lỗi khi xảy ra trong quá trình tạo phieu sua chua và chi tiết sua chua
          console.error("Lỗi khi tạo phieu sua chua:", error);
          return res.status(500).json({
            error: "Lỗi khi tạo phieu sua chua: " + error.message,
          });
        }
        
        
      }
      // TH2: STATUS = 2: Append vao data da co.duyet 2 mang priceQuoteProductDetails va priceQuoteServiceDetails trong database, neu du lieu da co thi khong them vao, chi them nhung element moi

      // if (Status === 2 || Status === 3) {
      //   let CheckAcceptedRepair = false;
      //   if (Status == 3) {
      //     CheckAcceptedRepair = true;
      //   }

      //   let existingRepairOrder = await repairOrderRepo.findOne({
      //     where: { QuoteID: existingPriceQuote.QuoteID },
      //   });

      //   for (const priceQuoteServiceElement of priceQuoteServiceDetails) {
      //     let newPriceQuoteService = new PQServiceDetail();
      //     newPriceQuoteService.Price = priceQuoteServiceElement.Price;
      //     newPriceQuoteService.ServiceID = priceQuoteServiceElement.ServiceID;
      //     newPriceQuoteService.QuoteID = existingPriceQuote.QuoteID;
      //     newPriceQuoteService.priceQuote = existingPriceQuote;
      //     newPriceQuoteService.isAcceptedRepair = CheckAcceptedRepair;
      //     PQServiceDetailRepository.save(newPriceQuoteService);

      //     //tao chi tiet sua chua
      //     let newRepairOrderDetail = new RepairOrderDetail();
      //     newRepairOrderDetail.IsDone = false;
      //     newRepairOrderDetail.RepairOrderID =
      //       existingRepairOrder.RepairOrderID;
      //     newRepairOrderDetail.StaffID = priceQuoteServiceElement.Technician;
      //     newRepairOrderDetail.pqServiceDetail = newPriceQuoteService;
      //     repairOrderDetailRepo.save(newRepairOrderDetail);
      //   }

      //   for (const priceQuoteProductElement of priceQuoteProductDetails) {
      //     let newPriceQuoteProduct = new PQProductDetail();
      //     newPriceQuoteProduct.SellingPrice =
      //       priceQuoteProductElement.SellingPrice;
      //     newPriceQuoteProduct.PurchasePrice =
      //       priceQuoteProductElement.PurchasePrice;
      //     newPriceQuoteProduct.Quantity = priceQuoteProductElement.Quantity;
      //     newPriceQuoteProduct.isAcceptedRepair = CheckAcceptedRepair;

      //     let productDetail = await productDetailRepo.findOne({
      //       where: {
      //         ProductDetailID: priceQuoteProductElement.productDetailID,
      //         isActive: true,
      //       },
      //     });
      //     newPriceQuoteProduct.priceQuote = existingPriceQuote;
      //     newPriceQuoteProduct.productDetail = productDetail;
      //     newPriceQuoteProduct.QuoteID = existingPriceQuote.QuoteID;
      //     PQProductDetailRepository.save(newPriceQuoteProduct);
      //   }
      // }

      return res.status(201).json({
        message: "update phieu bao gia thanh cong",
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }
}

export default new PriceQuoteService();










