import ClassRoom from "../Apps/Class";
import Layout from "../Apps/Layout";
import ClassHand from "../Apps/Class/class-hand"
import ClassCreateEhust from "../Apps/Class/classCreateEhust";
import Login from "../Apps/login";
import Register from "../Apps/register";
import Dashboard from "../Apps/dashboard";
import Vehicle from "../Apps/vehicle";
import Resident from "../Apps/resident";
import Invoices from "../Apps/invoices";
import Statistics from "../Apps/statistics";
import FeeAndFund from "../Apps/feeAndFund";
import PrivateRoutes from "../components/privateRoutes";
import Apartment from "../Apps/apartment";
export const Routes = [
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                element: <PrivateRoutes />,
                children: [
                    {
                        path: '/tong-quan',
                        element: <Dashboard />
                    },
                    {
                        path: '/can-ho',
                        element: <Apartment />
                    },
                    {
                        path: '/xe-co',
                        element: <Vehicle />
                    },
                    {
                        path: '/cu-dan',
                        element: <Resident />
                    },
                    {
                        path: '/hoa-don',
                        element: <Invoices />
                    },
                    {
                        path: '/thong-ke',
                        element: <Statistics />
                    },
                    {
                        path: '/phi-va-quy',
                        element: <FeeAndFund />
                    },
                    {
                        path: '/lop-hoc',
                        element: <ClassRoom />,
                    },
                    {
                        path: '/lop-hoc/them-lop-thu-cong',
                        element: <ClassHand />
                    },
                    {
                        path: '/lop-hoc/them-lop-tu-ehust',
                        element: <ClassCreateEhust />
                    }
                ]
            }
        ]
    }
]