import {  get } from "../utils/request"

//lấy ra tổng số xe cộ
export const totalVehicle= async () =>{
    const result = await get(`vehicles?size=999`);
    return result;
}