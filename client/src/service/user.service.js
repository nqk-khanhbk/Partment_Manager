import { get, post } from "../utils/request"

//đăng nhập
export const login = async (option) =>{
    const result = await post(`auth/login`,option);
    return result;
}
export const register = async (option)=>{
    const result = await post(`register`,option);
    return result;
}
export const ckeckRegister = async (key,value)=>{
    const result = await get(`register?${key}=${value}`);
    return result;
}
// tạo hàm logout
export const logout = async (option)=>{
    const result = await post(`auth/logout`,option);
    return result;
}