import {  get,postt } from "../utils/request"

//lấy ra tổng số căn hộ
export const totalApartMent = async () =>{
    const result = await get(`apartments?size=999`);
    return result;
}
// tạo căn hộ mới
export const createApartMent = async(option)=>{
    const result = await postt(`apartments`,option);
    return result;
}
// lấy danh sach  căn hộ mới
export const listApartMent = async()=>{
    const result = await get(`apartments?page=1&size=100`);
    return result;
}