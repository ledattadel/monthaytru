import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  Role,
  Staff,
  Customer,
  Invoice,
  Brand,
  PQProductDetail,
  PQServiceDetail,
  PriceQuote,
  Product,
  ProductDetail,
  PurchaseOrder,
  PurchaseOrderDetail,
  Receipt,
  RepairOrder,
  RepairOrderDetail,
  Service,
  Supplier,
  Vehicle
} from './model';




export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'databasetest2',
  synchronize: true,
  logging: false,
  entities: [
  Role,
  Staff,
  Customer,
  Invoice,
  Brand,
  PQProductDetail,
  PQServiceDetail,
  PriceQuote,
  Product,
  ProductDetail,
  PurchaseOrder,
  PurchaseOrderDetail,
  Receipt,
  RepairOrder,
  RepairOrderDetail,
  Service,
  Supplier,
  Vehicle
  ],
  migrations: [],
  subscribers: [],
});
