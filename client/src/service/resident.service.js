import {  get } from "../utils/request"

//lấy ra tổng số xe cộ
export const totalResident= async () =>{
    const result = await get(`residents?size=999`);
    return result;
}