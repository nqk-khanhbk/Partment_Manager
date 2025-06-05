import {  get } from "../utils/request"

//lấy ra tổng số xe cộ
export const totalResident= async () =>{
    const result = await get(`residents?size=999`);
    return result;
}
// lấy ra danh sách cư dân
export const listResident= async () =>{
    const result = await get(`residents?page=1&size=100`);
    return result;
}
// tạo mới danh sách cư dân
export const createResident= async (option) =>{
    const result = await get(`residents`,option);
    return result;
}
// xem chi tiết cư dân
export const deatilResident = async (id)=>{
    const result = await get(`residents`,id);
    return result;
}