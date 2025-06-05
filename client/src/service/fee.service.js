import {  get,post,put,del} from "../utils/request"


// lấy ra list fee
export const listFee= async () =>{
    const result = await get(`fees?page=1&size=100`);
    return result;
}

//Tạo mới fee
export const createFee= async (option) =>{
    const result = await post(`fees`,option);
    return result;
}