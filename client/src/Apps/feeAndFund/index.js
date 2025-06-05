import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import ClassTable from "../../components/Table";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { toast } from "react-toastify";
import { listFee,createFee } from "../../service/fee.service";

const FeeAndFund = () => {
  const [dataFees, setDataFees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [newFee, setNewFee] = useState({
    id: "",
    description: "",
    feeTypeEnum: "DepartmentFee",
    unitPrice: "",
    createdAt: new Date().toISOString().split('T')[0]
  });

  // Giả lập lấy danh sách phí
  useEffect(() => {
    // Hàm giả lập - thay thế bằng API call thực tế
    const fetchData = async () => {
      const response = await listFee();
      if (response) {
        setDataFees(Object.values(response.data.result));
      }
    };
    fetchData();
  }, []);

  const feeTypeLookup = {
    "ContributionFund": "Phí đóng góp",
    "DepartmentFee": "Phí căn hộ",
    "VehicleFee": "Phí xe cộ",
  };

  const columns = [
    { field: "id", headerName: "Mã phí", disableSearch: "search" },
   
    { 
      field: "feeTypeEnum", 
      headerName: "Loại phí",
      renderCell:(row)=>{
        const feeType = row.feeTypeEnum;
        let color='#000';
        switch(feeType){
          case 'ContributionFund':
            color='#4caf50';
            break;
          case 'DepartmentFee':
            color='#F44336';
            break;
          default:
            color="#757575"
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
              {feeTypeLookup[feeType] || feeType}
          </Box>
        );
      }
    },
    { 
      field: "unitPrice", 
      headerName: "Đơn giá",
      renderCell: (row) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(row.unitPrice);
      }
    },
    { field: "createdAt", headerName: "Ngày tạo" },
     { field: "description", headerName: "Mô tả"},
    {
      field: "thaoTac",
      headerName: "Hành động",
      flex: 1,
      renderCell: () => (
        <Box display="flex" justifyContent="flex-start" gap="15px" sx={{ cursor: 'pointer' }} alignItems="center">
          <EditIcon sx={{ color: '#0D81ED' }} />
          <DeleteIcon sx={{ color: "#C02135" }} />
        </Box>
      )
    }
  ];

  const handleCreate = async () => {
    const { id, description, feeTypeEnum, unitPrice } = newFee;

    if (!id.trim() || !description.trim() || !feeTypeEnum || !unitPrice) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    try {
    const res = await createFee(newFee);
      if (res) {
        toast.success("Tạo phí thành công!");
        setOpenDialog(false);
        setNewFee({
            id: "",
            description: "",
            feeTypeEnum: "DepartmentFee",
            unitPrice: "",
            createdAt: new Date().toISOString().split('T')[0]
        });
        const refresh = await listFee(); // reload lại dữ liệu sau khi tạo
        setDataFees(refresh.data.result);
      }
    } catch (error) {
      console.error("Lỗi khi tạo khoản phí:", error);
      toast.error("Tạo khoản phí thất bại!");
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
          Quản lý Phí và Quỹ
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
            Thêm khoản phí
          </Button>
        </Box>
      </Box>

      {/* Bảng danh sách phí */}
      <Box padding="12px" gap="12px" borderRadius="8px" backgroundColor="#fff" marginTop="20px">
        <ClassTable columns={columns} rows={dataFees} allowSearching />
      </Box>

      {/* Thêm khoản phí mới */}
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
          Thêm khoản phí mới
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
            label="Mã phí"
            fullWidth
            value={newFee.id}
            onChange={(e) => setNewFee({ ...newFee, id: e.target.value })}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={2}
            value={newFee.description}
            onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại phí</InputLabel>
            <Select
              value={newFee.feeTypeEnum}
              label="Loại phí"
              onChange={(e) => setNewFee({ ...newFee, feeTypeEnum: e.target.value })}
            >
              <MenuItem value="MAINTENANCE">Phí bảo trì</MenuItem>
              <MenuItem value="PARKING">Phí giữ xe</MenuItem>
              <MenuItem value="SERVICE">Phí dịch vụ</MenuItem>
              <MenuItem value="SECURITY">Phí bảo vệ</MenuItem>
              <MenuItem value="WATER">Phí nước</MenuItem>
              <MenuItem value="ELECTRICITY">Phí điện</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Đơn giá"
            fullWidth
            type="number"
            value={newFee.unitPrice}
            onChange={(e) => setNewFee({ ...newFee, unitPrice: e.target.value })}
            InputProps={{
              endAdornment: <Box component="span" sx={{ color: 'text.secondary' }}>VNĐ</Box>,
            }}
          />
          <TextField
            label="Ngày tạo"
            type="date"
            fullWidth
            value={newFee.createdAt}
            onChange={(e) => setNewFee({ ...newFee, createdAt: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeeAndFund;