import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import { listApartMent,createApartMent } from '../../service/apartment.service';
import ClassTable from '../../components/Table';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
const Apartment = () => {
    // lấy dữ  liệu hàng
    const [apartment, setApartment] = useState([]);
    const fetchApi = async () => {
        const response = await listApartMent();
        setApartment(response.data.result);
    };

    useEffect(() => {
        fetchApi();
    }, []);
    // console.log(apartment)
    //lấy dữ liệu cột
    const columns = [
        { field: "addressNumber", headerName: "Số nhà", disableSearch: "search" },
        {
            field: "owner",
            headerName: "Chủ hộ",
            renderCell: (row) => row.owner?.name || "Chưa có"
        },
        { field: "ownerPhone", headerName: "Liên hệ" },
        { field: "numberOfMembers", headerName: "Số thành viên" },
        {
            field: "status",
            headerName: "Tình trạng",
            renderCell: (row) => {
                const status = row.status;
                let color = "#000";
                switch (status) {
                    case "Residential":
                        color = "#1976D2";
                        break;
                    case "Vacant":
                        color = "#C02135";
                        break;
                    case "Business":
                        color = "#4CAF50";
                        break;
                    default:
                        color = "#757575";
                }
                return (
                    <Box
                        sx={{
                            padding: "2px 8px",
                            backgroundColor: "${color}22",
                            color: color,
                            borderRadius: "8px",
                            display: "inline-block",
                            fontWeight: 500,
                            fontSize: "14px",
                            textAlign: "center",
                        }}
                    >
                        {status}
                    </Box>
                );
            },
        },
        {
            field: "thaoTac",
            headerName: "Hành động",
            flex: 1,
            renderCell: () => (
                <Box display="flex" justifyContent="flex-start" gap="15px" sx={{ cursor: "pointer" }} alignItems="center">
                    <VisibilityIcon sx={{ color: '#627' }}  />
                    <EditIcon sx={{ color: "#0D81ED" }} />
                    <DeleteIcon sx={{ color: "#C02135" }} />
                </Box>
            ),
        },
    ];

    return (
        <>
            {/* Tiêu đề */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFFF' }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C01235' }}>
                    Quản lý căn hộ
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderRadius: '10px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#0B57D0',
                            textTransform: 'none',
                            borderRadius: '999px',
                            paddingX: 2,
                            fontWeight: 500
                        }}

                    >
                        <AddIcon sx={{ fontSize: 18, mr: 1 }} />
                        Thêm căn hộ mới
                    </Button>
                </Box>
            </Box>
            {/* Bảng danh sách xe */}
            <Box padding="12px" gap="12px" borderRadius="8px" backgroundColor="#fff" marginTop="20px">
                <ClassTable columns={columns} rows={apartment} allowSearching />
            </Box>

        </>
    )
}
export default Apartment;