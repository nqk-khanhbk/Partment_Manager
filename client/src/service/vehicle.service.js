import {  get,post, postt} from "../utils/request"

//lấy ra tổng số xe cộ
export const totalVehicle= async () =>{
    const result = await get(`vehicles?size=999`);
    return result;
}
// lấy ra list xe cộ
export const listVehicle= async () =>{
    const result = await get(`vehicles?page=1&size=100`);
    return result;
}
// tạo ra 1 thông tin xe mới
export const createVehicle= async (option) =>{
    const result = await postt(`vehicles`,option);
    return result;
}