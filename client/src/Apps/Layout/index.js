import Header from "../../components/header/header";
import Main from "../../components/Main";
import SideBar from "../../components/sidebar";
import './layout.css';
const Layout = ()=>{
    return (
        <>
        <div className="hust">
            <Header />
            <div className="main">
                <SideBar/>
                <div className="content">
                    <Main />
                </div>
            </div>
        </div>
        </>
    )
}
export default Layout;