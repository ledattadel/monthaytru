const messages = {
  // STAFF
  wrongLengthPasswordWhenSignIn: 'Mật khẩu có độ dài từ 6 đến 32 kí tự', 
  userNotInputUsername:'Vui lòng nhập tài khoản',
  userNotInputPassword:'Vui lòng nhập mật khẩu',
  userNotInputUsernamePassword:'Vui lòng nhập tài khoản và mật khẩu',
  accountExists: 'Tài khoản này đã tồn tại, vui lòng chọn tên đăng nhập khác.',
  idCardExists: 'Số chứng minh nhân dân này đã được sử dụng, vui lòng nhập một số khác.',
  emailExists: 'Địa chỉ email này đã được sử dụng, vui lòng nhập một địa chỉ email khác.',
  roleNameNotExist: 'Tên vai trò không tồn tại trong hệ thống.',
  roleExists: 'Vai trò này đã được sử dụng, vui lòng chọn một vai trò khác.',
  badRequest: 'Yêu cầu không hợp lệ: Yêu cầu thiếu dữ liệu hoặc bị hỏng.',
  unauthorized: 'Truy cập bị từ chối do thông tin đăng nhập không hợp lệ.',
  notFound: 'Không tìm thấy: Không tìm thấy tài nguyên được yêu cầu.',
  created: 'Đã tạo thành công',
  internalServerError: 'Lỗi máy chủ nội bộ: Đã xảy ra lỗi trên máy chủ.',
  missingRoleName: 'Thiếu các trường dữ liệu: tên vai trò',
  accountNotFoundWhenSignIn: 'Không tìm thấy tài khoản này',
  wrongPasswordWhenSignIn: 'Mật khẩu không chính xác, vui lòng thử lại',
  missingToken: 'Truy cập bị từ chối: Token bị thiếu',
  invalidToken: 'Truy cập bị từ chối: Token không hợp lệ',
  UnauthorizedUser: 'Truy cập bị từ chối: Người dùng không được xác thực',
  notAdminRole: 'Từ chối: Người dùng không có vai trò quản trị viên',
  notManageRole: 'Từ chối: Người dùng không có vai trò quản lý',
  notTechnicianRole: 'Từ chối: Người dùng không có vai trò kỹ thuật viên',
  notAdminOrManageRole: 'Từ chối: Người dùng không có vai trò quản lý hoặc quản trị viên',
  missingStaffIDWhenUpdate: 'ID nhân viên bị thiếu trong yêu cầu',
  createStaffSuccessful:'Tạo nhân viên thành công',
  updateStaffSuccessful: 'Nhân viên đã được cập nhật thành công',
  deleteStaffSuccessful: 'Nhân viên đã được xóa thành công',
  // CUSTOMER
  customerMissingNameAndPhoneNumber: 'Thiếu các trường dữ liệu bắt buộc: tên và số điện thoại',
  findExistingCustomerWhenCreate: 'Một khách hàng với cùng số điện thoại đã tồn tại',
  createCustomerSuccessful: 'Khách hàng đã được tạo thành công',
  updateCustomerSuccessful: 'Khách hàng đã được cập nhật thành công',
  deleteCustomerSuccessful: 'Khách hàng đã được xóa thành công',
  // SERVICE
  missingServiceFields: 'Thiếu các trường dữ liệu bắt buộc: tên dịch vụ hoặc giá',
  findExistingServiceWhenCreate: 'Một dịch vụ với cùng tên đã tồn tại',
  createServiceSuccessful: 'Dịch vụ đã được tạo thành công',
  updateServiceSuccessful: 'Dịch vụ đã được cập nhật thành công',
  deleteServiceSuccessful: 'Dịch vụ đã được xóa thành công',
  // BRAND
  missingBrandFields: 'Thiếu các trường dữ liệu bắt buộc: tên thương hiệu',
  findExistingBrandWhenCreate: 'Một thương hiệu với cùng tên đã tồn tại',
  createBrandSuccessful: 'Thương hiệu đã được tạo thành công',
  updateBrandSuccessful: 'Thương hiệu đã được cập nhật thành công',
  deleteBrandSuccessful: 'Thương hiệu đã được xóa thành công',

  // VEHICLE
  missingVehicleFields: 'Thiếu các trường dữ liệu bắt buộc: biển số xe',
  findExistingVehicleWhenCreate: 'Một xe với cùng biển số đã tồn tại',
  createVehicleSuccessful: 'Xe đã được tạo thành công',
  updateVehicleSuccessful: 'Xe đã được cập nhật thành công',
  deleteVehicleSuccessful: 'Xe đã được xóa thành công',


    // SUPPLIER
    missingSupplierFields: 'Thiếu các trường dữ liệu bắt buộc: tên nhà cung cấp, số điện thoại, địa chỉ',
    findExistingSupplierWhenCreate: 'Một nhà cung cấp với cùng tên đã tồn tại',
    createSupplierSuccessful: 'Nhà cung cấp đã được tạo thành công',
    updateSupplierSuccessful: 'Nhà cung cấp đã được cập nhật thành công',
    deleteSupplierSuccessful: 'Nhà cung cấp đã được xóa thành công',


     // PRODUCT
     missingProductFields: 'Thiếu các trường dữ liệu bắt buộc',
     findExistingProductWhenCreate: 'Một sản phẩm với cùng tên đã tồn tại',
     createProductSuccessful: 'sản phẩm đã được tạo thành công',
     updateProductSuccessful: 'sản phẩm đã được cập nhật thành công',
     deleteProductSuccessful: 'sản phẩm đã được xóa thành công', 



     // RECEPIT
     missingReceiptFields: 'Thiếu các trường dữ liệu bắt buộc',
     createReceiptSuccessful: 'Phiếu tiếp nhận đã được tạo thành công',
     updateReceiptSuccessful: 'Phiếu tiếp nhận đã được cập nhật thành công',
     deleteReceiptSuccessful: 'Phiếu tiếp nhận đã được xóa thành công', 



    //  PRODUCT DETAIL
    missingProductDetailFields:"Thiếu các trường dữ liệu bắt buộc",
    updateProductDetailSuccessful:"Cập nhật thành công",


    createInvoiceSuccessful:"tạo hoá đơn thành công",
    updateInvoiceSuccessful:"Cập nhật hoá đơn thành công",
    missingInvoiceFields:"Thiếu các trường dữ liệu bắt buộc",
    priceQuoteStillHaveInvoice:"Phiếu báo giá này đã tạo hoá đơn"

};



export default messages;

