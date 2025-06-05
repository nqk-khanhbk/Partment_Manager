import {
    Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
    TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel

} from "@mui/material"
import ClassTable from "../../components/Table";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { listResident, createResident, deatilResident, editResident, deleteResident } from "../../service/resident.service";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from "react-toastify";
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
    console.log(resident)
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
            renderCell: (row) => (
                <Box display="flex" justifyContent="flex-start" gap="15px" sx={{ cursor: 'pointer' }} alignItems="center">
                    <VisibilityIcon sx={{ color: '#627' }} onClick={() => handleOpenDialog(row.id)} />
                    <EditIcon sx={{ color: '#0D81ED' }} onClick={() => handleOpenEditDialog(row)} />
                    <DeleteIcon sx={{ color: "#C02135" }} onClick={() => handleOpenDeleteDialog(row.id)} />
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
    // chinhr sửa cư dân --------------------------------
    // State chỉnh sửa
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        name: "",
        dob: "",
        cic: "",
        gender: "",
        addressNumber: "",
        status: ""
    });

    // Mở dialog sửa
    const handleOpenEditDialog = (row) => {
        setEditData(row);
        setOpenEditDialog(true);
    };

    // Đóng dialog
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    // Khi người dùng thay đổi giá trị form
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Lưu cư dân sau khi chỉnh sửa
    const handleSaveEdit = async () => {
        try {
            await editResident(editData); // Gửi dữ liệu lên server
            setOpenEditDialog(false);
            toast.success("Chỉnh sửa cư dân thành công!")
            fetchApi(); // Refresh dữ liệu
        } catch (err) {
            console.error("Lỗi khi cập nhật cư dân:", err);
        }
    };
    // xóa cư dân
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const handleOpenDeleteDialog = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };
    const handleConfirmDelete = async () => {
        try {
            await deleteResident(deleteId);
            setOpenDeleteDialog(false);
            toast.success("Xóa cư dân thành công!")
            fetchApi(); // refresh dữ liệu
        } catch (error) {
            console.error("Xóa cư dân thất bại", error);
        }
    };
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setDeleteId(null);
    };
    // tạo mới cư dân
    // hàm sinh id tăng tự động
    const getNextId = () => {
        if (resident.length === 0) return 1;
        const maxId = Math.max(...resident.map((r) => r.id));
        return maxId + 1;
    };

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newResident, setNewResident] = useState({
        id: "",
        name: "",
        dob: "",
        cic: "",
        gender: "Nam",
        addressNumber: "",
        status: "Resident"
    });
    const handleOpenCreateDialog = () => {
        setNewResident({
            id: getNextId(), // sinh id tự động
            name: "",
            dob: "",
            cic: "",
            gender: "Female",
            addressNumber: "",
            status: "Resident"
        });
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        // setNewResident({

        //     name: "",
        //     dob: "",
        //     cic: "",
        //     gender: "Nam",
        //     addressNumber: "",
        //     status: "Resident"
        // });
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewResident((prev) => ({ ...prev, [name]: value }));
    };
    const handleCreateResident = async () => {
        try {
            await createResident(newResident);
            toast.success("Thêm cư dân thành công!");
            setOpenCreateDialog(false);
            fetchApi();  // Cập nhật lại danh sách
        } catch (error) {
            toast.error("Thêm cư dân thất bại!");
            console.error("Tạo mới cư dân thất bại", error);
        }
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
                        onClick={handleOpenCreateDialog}
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
                        <Box
                            component="form"
                            display="flex"
                            flexDirection="column"
                            gap={3}
                        >
                            <TextField
                                label="Họ tên"
                                value={selectedResident.name || ''}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />
                            <TextField
                                label="Ngày sinh"
                                value={selectedResident.dob || ''}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />
                            <TextField
                                label="CCCD"
                                value={selectedResident.cic || ''}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />
                            <FormControl component="fieldset">
                                <Typography component="legend" fontWeight={600} mb={1}>Giới tính</Typography>
                                <RadioGroup row value={selectedResident.gender || ''}>
                                    <FormControlLabel value="Male" control={<Radio />} label="Nam" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                label="Số phòng"
                                value={selectedResident.apartmentId || ''}
                                InputProps={{ readOnly: true }}
                                fullWidth
                            />
                            <FormControl component="fieldset">
                                <Typography component="legend" fontWeight={600} mb={1}>Trạng thái cư trú</Typography>
                                <RadioGroup row value={selectedResident.status || ''}>
                                    <FormControlLabel value="Resident" control={<Radio />} label="Thường trú" />
                                    <FormControlLabel value="Temporary" control={<Radio />} label="Tạm trú" />
                                    <FormControlLabel value="Moved" control={<Radio />} label="Chuyển đi" />
                                </RadioGroup>
                            </FormControl>
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
            {/* chỉnh sửa cư dân */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    Chỉnh sửa thông tin cư dân
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseEditDialog}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Họ tên"
                            name="name"
                            value={editData.name}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            label="Ngày sinh"
                            name="dob"
                            type="date"
                            value={editData.dob}
                            onChange={handleEditChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <TextField
                            label="CMND/CCCD"
                            name="cic"
                            value={editData.cic}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <FormControl>
                            <FormLabel>Giới tính</FormLabel>
                            <RadioGroup row name="gender" value={editData.gender} onChange={handleEditChange}>
                                <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
                                <FormControlLabel value="Male" control={<Radio />} label="Nam" />

                            </RadioGroup>
                        </FormControl>
                        <TextField
                            label="Số phòng"
                            name="addressNumber"
                            value={editData.addressNumber}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <FormControl>
                            <FormLabel>Trạng thái cư trú</FormLabel>
                            <RadioGroup row name="status" value={editData.status} onChange={handleEditChange}>
                                <FormControlLabel value="Resident" control={<Radio />} label="Thường trú" />
                                <FormControlLabel value="Temporary" control={<Radio />} label="Tạm trú" />
                                <FormControlLabel value="Moved" control={<Radio />} label="Chuyển đi" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">
                        Lưu
                    </Button>
                    <Button onClick={handleCloseEditDialog} color="secondary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
            {/* xóa bỏ cư dân-->chuyển sang Moved */}
            <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
                <DialogTitle>Xác nhận xoá cư dân</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xoá cư dân này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="inherit">Huỷ</Button>
                    <Button onClick={handleConfirmDelete} color="error">Xoá</Button>
                </DialogActions>
            </Dialog>
            {/* tạo mới cư dân */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} fullWidth maxWidth="sm">
                <DialogTitle>Thêm cư dân mới</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField label="Họ tên" name="name" value={newResident.name} onChange={handleInputChange} fullWidth />
                        <TextField label="Ngày sinh" type="date" name="dob" value={newResident.dob} onChange={handleInputChange} InputLabelProps={{ shrink: true, }} fullWdth />
                        <TextField label="CCCD" name="cic" value={newResident.cic} onChange={handleInputChange} fullWidth />
                        <FormControl>
                            <FormLabel>Giới tính</FormLabel>
                            <RadioGroup row name="gender" value={newResident.gender} onChange={handleInputChange}>
                                <FormControlLabel value="Male" control={<Radio />} label="Nam" />
                                <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
                            </RadioGroup>
                        </FormControl>
                        <TextField label="Số phòng" name="addressNumber" value={newResident.addressNumber} onChange={handleInputChange} fullWidth />
                        <FormControl>
                            <FormLabel>Trạng thái cư trú</FormLabel>
                            <RadioGroup row name="status" value={newResident.status} onChange={handleInputChange}>
                                <FormControlLabel value="Resident" control={<Radio />} label="Thường trú" />
                                <FormControlLabel value="Temporary" control={<Radio />} label="Tạm trú" />
                                <FormControlLabel value="Moved" control={<Radio />} label="Đã chuyển đi" />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateDialog} color="inherit">Huỷ</Button>
                    <Button onClick={handleCreateResident} variant="contained" color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
export default Resident;