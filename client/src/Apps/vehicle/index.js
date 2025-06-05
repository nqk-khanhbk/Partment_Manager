import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { listVehicle, createVehicle, deleteVehicle } from "../../service/vehicle.service";
import { useState, useEffect } from "react";
import ClassTable from "../../components/Table";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from "react-toastify";
const Vehicle = () => {
  const [dataVehicle, setDataVehicle] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    id: "",                // Thêm trường biển số xe
    category: "Motorbike",
    apartmentId: ""
  });

  // Lấy danh sách xe
  useEffect(() => {
    const fetchData = async () => {
      const response = await listVehicle();
      if (response) {
        setDataVehicle(Object.values(response.data.result));
      }
    };
    fetchData();
  }, []);


  const columns = [
    { field: "id", headerName: "Biển số xe", disableSearch: "search" },
    { field: "apartmentId", headerName: "Số phòng", disableSearch: "search" },
    {
      field: "category",
      headerName: "Loại xe",
      renderCell: (row) => {
        const category = row.category;
        let color = '#000';
        switch (category) {
          case 'Car':
            color = '#4caf50';
            break;
          case 'Motorbike':
            color = '#F44336';
            break;
          default:
            color = "#757575"
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
            {category}
          </Box>
        );
      }
    },
    { field: "registerDate", headerName: "Ngày đăng ký" },
    {
      field: "thaoTac",
      headerName: "Hành động",
      flex: 1,
      renderCell: (row) => (
        <Box display="flex" justifyContent="flex-start" gap="15px" sx={{ cursor: 'pointer' }} alignItems="center">
          <VisibilityIcon sx={{ color: '#627' }} />
          <EditIcon sx={{ color: '#0D81ED' }} />
          <DeleteIcon sx={{ color: "#C02135" }} onClick={() => handleOpenDeleteDialog(row)} />
        </Box>
      )
    }
  ];

  const handleCreate = async () => {
    const { id, category, apartmentId } = newVehicle;

    if (!id.trim() || !category || !apartmentId.trim()) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    console.log(newVehicle)
    try {
      const res = await createVehicle(newVehicle);
      if (res) {
        toast.success("Tạo xe thành công!");
        setOpenDialog(false);
        setNewVehicle({
          id: "",
          category: "Motorbike",
          apartmentId: ""
        });
        const refresh = await listVehicle(); // reload lại dữ liệu sau khi tạo
        setDataVehicle(refresh.data.result);
      }
    } catch (error) {
      console.error("Lỗi khi tạo xe:", error);
      toast.error("Tạo xe thất bại!");
    }
  };
  // hàm xóa 1 xe
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Mở dialog xác nhận xóa
  const handleOpenDeleteDialog = (vehicle) => {
    setVehicleToDelete(vehicle);
    setOpenDeleteDialog(true);
  };
  // Xác nhận xóa xe
  const handleDelete = async () => {
    try {
      const { apartmentId, id, category } = vehicleToDelete;
      const payload = { id, category, apartmentId }; // object truyền vào
      console.log(payload)
      const response = await deleteVehicle(apartmentId, payload);

      if (response?.status === 200 || response?.message) {
        toast.success("Xóa xe thành công!");
        setOpenDeleteDialog(false);
        setVehicleToDelete(null);

        // Cập nhật lại danh sách
        const updatedList = await listVehicle();
        setDataVehicle(Object.values(updatedList.data.result));
      } else {
        toast.error("Xóa xe thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi khi xóa xe!");
      console.error(err);
    }
  };
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
          Quản lý xe cộ
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
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon sx={{ fontSize: 18, mr: 1 }} />
            Thêm xe mới
          </Button>
        </Box>
      </Box>

      {/* Bảng danh sách xe */}
      <Box padding="12px" gap="12px" borderRadius="8px" backgroundColor="#fff" marginTop="20px">
        <ClassTable columns={columns} rows={dataVehicle} allowSearching />
      </Box>

      {/* Thêm xe mới */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: 'relative',
          }
        }}
      >
        <DialogTitle>
          Thêm xe mới
          <IconButton
            onClick={() => setOpenDialog(false)}
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

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400, mt: 1 }}>
          <TextField
            label="Biển số xe"
            fullWidth
            value={newVehicle.id}
            onChange={(e) => setNewVehicle({ ...newVehicle, id: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <FormLabel sx={{ fontSize: "16px", fontWeight: 600 }}>Kiểu Xe</FormLabel>
            <RadioGroup
              row
              value={newVehicle.category}
              onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value })}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <FormControlLabel value="Motorbike" control={<Radio />} label="Xe máy" />
              <FormControlLabel value="Car" control={<Radio />} label="Xe ô tô" />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Số phòng"
            fullWidth
            value={newVehicle.apartmentId}
            onChange={(e) => setNewVehicle({ ...newVehicle, apartmentId: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">Xác nhận</Button>
        </DialogActions>
      </Dialog>

      {/* xác nhận xóa xe */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3, width: 400, position: 'relative' }
        }}
      >
        <DialogTitle>
          Xác nhận xóa xe
          <IconButton
            onClick={() => setOpenDeleteDialog(false)}
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

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography>Bạn có chắc chắn muốn xóa xe này không?</Typography>
          <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 2 }}>
            <Typography><strong>Biển số xe:</strong> {vehicleToDelete?.id}</Typography>
            <Typography><strong>Số phòng:</strong> {vehicleToDelete?.apartmentId}</Typography>
            <Typography><strong>Loại xe:</strong> {vehicleToDelete?.category === 'Motorbike' ? 'Xe máy' : 'Ô tô'}</Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Xóa</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default Vehicle;
