import {  get } from "../utils/request"

//lấy ra tổng số xtiên đóng góp
export const totalAmount= async () =>{
    const result = await get(`invoices/total`);
    return result;
}