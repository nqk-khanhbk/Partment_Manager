import { get, postt, put, del } from "../utils/request";

// Lấy ra danh sách chỗ trống
export const listParking = async () => {
  const result = await get(`ai/alert`);
  return result;
};
// Lấy ra cảnh báo lửa
export const listFireAlert = async () => {
  const result = await get(`ai/notification`);
  return result;
};
