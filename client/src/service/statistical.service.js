import { get } from "../utils/request";
//lấy ra hóa đơn
export const listBillByAdressNuber = async (addressNumber) =>{
    const result = await get(`invoiceapartment/${addressNumber}`);
    return result;
}