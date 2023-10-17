# monthaytru
# Hướng dẫn cài đặt project "Garage"

Project "Garage" bao gồm phần backend viết bằng Express.js, phần frontend viết bằng React.js, và sử dụng cơ sở dữ liệu MySQL. Dưới đây là hướng dẫn cài đặt và chạy dự án.

## Yêu cầu

- Node.js: [Tải về Node.js](https://nodejs.org/)
- MySQL: [Tải về MySQL](https://dev.mysql.com/downloads/)

## Backend (Express.js)

1. Di chuyển vào thư mục backend:

cd backend

2. Cài đặt các gói phụ thuộc:
npm install

3. Cấu hình trong tệp `.env` bằng cách đặt các biến môi trường sau:
SECRET_KEY=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=


4. Chạy cơ sở dữ liệu migrations để tạo bảng:
npm run migrate


5. Khởi động backend server:
npm start



Backend server sẽ chạy tại http://localhost:8888.

## Frontend (React.js)

1. Di chuyển vào thư mục frontend:
cd frontend


2. Cài đặt các gói phụ thuộc:
npm install


3. Khởi động ứng dụng React:
npm start


Ứng dụng React sẽ chạy tại http://localhost:3000.

## Sử dụng

Bây giờ bạn có thể truy cập ứng dụng frontend bằng cách mở trình duyệt tại `http://localhost:3000` và kết nối nó với backend server tại `http://localhost:8888` để làm việc với cơ sở dữ liệu MySQL.

## Đóng góp

Nếu bạn muốn đóng góp cho dự án "Garage," vui lòng làm theo hướng dẫn [CONTRIBUTING.md](CONTRIBUTING.md).



