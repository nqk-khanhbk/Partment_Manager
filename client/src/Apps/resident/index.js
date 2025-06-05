import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material"
import ClassTable from "../../components/Table";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { listResident, createResident, deatilResident } from "../../service/resident.service";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
const Resident = () => {
    // lấy dữ liệu hàng
    const [resident, setResident] = useState([]);
    const fetchApi = async () => {
        const response = await listResident();
        setResident(response.data.result);
    };

    useEffect(() => {
        fetchApi();
    }, []);
    // console.log(resident)
    // dữ liệu cột
    const columns = [
        { field: "id", headerName: "STT" },
        { field: "name", headerName: "Họ tên", disableSearch: "search" },
        { field: "cic", headerName: "CMND/CCCD", disableSearch: "search" },
        { field: "dob", headerName: "Ngày sinh" },
        { field: "gender", headerName: "Giới tính" },
        { field: "apartmentId", headerName: "Số phòng", disableSearch: "search" },
        {
            field: "status",
            headerName: "Trạng thái cư trú",
            renderCell: (row) => {
                const status = row.status;
                let color = '#000';

                // ✅ Gán màu dựa theo giá trị
                switch (status) {
                    case 'Temporary':
                        color = '#FFA500'; // cam
                        break;
                    case 'Resident':
                        color = '#4CAF50'; // xanh lá
                        break;
                    case 'Moved':
                        color = '#F44336'; // đỏ
                        break;
                    default:
                        color = '#757575'; // xám
                }
                return (
                    <Box
                        sx={{
                            padding: '2px 8px',
                            backgroundColor: `${color}22`, // nền nhạt
                            color: color,
                            borderRadius: '8px',
                            display: 'inline-block',
                            fontWeight: 500,
                            fontSize: '14px',
                            textAlign: 'center'
                        }}
                    >
                        {status}
                    </Box>
                );
            }
        },
        { field: "statusDate", headerName: "Ngày cập nhật" },
        {
            field: "thaoTac",
            headerName: "Hành động",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" justifyContent="flex-start" gap="15px" sx={{ cursor: 'pointer' }} alignItems="center">
                    <VisibilityIcon sx={{ color: '#627' }}  onClick={() => handleOpenDialog(params.row.id)} />
                    <EditIcon sx={{ color: '#0D81ED' }} />
                    <DeleteIcon sx={{ color: "#C02135" }} />
                </Box>
            )
        }
    ];
    //xem chi tiết 1 cư dân
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleOpenDialog = async (id) => {
        const res = await deatilResident(id); // lấy chi tiết từ API
        setSelectedResident(res.data); // hoặc res.result tùy API
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedResident(null);
    };
    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFFF' }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C01235' }}>
                    Quản lý cư dân
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
                        Thêm cư dân mới
                    </Button>
                </Box>
            </Box>
            <Box padding="12px" gap="12px" borderRadius="8px" backgroundColor="#fff" marginTop="20px">
                <ClassTable columns={columns} rows={resident} allowSearching />
            </Box>
            {/* dialog xem chi tiết cư dân */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    Thông tin chi tiết cư dân
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedResident ? (
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Typography><strong>Họ tên:</strong> {selectedResident.name}</Typography>
                            <Typography><strong>Ngày sinh:</strong> {selectedResident.dob}</Typography>
                            <Typography><strong>CCCD:</strong> {selectedResident.cic}</Typography>
                            <Typography><strong>Giới tính:</strong> {selectedResident.gender}</Typography>
                            <Typography><strong>Số phòng:</strong> {selectedResident.apartmentId}</Typography>
                            <Typography><strong>Kiểu:</strong> {selectedResident.status}</Typography>
                        </Box>
                    ) : (
                        <Typography>Đang tải...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
export default Resident;