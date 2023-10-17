/** @format */

import axios from 'axios';

const config = {
  baseURL: 'https://bf4a-27-78-35-127.ngrok-free.app/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(
  async (req: any) => {
    const token = JSON.parse(localStorage.getItem('adminInfo'));
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (err: any) => Promise.reject(err)
);

// axiosClient.interceptors.response.use(
//   (res: any) => Promise.resolve(res.data),
//   async (err: any) => {
//     const originalRequest = err.config;
//     console.log(
//       "axios-err.response.status",
//       err.response.status,
//       err.config.__isRetryRequest
//     );

//     if (
//       err &&
//       err.response &&
//       err.response.status === 401 &&
//       !err.config.__isRetryRequest
//     ) {
//       // const { saveKeyStore, resetKeyStore } = useKey();

//       return axios
//         .get(`${API_HOST}${API_ENDPOINT.GET_SESSION}`, {
//           headers: config.headers,
//         })
//         .then(async (response: any) => {
//           const { accessToken } = response?.data?.data?.result?.[0] || "";
//           if (response?.data?.status !== 200) {
//             // logoutRequest();
//             return null;
//           }
//           originalRequest.headers = {
//             ...originalRequest.headers,
//             authorization: `Bearer ${accessToken}`,
//           };
//           originalRequest.__isRetryRequest = true;
//           await saveKeyStore(KEY_CONTEXT.ACCESS_TOKEN, accessToken);

//           return axiosClient(originalRequest);
//         })
//         .catch(async (e) => {
//           console.log("axios-catch", JSON.stringify(e));
//           await resetKeyStore();
//           // logoutRequest();
//         });
//     }
//     return Promise.reject(((err || {}).response || {}).data);
//   }
// );

export default axiosClient;
