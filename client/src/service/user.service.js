import {  post } from "../utils/request"

//đăng nhập
export const login = async (option) =>{
    const result = await post(`auth/login`,option);
    return result;
}
export const register = async (option)=>{
    const result = await post(`users/register`,option);
    return result;
}
// tạo hàm logout
export const logout = async (option)=>{
    const result = await post(`auth/logout`,option);
    return result;
}