import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { totalApartMent } from "../../service/apartment.service";
import { totalResident } from "../../service/resident.service";
import { totalVehicle } from "../../service/vehicle.service";
import { totalAmount } from "../../service/invoices.service";
function Dashboard() {
    // gọi api lấy tống số căn hộ,xe cộ,nhà ở,cư dân
    const [apartment, setApartment] = useState(0);
    const [vahicle, setVahicle] = useState(0);
    const [resident, setResident] = useState(0);
    // lấy tổng căn hộ
    useEffect(() => {
        const totalApartMentt = async () => {
            const respon = await totalApartMent();
            if (respon) {
                setApartment(respon.data.totalElements);
            }
        };

        totalApartMentt();
    }, []);
    // console.log(apartment)
    // lấy tổng xe cộ
    useEffect(() => {
        const totalVahiclee = async () => {
            const respon = await totalVehicle();
            if (respon) {
                setVahicle(respon.data.totalElements);
            }
        };

        totalVahiclee();
    }, []);
    // console.log(vahicle)
    // lấy tổng cư dân
    useEffect(() => {
        const totalResidentt = async () => {
            const respon = await totalResident();
            if (respon) {
                setResident(respon.data.totalElements);
            }
        };

        totalResidentt();
    }, []);
    // console.log(resident)
    // tính tổng tiền hóa đơn
    const [totalAmountLast30Days, setTotalAmountLast30Days] = useState(0);
    // tính tổng tiền hóa đơn 30 ngày gần nhất
    useEffect(() => {
        const fetchTotalAmountLast30Days = async () => {
            try {
                const result = await totalAmount();
                const invoices = result.data;

                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const thirtyDaysAgo = new Date(todayStart);
                thirtyDaysAgo.setDate(todayStart.getDate() - 30);

                // console.log("Today Start:", todayStart.toISOString());
                // console.log("30 days ago:", thirtyDaysAgo.toISOString());

                const total = invoices.reduce((sum, invoice) => {
                    const createDate = new Date(invoice.createDate + "T00:00:00");
                    console.log(`Check invoice ${invoice.id}: createDate = ${createDate.toISOString()}`);

                    if (createDate >= thirtyDaysAgo && createDate <= todayStart) {
                        sum += Number(invoice.totalAmount);
                    }

                    return sum;
                }, 0);

                console.log("Total amount calculated:", total);
                setTotalAmountLast30Days(total);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        fetchTotalAmountLast30Days();
    }, []);


    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFFF' }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C01235' }}>Trang tổng quan</Typography>
            </Box>
            {/* 4 cột bé */}
            <Box sx={{ pt: "20px" }}>
                <Box
                    display="grid"
                    gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                    gap={2}
                >
                    {/* Total Apartments */}
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            p: 3,
                            boxShadow: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h5" fontWeight="600">
                            Tổng số căn hộ
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {apartment}
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#ccf2ff',
                                    borderRadius: '50%',
                                    width: 48,
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <ApartmentIcon sx={{ color: '#0ea5e9', fontSize: 28 }} />
                            </Box>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }} color="text.secondary">
                            Căn hộ
                        </Typography>
                    </Box>

                    {/* Total Residents */}
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            p: 3,
                            boxShadow: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h5" fontWeight="600">
                            Tổng số cư dân
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {resident}
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#d1fae5',
                                    borderRadius: '50%',
                                    width: 48,
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <PeopleIcon sx={{ color: '#10b981', fontSize: 28 }} />
                            </Box>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }} color="text.secondary">
                            Cư dân
                        </Typography>
                    </Box>

                    {/* Total Vehicles */}
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            p: 3,
                            boxShadow: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h5" fontWeight="600">
                            Tổng số xe cộ
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {vahicle}
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#fcdada',
                                    borderRadius: '50%',
                                    width: 48,
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <DirectionsCarIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                            </Box>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }} color="text.secondary">
                            Xe cộ
                        </Typography>
                    </Box>

                    {/* Last 30 days */}
                    <Box
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            p: 3,
                            boxShadow: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h5" fontWeight="600">
                            30 ngày gần nhất
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <Typography variant="h5" fontWeight="bold">
                                {totalAmountLast30Days.toLocaleString('vi-VN')} VND
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#ede9fe',
                                    borderRadius: '50%',
                                    width: 48,
                                    height: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <LocalAtmIcon sx={{ color: '#8b5cf6', fontSize: 28 }} />
                            </Box>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }} color="text.secondary">
                            Tiền hóa đơn
                        </Typography>
                    </Box>
                </Box>
            </Box>
            {/* phần biểu đồ hiển thị */}
            <Box sx={{ padding: '12px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFFF', mt: "10px" }}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                    {/* ROW-2 */}
                    <Box
                        sx={{
                            gridColumn: {
                                xs: "span 12",
                                sm: "span 12",
                                md: "span 8",
                                lg: "span 8"
                            },
                            height: "600px"
                        }}

                    >
                        <Box
                            mt="35px"
                            p="0 50px"
                            display="flex "
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="600"

                                >
                                    Doanh thu theo tuần
                                </Typography>
                                <Typography
                                    variant="h3"
                                    fontWeight="bold"

                                >
                                    $59,342.32
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton>
                                    <DownloadOutlinedIcon
                                        sx={{ fontSize: "40px" }}
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box width="100%">
                            <Typography>Để sơ đồ chart tiền đóng góp</Typography>
                            {/* <BarChart mb="0px" /> */}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            gridColumn: {
                                xs: "span 12",
                                sm: "span 12",
                                md: "span 4",
                                lg: "span 4"
                            },
                            display: "grid",
                            gridTemplateRows: "1fr 1fr",
                            flexDirection: "column",
                            gap: "20px",
                            height: { xs: "auto", md: "400px" }
                        }}
                    >
                        {/* Top item in right column */}
                        <Box
                            display="flex"

                            alignItems="center"
                            justifyContent="center"
                            p="15px"
                        >
                            <Box height="300px">
                                <Typography>Để sơ đồ số căn hộ dky</Typography>
                                {/* <PieChart /> */}
                            </Box>
                        </Box>

                        {/* Bottom item in right column */}
                        <Box
                            display="flex"

                            alignItems="center"
                            justifyContent="center"
                            p="15px"
                        >
                            <Box height="305px" width="100%" mt="5px">
                                {/* sodo */}
                                <Typography>Để sơ đồ số căn số cư dân</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

        </>
    )
}
export default Dashboard;