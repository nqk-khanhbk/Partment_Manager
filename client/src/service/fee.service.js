import { get, postt, put, del } from "../utils/request";

// lấy ra list fee
export const listFee = async () => {
  const result = await get(`fees?page=1&size=100`);
  return result;
};

//Tạo mới fee
export const createFee = async (option) => {
  const result = await postt(`fees`, option);
  return result;
};
//Cập nhật fee
export const updateFee = async (option) => {
  const result = await put(`fees`, option);
  return result;
};

// Xoá fee
export const deleteFee = async (id) => {
  const result = await del(`fees/${id}`);
  return result;
};
