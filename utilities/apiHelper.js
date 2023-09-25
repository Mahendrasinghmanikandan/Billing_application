import axios from "axios";

// Admin

export const authenticateAdmin = (formdata) =>
  axios.get(`api/auth/${formdata}`);

// customer

export const createCustomer = (formdata) =>
  axios.post(`api/customer`, formdata);

export const getAllCustomer = () => axios.get(`api/customer`);

export const deleteCustomer = (id) => axios.delete(`api/customer/${id}`);

export const updateCustomer = (formdata) => axios.put(`api/customer`, formdata);

// products

export const createProduct = (formdata) => axios.post(`api/product`, formdata);

export const getAllProduct = () => axios.get(`api/product`);

export const deleteProduct = (id) => axios.delete(`api/product/${id}`);

export const updateProduct = (formdata) => axios.put(`api/product`, formdata);

// vehicle numbers

export const createVehicleNumber = (formData) =>
  axios.post(`api/vehicle`, formData);

export const getAllVehicleNumbers = () => axios.get(`api/vehicle`);

export const deleteVehicleNumber = (id) => axios.delete(`api/vehicle/${id}`);

export const updateVehicle = (formdata) => axios.put(`api/vehicle`, formdata);

// destinations

export const createDestination = (formdata) =>
  axios.post(`api/destination`, formdata);

export const getAllDestinations = () => axios.get(`api/destination`);

export const deleteDestination = (id) => axios.delete(`api/destination/${id}`);

export const updateDestination = (formdata) =>
  axios.put(`api/destination`, formdata);

// dashboard

export const getAllCounts = () => axios.get(`api/dashboard`);

// bills

export const getAllDatas = () => axios.get(`api/bill`);

export const createBill = (formdata) => axios.post(`api/bill/bills`, formdata);

export const getAllBills = () => axios.get(`api/bill/bills`);

export const deleteBills = (id) => axios.delete(`api/bill/${id}`);

export const getOneBill = (id) => axios.get(`api/bill/${id}`);

export const updateBill = (formdata) => axios.put(`api/bill/bills`, formdata);
