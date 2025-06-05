import { get, put, post, del } from "../utils/request";

//lấy ra tổng số xtiên đóng góp
export const totalAmount = async () => {
  const result = await get(`invoices/total`);
  return result;
};

//Lay ra danh sách các hóa đơn
export const getInvoices = async (params) => {
  const result = await get(`invoices?page=1&size=100`, params);
  return result;
};
// Lấy chi tiết hóa đơn
export const getInvoiceDetail = async (id) => {
  const result = await get(`invoices/${id}`);
  return result;
};

// Tạo hóa đơn mới
export const createInvoice = async (option) => {
  const result = await post(`invoices`, option);
  return result;
};

// Cập nhật hóa đơn
export const updateInvoice = async (option) => {
  const result = await put(`invoices`, option);
  return result;
};

// Xóa hóa đơn
export const deleteInvoice = async (id) => {
  const result = await del(`invoices/${id}`);
  return result;
};
// Lấy danh sách phí
export const listFee = async () => {
  const result = await get(`fees?page=1&size=100`);
  return result;
};

// Lấy danh sách căn hộ
export const getApartments = async () => {
  const result = await get(`apartments?page=1&size=1000`);
  return result;
};
