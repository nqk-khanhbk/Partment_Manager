import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import ClassTable from "../../components/Table";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import {
  listFee,
  createFee,
  updateFee,
  deleteFee,
} from "../../service/fee.service";

const FeeAndFund = () => {
  const [dataFees, setDataFees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editFee, setEditFee] = useState({
    id: "",
    name: "",
    description: "",
    feeTypeEnum: "",
    unitPrice: "",
  });

  const [newFee, setNewFee] = useState({
    id: "",
    name: "",
    description: "",
    feeTypeEnum: "DepartmentFee",
    unitPrice: "",
    createdAt: new Date().toISOString().split("T")[0],
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
    ContributionFund: "Phí đóng góp",
    DepartmentFee: "Phí căn hộ",
    VehicleFee: "Phí xe cộ",
  };

  const handleEditClick = (row) => {
    // Kiểm tra xem row có tồn tại hay không
    if (!row) {
      console.error("Dữ liệu hàng không tồn tại");
      toast.error("Không thể chỉnh sửa: Dữ liệu không hợp lệ");
      return;
    }
    setEditFee({
      id: row.id,
      name: row.name,
      description: row.description,
      feeTypeEnum: row.feeTypeEnum,
      unitPrice: row.unitPrice,
    });
    setOpenEditDialog(true);
  };
  const handleDeleteClick = (row) => {
    if (!row) {
      console.error("Dữ liệu hàng không tồn tại");
      toast.error("Không thể xóa: Dữ liệu không hợp lệ");
      return;
    }
    setDeleteId(row.id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) {
      toast.error("Không có ID để xóa!");
      return;
    }

    try {
      const res = await deleteFee(deleteId);
      if (res) {
        toast.success("Xóa phí thành công!");
        setOpenDeleteDialog(false);
        setDeleteId(null);
        const refresh = await listFee(); // reload lại dữ liệu sau khi xóa
        setDataFees(Object.values(refresh.data.result));
      }
    } catch (error) {
      console.error("Lỗi khi xóa khoản phí:", error);
      toast.error("Xóa khoản phí thất bại!");
    }
  };

  const handleUpdate = async () => {
    const { id, name, description, feeTypeEnum, unitPrice } = editFee;

    if (!name.trim() || !description.trim() || !feeTypeEnum || !unitPrice) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const res = await updateFee(editFee);
      if (res) {
        toast.success("Cập nhật phí thành công!");
        setOpenEditDialog(false);
        const refresh = await listFee(); // reload lại dữ liệu sau khi cập nhật
        setDataFees(Object.values(refresh.data.result));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật khoản phí:", error);
      toast.error("Cập nhật khoản phí thất bại!");
    }
  };

  const columns = [
    { field: "id", headerName: "Mã phí", disableSearch: "search" },
    { field: "name", headerName: "Tên" },
    {
      field: "feeTypeEnum",
      headerName: "Loại phí",
      renderCell: (row) => {
        const feeType = row.feeTypeEnum;
        let color = "#000";
        switch (feeType) {
          case "ContributionFund":
            color = "#4caf50";
            break;
          case "DepartmentFee":
            color = "#F44336";
            break;
          default:
            color = "#757575";
        }
        return (
          <Box
            sx={{
              padding: "2px 8px",
              backgroundColor: `${color}22`, // nền nhạt
              color: color,
              borderRadius: "8px",
              display: "inline-block",
              fontWeight: 500,
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {feeTypeLookup[feeType] || feeType}
          </Box>
        );
      },
    },
    {
      field: "unitPrice",
      headerName: "Đơn giá",
      renderCell: (row) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(row.unitPrice);
      },
    },
    { field: "description", headerName: "Mô tả" },
    {
      field: "thaoTac",
      headerName: "Hành động",
      flex: 1,
      renderCell: (params) => {
        // Debug để xem cấu trúc dữ liệu
        console.log("Params structure:", params);

        return (
          <Box
            display="flex"
            justifyContent="flex-start"
            gap="15px"
            sx={{ cursor: "pointer" }}
            alignItems="center"
          >
            <EditIcon
              sx={{ color: "#0D81ED" }}
              onClick={() => {
                // Thử nhiều cách truy cập dữ liệu
                const rowData = params.row || params || params.data;
                console.log("Row data:", rowData);
                handleEditClick(rowData);
              }}
            />
            <DeleteIcon
              sx={{ color: "#C02135" }}
              onClick={() => {
                const rowData = params.row || params || params.data;
                handleDeleteClick(rowData);
              }}
            />
          </Box>
        );
      },
    },
  ];

  const handleCreate = async () => {
    const { name, description, feeTypeEnum, unitPrice } = newFee;

    if (!name.trim() || !description.trim() || !feeTypeEnum || !unitPrice) {
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
          name: "",
          description: "",
          feeTypeEnum: "DepartmentFee",
          unitPrice: "",
          createdAt: new Date().toISOString().split("T")[0],
        });
        const refresh = await listFee(); // reload lại dữ liệu sau khi tạo
        setDataFees(Object.values(refresh.data.result));
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
        sx={{
          padding: "12px",
          borderRadius: "8px",
          gap: "12px",
          backgroundColor: "#FFFF",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#C01235" }}>
          Quản lý Phí và Quỹ
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            borderRadius: "10px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0B57D0",
              textTransform: "none",
              borderRadius: "999px",
              paddingX: 2,
              fontWeight: 500,
            }}
            onClick={() => setOpenDialog(true)}
          >
            <AddIcon sx={{ fontSize: 18, mr: 1 }} />
            Thêm khoản phí
          </Button>
        </Box>
      </Box>

      {/* Bảng danh sách phí */}
      <Box
        padding="12px"
        gap="12px"
        borderRadius="8px"
        backgroundColor="#fff"
        marginTop="20px"
      >
        <ClassTable columns={columns} rows={dataFees} allowSearching />
      </Box>

      {/* Thêm khoản phí mới */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogTitle>
          Thêm khoản phí mới
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            mt: 1,
          }}
        >
          <TextField
            label="Tên khoản phí"
            fullWidth
            value={newFee.name}
            onChange={(e) => setNewFee({ ...newFee, name: e.target.value })}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={2}
            value={newFee.description}
            onChange={(e) =>
              setNewFee({ ...newFee, description: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại phí</InputLabel>
            <Select
              value={newFee.feeTypeEnum}
              label="Loại phí"
              onChange={(e) =>
                setNewFee({ ...newFee, feeTypeEnum: e.target.value })
              }
            >
              <MenuItem value="ContributionFund">Phí đóng góp</MenuItem>
              <MenuItem value="DepartmentFee">Phí căn hộ</MenuItem>
              <MenuItem value="VehicleFee">Phí xe cộ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Đơn giá"
            fullWidth
            type="number"
            value={newFee.unitPrice}
            onChange={(e) =>
              setNewFee({ ...newFee, unitPrice: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  VNĐ
                </Box>
              ),
            }}
          />
          <TextField
            label="Ngày tạo"
            type="date"
            fullWidth
            value={newFee.createdAt}
            onChange={(e) =>
              setNewFee({ ...newFee, createdAt: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleCreate} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chỉnh sửa phí */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogTitle>
          Chỉnh sửa khoản phí
          <IconButton
            onClick={() => setOpenEditDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 400,
            mt: 1,
          }}
        >
          <TextField label="Mã phí" fullWidth value={editFee.id} disabled />
          <TextField
            label="Tên khoản phí"
            fullWidth
            value={editFee.name}
            onChange={(e) => setEditFee({ ...editFee, name: e.target.value })}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={2}
            value={editFee.description}
            onChange={(e) =>
              setEditFee({ ...editFee, description: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Loại phí</InputLabel>
            <Select
              value={editFee.feeTypeEnum}
              label="Loại phí"
              onChange={(e) =>
                setEditFee({ ...editFee, feeTypeEnum: e.target.value })
              }
            >
              <MenuItem value="ContributionFund">Phí đóng góp</MenuItem>
              <MenuItem value="DepartmentFee">Phí căn hộ</MenuItem>
              <MenuItem value="VehicleFee">Phí xe cộ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Đơn giá"
            fullWidth
            type="number"
            value={editFee.unitPrice}
            onChange={(e) =>
              setEditFee({ ...editFee, unitPrice: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  VNĐ
                </Box>
              ),
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog xác nhận xóa phí */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogTitle>
          Xác nhận xóa
          <IconButton
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ width: 400, mt: 1 }}>
          <Typography>
            Bạn có chắc chắn muốn xóa khoản phí này không? Hành động này không
            thể hoàn tác.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ backgroundColor: "#C02135" }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeeAndFund;
