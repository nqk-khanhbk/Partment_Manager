import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../../helper/cookies.helper";
function PrivateRoutes(){
    const token = getCookie("accessToken");
    return (
        <>
        {(token)?(<Outlet />):(<Navigate to="/login" />)}
        </>
    )
}
export default PrivateRoutes;