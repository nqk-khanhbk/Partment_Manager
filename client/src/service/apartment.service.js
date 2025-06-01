import {  get } from "../utils/request"

//lấy ra tổng số căn hộ
export const totalApartMent = async () =>{
    const result = await get(`apartments?size=999`);
    return result;
}