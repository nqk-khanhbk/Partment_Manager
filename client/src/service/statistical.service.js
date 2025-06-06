import { get, post } from "../utils/request";
//lấy ra hóa đơn
export const listBillByAdressNuber = async (addressNumber) => {
  const result = await get(`invoiceapartment/${addressNumber}`);
  return result;
};

//Lấy ra hóa đơn tiện ích (bao gồm điện, nước, internet, apartmentId)
export const listUtilityBillByAdressNuber = async (addressNumber) => {
  const result = await get(`utilitybills/${addressNumber}`);
  return result;
};

//Gọi api chuyển status thành thanh toán
//Hóa đơn thường (id là id của invoice_apartment)
export const updateInvoiceStatus = async (id) => {
  const result = await post(`invoiceapartment/update/${id}`);
  return result;
};
//Hóa đơn tiện ích (id là id của utility_bill)
export const updateUtilityBillStatus = async (id) => {
  const result = await post(`utilitybills/update/${id}`);
  return result;
};
