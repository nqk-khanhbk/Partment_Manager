import { get, post, put } from "../utils/request";

//lấy ra tổng số căn hộ
export const totalApartMent = async () => {
  const result = await get(`apartments?size=999`);
  return result;
};
// tạo căn hộ mới
export const createApartMent = async (option) => {
  const result = await post(`apartments`, option);
  return result;
};
// lấy danh sach  căn hộ mới
export const listApartMent = async () => {
  const result = await get(`apartments?page=1&size=100`);
  return result;
};
// xem chi tiết căn hộ
export const detailApartMent = async (id) => {
  const result = await get(`apartments/${id}`);
  return result;
};
// cập nhật căn hộ
export const updateApartMent = async (addressNumber, option) => {
  const result = await put(`apartments/${addressNumber}`, option);
  return result;
};
// Lấy danh sách cư dân
export const listResident = async () => {
  const result = await get(`residents?page=1&size=1000`);
  return result;
};
