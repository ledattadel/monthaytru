import axios from 'axios';
import {
  SIGN_IN_ADMIN,
  API_GET_ALL_USER_MAIN,
  API_GET_ALL_USER,
  API_ADD_NEW_USER,
  API_UPDATE_USER,
  API_DELETE_USER,
  API_GET_USER_INFORMATION,
  API_UPDATE_CART,
  API_DELETE_CART,
  API_GET_ALL_CART,
  API_GET_ALL_CART_DES,
  API_ADD_CART_DES,
  API_GET_ALL_PRODUCT,
  API_GET_ALL_PRODUCT_BY_PRODUCT_TYPE,
  API_ADD_NEW_PRODUCT,
  API_UPDATE_PRODUCT,
  API_DELETE_PRODUCT,
  API_GET_ALL_MANUFACTURER,
  API_GET_ALL_PRODUCT_TYPE,
  API_GET_ALL_SERVICE_TYPE,
  API_GET_ALL_STATUS,
  API_UPDATE_STATUS,
  API_GET_ALL_BILL,
  API_CREATE_BILL,
  API_GET_ALL_ACCESSORY_TYPE,
  API_GET_ALL_SALE,
  API_CREATE_SALE,
  API_GET_SALE_DESCRIPTION,
  API_CREATE_SALE_DESCRIPTION,
  API_GET_CART_DESCRIPTION_BY_ID,
  API_GET_CART_BY_USER_ID,
  API_SEND_EMAIL_CANCEL_ORDER,
  GET_USER_INFO,
  API_GET_ALL_BRAND,
  API_ADD_NEW_BRAND,
  API_UPDATE_BRAND,
  API_DELETE_BRAND,
  API_GET_ALL_SUPPLIER,
  API_ADD_NEW_SUPPLIER,
  API_UPDATE_SUPPLIER,
  API_DELETE_SUPPLIER,
  API_GET_ALL_STAFF,
  API_ADD_NEW_STAFF,
  API_UPDATE_STAFF,
  API_DELETE_STAFF,
  API_GET_ALL_SERVICE,
  API_GET_LIST_TECHNICAL,
  API_CREATE_PURCHASE,
  API_GET_ALL_PURCHASE,
  API_GET_ALL_PRODUCT_DETAIL,
  API_GET_ALL_RECEIPT,
  API_GET_ALL_VEHICLE,
} from './configs';
const token = JSON.parse(localStorage.getItem('adminInfo'));

export const loginAPI = async (body) => {
  try {
    const response = await axios.post(SIGN_IN_ADMIN, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllUserMainAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_USER_MAIN, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
export const getInfoAdminAPI = async (username) => {
  try {
    const response = await axios.get(`${GET_USER_INFO}/${username}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
/// CUSTOMER
export const getAllUserAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_USER, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
export const getUserByPhoneAPI = async (phone) => {
  try {
    const response = await axios.get(`${API_GET_ALL_USER}/phone/${phone}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
export const getVehicleByNumberAPI = async (numberplate) => {
  try {
    const response = await axios.get(`${API_GET_ALL_VEHICLE}/numberplate/${numberplate}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const addNewUserAPI = async (body) => {
  try {
    const response = await axios.post(API_ADD_NEW_USER, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editUserAPI = async (id, body) => {
  try {
    const response = await axios.patch(API_UPDATE_USER + `/${id}`, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deleteUserAPI = async (id) => {
  try {
    const response = await axios.delete(`${API_DELETE_USER}/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
/// SERVICE
export const getAllServiceAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_SERVICE, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const addNewServiceAPI = async (body) => {
  try {
    const response = await axios.post(API_GET_ALL_SERVICE, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editServiceAPI = async (id, body) => {
  try {
    const response = await axios.patch(API_GET_ALL_SERVICE + `/${id}`, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deleteServiceAPI = async (id) => {
  try {
    const response = await axios.delete(`${API_GET_ALL_SERVICE}/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
/// STAFF
export const getAllStaffAPI = async () => {
  try {
    const response = await axios.get(API_GET_LIST_TECHNICAL, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
export const getAllStaffTechnicalAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_STAFF, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const addNewStaffAPI = async (body) => {
  try {
    const response = await axios.post(API_ADD_NEW_STAFF, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editStaffAPI = async (id, body) => {
  try {
    const response = await axios.patch(`${API_UPDATE_STAFF}/${id}`, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deleteStaffAPI = async (id) => {
  try {
    const response = await axios.delete(`${API_DELETE_STAFF}/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
/// BRAND
export const getAllBrandAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_BRAND, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const addNewBrandAPI = async (body) => {
  try {
    const response = await axios.post(API_ADD_NEW_BRAND, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editBrandAPI = async (body, id) => {
  try {
    const response = await axios.patch(`${API_UPDATE_BRAND}/${id}`, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deleteBrandAPI = async (id) => {
  try {
    const response = await axios.delete(`${API_DELETE_BRAND}/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
/// supplỉe
export const getAllSupplierAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_SUPPLIER, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const addNewSupplierAPI = async (body) => {
  try {
    const response = await axios.post(API_ADD_NEW_SUPPLIER, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editSupplierAPI = async (body, id) => {
  try {
    const response = await axios.patch(`${API_UPDATE_SUPPLIER}/${id}`, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deleteSupplierAPI = async (id) => {
  try {
    const response = await axios.delete(`${API_DELETE_SUPPLIER}/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

///// detail product

export const getAllProductDetailAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_PRODUCT_DETAIL, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editProductDetailAPI = async (body, productId) => {
  try {
    const response = await axios.patch(`${API_GET_ALL_PRODUCT_DETAIL}/${productId}`, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
//// create receipt
export const addNewReceiptAPI = async (body) => {
  try {
    const response = await axios.post(API_GET_ALL_RECEIPT, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
export const getAllReceiptAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_RECEIPT, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editReceiptlAPI = async (body, productId) => {
  try {
    const response = await axios.patch(`${API_GET_ALL_RECEIPT}/${productId}`, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

/// import product
export const addNewImportProductAPI = async (body) => {
  try {
    const response = await axios.post(API_CREATE_PURCHASE, body, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllCartAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_PURCHASE, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getCartByUserIdAPI = async (id) => {
  try {
    const response = await axios.get(`${API_GET_CART_BY_USER_ID}?idCardNumber=${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const patchUpdateCartAPI = async ({ idCart, formData }) => {
  try {
    const response = await axios.patch(`${API_UPDATE_CART}/${idCart}`, formData, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

// hủy cả đơn hàng
export const deleteCartByIdAPI = async (body) => {
  try {
    const response = await axios.delete(`${API_DELETE_CART}?cartId=${body.cartId}&idUser=${body.idUser}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllCartDesAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_CART_DES, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getCartDescriptionAPI = async (id) => {
  try {
    const response = await axios.get(`${API_GET_CART_DESCRIPTION_BY_ID}?cartId=${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const addCarDesAPI = async (body) => {
  try {
    const response = await axios.patch(API_ADD_CART_DES, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllServicesAPI = async () => {
  try {
    const response = await axios.get(`${API_GET_ALL_PRODUCT_BY_PRODUCT_TYPE}?productTypeId=1`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllProductAndServiceAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_PRODUCT);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllProductAPI = async () => {
  try {
    const response = await axios.get(`${API_GET_ALL_PRODUCT}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const addNewProductAPI = async (body) => {
  try {
    const response = await axios({
      method: 'post',
      url: API_ADD_NEW_PRODUCT,
      data: body,
      header: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const editProductAPI = async (body, productId) => {
  try {
    const response = await axios.patch(`${API_UPDATE_PRODUCT}/${productId}`, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const deleteProductAPI = async (id) => {
  try {
    const response = await axios.delete(`${API_DELETE_PRODUCT}/${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllManufacturerAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_MANUFACTURER);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllBrand = async () => {
  try {
    const response = await axios.get(API_GET_ALL_BRAND);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllProductTypeAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_PRODUCT_TYPE);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllServiceTypeAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_SERVICE_TYPE);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllStatusAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_STATUS);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const updateStatusAPI = async (body) => {
  try {
    const response = await axios.patch(API_UPDATE_STATUS, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllBillAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_BILL);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const createBillAPI = async (id, employeeId) => {
  try {
    const response = await axios.delete(`${API_CREATE_BILL}/${id}`, {
      data: {
        employeeId: employeeId,
      },
    });
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllAccessoryTypeAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_ACCESSORY_TYPE);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

export const getAllSaleAPI = async () => {
  try {
    const response = await axios.get(API_GET_ALL_SALE);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

//API_CREATE_SALE
export const addNewSaleAPI = async (data) => {
  try {
    const response = await axios.post(API_CREATE_SALE, data);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

//-----------------SALE_DESCRIPTION--------------
//API_CREATE_SALE_DESCRIPTION
export const addNewProductSaleAPI = async (data) => {
  try {
    const response = await axios.post(API_CREATE_SALE_DESCRIPTION, data);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

//API_GET_SALE_DESCRIPTION_BY_ID
export const getSaleDescriptionAPI = async (id) => {
  try {
    const response = await axios.get(`${API_GET_SALE_DESCRIPTION}?id=${id}`);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};

//----------------USER INFORMATION----------------
//API GET_USER_INFO
export const getUserInfoAPI = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('adminInfo'));
    const response = await axios.get(API_GET_USER_INFORMATION, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.log('error', error);
  }
};
//---------------SEND EMAIL-------------------
export const sendEmailAPI = async (body) => {
  try {
    const response = await axios.post(API_SEND_EMAIL_CANCEL_ORDER, body);
    return response;
  } catch (error) {
    return error?.response?.data || error;
  }
};
