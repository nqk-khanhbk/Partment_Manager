import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState, useEffect } from "react";
import ClassTable from "../../components/Table";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import {
  getInvoices,
  getInvoiceDetail,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  listFee,
  getApartments,
} from "../../service/invoices.service";

const Invoices = () => {
  const [dataInvoices, setDataInvoices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allApartments, setAllApartments] = useState([]); // Danh sách căn hộ

  const [newInvoice, setNewInvoice] = useState({
    invoiceId: "",
    name: "",
    description: "",
    feeIds: [],
    apartmentId: "", // null sẽ là "Tất cả"
  });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [allFees, setAllFees] = useState([]); // Danh sách tất cả các fee

  const [editInvoice, setEditInvoice] = useState({
    invoiceId: "",
    name: "",
    description: "",
    feeIds: [],
  });
  // Fetch apartments for selection
  const fetchApartments = async () => {
    try {
      // Giả sử có API để lấy danh sách apartments
      const response = await getApartments();
      setAllApartments(response.data.result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách căn hộ:", error);
      setAllApartments([]);
    }
  };
  // Fetch all fees for selection
  const fetchAllFees = async () => {
    try {
      const response = await listFee();
      console.log("Fees Response:", response);

      // Xử lý response để lấy array fees
      if (response && response.data) {
        if (Array.isArray(response.data.result)) {
          setAllFees(response.data.result);
        } else if (
          response.data.result &&
          typeof response.data.result === "object"
        ) {
          // Nếu result là object, chuyển thành array
          setAllFees(Object.values(response.data.result));
        } else if (Array.isArray(response.data)) {
          setAllFees(response.data);
        } else {
          console.warn("Unexpected fees data structure:", response.data);
          setAllFees([]);
        }
      } else {
        setAllFees([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phí:", error);
      setAllFees([]); // Đảm bảo set array rỗng khi có lỗi
    }
  };
  // Fetch data từ API
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await getInvoices();
      console.log("API Response:", response);

      if (response && response.data && response.data.result) {
        setDataInvoices(response.data.result);
      } else {
        setDataInvoices([]);
        console.warn("No invoice data found in response");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      toast.error("Không thể tải danh sách hóa đơn!");
      setDataInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect để gọi API khi component mount
  useEffect(() => {
    fetchInvoices();
    fetchAllFees();
    fetchApartments();
  }, []);

  // Handle functions
  const handleCreate = async () => {
    if (!newInvoice.invoiceId || !newInvoice.name) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    if (newInvoice.feeIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một loại phí!");
      return;
    }

    try {
      const createData = {
        invoiceId: newInvoice.invoiceId,
        name: newInvoice.name,
        description: newInvoice.description,
        feeIds: newInvoice.feeIds,
        apartmentId: newInvoice.apartmentId || null, // null sẽ là "Tất cả"
      };

      console.log("Create data:", createData);

      const response = await createInvoice(createData);
      if (response) {
        toast.success("Tạo hóa đơn thành công!");
        setOpenDialog(false);
        setNewInvoice({
          invoiceId: "",
          name: "",
          description: "",
          feeIds: [],
          apartmentId: "",
        });
        fetchInvoices(); // Refresh data
      }
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      toast.error("Tạo hóa đơn thất bại!");
    }
  };

  const handleViewDetail = async (invoice) => {
    console.log("View detail for invoice:", invoice.id);
    setLoading(true);

    try {
      const response = await getInvoiceDetail(invoice.id);
      console.log("Detail API Response:", response);

      if (response && response.data) {
        setSelectedInvoice(response.data);
        setOpenDetailDialog(true);
      } else {
        toast.error("Không thể lấy chi tiết hóa đơn!");
      }
    } catch (error) {
      console.error("Lỗi khi xem chi tiết hóa đơn:", error);
      toast.error("Không thể xem chi tiết hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (invoice) => {
    console.log("Edit invoice:", invoice);

    // Set dữ liệu cho form edit
    setEditInvoice({
      invoiceId: invoice.id,
      name: invoice.name,
      description: invoice.description,
      feeIds: invoice.feeList?.map((fee) => fee.id) || [],
    });

    setOpenEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!editInvoice.name) {
      toast.warning("Vui lòng nhập tên hóa đơn!");
      return;
    }

    try {
      const updateData = {
        invoiceId: editInvoice.invoiceId,
        name: editInvoice.name,
        description: editInvoice.description,
        feeIds: editInvoice.feeIds,
      };

      console.log("Update data:", updateData);

      const response = await updateInvoice(updateData);
      if (response) {
        toast.success("Cập nhật hóa đơn thành công!");
        setOpenEditDialog(false);
        fetchInvoices(); // Refresh data
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hóa đơn:", error);
      toast.error("Cập nhật hóa đơn thất bại!");
    }
  };

  const handleDelete = async (invoice) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa hóa đơn ${invoice.id}?`)) {
      try {
        const response = await deleteInvoice(invoice.id);
        if (response) {
          toast.success("Xóa hóa đơn thành công!");
          fetchInvoices(); // Refresh data
        }
      } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
        toast.error("Xóa hóa đơn thất bại!");
      }
    }
  };

  // Format functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getFeeTypeColor = (feeType) => {
    switch (feeType) {
      case "DepartmentFee":
        return "#1976D2";
      case "VehicleFee":
        return "#FF9800";
      case "ContributionFund":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  const getFeeTypeName = (feeType) => {
    switch (feeType) {
      case "DepartmentFee":
        return "Phí căn hộ";
      case "VehicleFee":
        return "Phí xe cộ";
      case "ContributionFund":
        return "Phí đóng góp";
      default:
        return feeType;
    }
  };

  const columns = [
    { field: "id", headerName: "Mã HĐ", disableSearch: "search", width: 180 },
    { field: "name", headerName: "Tên hóa đơn", flex: 1, minWidth: 250 },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 1,
      minWidth: 200,
      renderCell: (row) => (
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
          title={row.description}
        >
          {row.description || "Không có mô tả"}
        </Box>
      ),
    },
    {
      field: "feeCount",
      headerName: "Số loại phí",
      width: 120,
      renderCell: (row) => (
        <Chip
          label={row.feeList?.length || 0}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 130,
      renderCell: (row) => (
        <Chip
          label={row.isActive === 1 ? "Hoạt động" : "Không hoạt động"}
          color={row.isActive === 1 ? "success" : "default"}
          size="small"
          sx={{
            fontWeight: 500,
            ...(row.isActive === 1
              ? {
                  backgroundColor: "#e8f5e8",
                  color: "#2e7d32",
                }
              : {
                  backgroundColor: "#f5f5f5",
                  color: "#757575",
                }),
          }}
        />
      ),
    },
    {
      field: "thaoTac",
      headerName: "Hành động",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const rowData = params.row || params || params.data;
        return (
          <Box
            display="flex"
            justifyContent="flex-start"
            gap="12px"
            sx={{ cursor: "pointer" }}
            alignItems="center"
          >
            <VisibilityIcon
              sx={{
                color: "#1976D2",
                fontSize: 20,
                "&:hover": {
                  color: "#1565C0",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => handleViewDetail(rowData)}
              title="Xem chi tiết"
            />
            <EditIcon
              sx={{
                color: "#0D81ED",
                fontSize: 20,
                "&:hover": {
                  color: "#0066CC",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => handleEdit(rowData)}
              title="Chỉnh sửa"
            />
            <DeleteIcon
              sx={{
                color: "#C02135",
                fontSize: 20,
                "&:hover": {
                  color: "#A01628",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => handleDelete(rowData)}
              title="Xóa"
            />
          </Box>
        );
      },
    },
  ];

  return (
    <>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#C01235",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ReceiptIcon /> Quản lý Hóa đơn
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: "#0B57D0",
            textTransform: "none",
            borderRadius: "24px",
            paddingX: 3,
            paddingY: 1.5,
            fontWeight: 600,
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(11, 87, 208, 0.3)",
            "&:hover": {
              backgroundColor: "#0948B3",
              boxShadow: "0 6px 16px rgba(11, 87, 208, 0.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Thêm hóa đơn mới
        </Button>
      </Box>

      {/* Table */}
      <Box
        sx={{
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <ClassTable
          columns={columns}
          rows={dataInvoices}
          allowSearching
          loading={loading}
        />
      </Box>

      {/* Create Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <ReceiptIcon sx={{ color: "#1976D2" }} />
            Thêm hóa đơn mới
          </Box>
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

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Thông tin cơ bản */}
            <Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Mã hóa đơn"
                  fullWidth
                  value={newInvoice.invoiceId}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, invoiceId: e.target.value })
                  }
                  placeholder="Nhập mã hóa đơn"
                  required
                />

                <TextField
                  label="Tên hóa đơn"
                  fullWidth
                  value={newInvoice.name}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, name: e.target.value })
                  }
                  placeholder="Nhập tên hóa đơn"
                  required
                />

                <TextField
                  label="Mô tả"
                  fullWidth
                  multiline
                  rows={3}
                  value={newInvoice.description}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      description: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả hóa đơn"
                />

                {/* Chọn căn hộ */}
                <FormControl fullWidth>
                  <InputLabel>Căn hộ áp dụng</InputLabel>
                  <Select
                    value={newInvoice.apartmentId}
                    onChange={(e) =>
                      setNewInvoice({
                        ...newInvoice,
                        apartmentId: e.target.value,
                      })
                    }
                    label="Căn hộ áp dụng"
                  >
                    <MenuItem value="">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="primary"
                        >
                          Tất cả căn hộ
                        </Typography>
                      </Box>
                    </MenuItem>
                    {allApartments.map((apartment) => (
                      <MenuItem
                        key={apartment.addressNumber}
                        value={apartment.addressNumber}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body1">
                            Căn hộ {apartment.addressNumber}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Chọn phí */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mb: 2 }}
              >
                <AttachMoneyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Chọn các loại phí *
              </Typography>

              <Autocomplete
                multiple
                options={allFees}
                getOptionLabel={(option) =>
                  `${option.name} - ${formatCurrency(option.unitPrice)}`
                }
                value={allFees.filter((fee) =>
                  newInvoice.feeIds.includes(fee.id)
                )}
                onChange={(event, newValues) => {
                  setNewInvoice({
                    ...newInvoice,
                    feeIds: newValues.map((fee) => fee.id),
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn các loại phí"
                    placeholder="Tìm kiếm và chọn phí..."
                    variant="outlined"
                    required
                    error={newInvoice.feeIds.length === 0}
                    helperText={
                      newInvoice.feeIds.length === 0
                        ? "Vui lòng chọn ít nhất một loại phí"
                        : ""
                    }
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Checkbox
                      style={{ marginRight: 12 }}
                      checked={selected}
                      color="primary"
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {option.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={getFeeTypeName(option.feeTypeEnum)}
                            size="small"
                            sx={{
                              backgroundColor: `${getFeeTypeColor(
                                option.feeTypeEnum
                              )}22`,
                              color: getFeeTypeColor(option.feeTypeEnum),
                              fontSize: "11px",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
                        {formatCurrency(option.unitPrice)}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight="500">
                            {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({formatCurrency(option.unitPrice)})
                          </Typography>
                        </Box>
                      }
                      {...getTagProps({ index })}
                      key={option.id}
                      variant="outlined"
                      color="primary"
                      sx={{
                        height: "auto",
                        py: 0.5,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))
                }
                disableCloseOnSelect
                filterSelectedOptions
                noOptionsText="Không tìm thấy phí nào"
                sx={{
                  "& .MuiAutocomplete-tag": {
                    margin: "2px",
                  },
                }}
              />
            </Box>

            {/* Preview các phí đã chọn */}
            {newInvoice.feeIds.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  Xem trước danh sách phí ({newInvoice.feeIds.length})
                </Typography>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ maxHeight: 300 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#F5F5F5" }}>
                        <TableCell>
                          <strong>ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Tên phí</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Loại phí</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Đơn giá</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allFees
                        .filter((fee) => newInvoice.feeIds.includes(fee.id))
                        .map((fee, index) => (
                          <TableRow
                            key={fee.id}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#FAFAFA" : "#FFFFFF",
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {fee.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {fee.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {fee.description}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getFeeTypeName(fee.feeTypeEnum)}
                                size="small"
                                sx={{
                                  backgroundColor: `${getFeeTypeColor(
                                    fee.feeTypeEnum
                                  )}22`,
                                  color: getFeeTypeColor(fee.feeTypeEnum),
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="primary"
                              >
                                {formatCurrency(fee.unitPrice)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            color="primary"
            disabled={
              !newInvoice.invoiceId ||
              !newInvoice.name ||
              newInvoice.feeIds.length === 0
            }
          >
            Tạo hóa đơn
          </Button>
        </DialogActions>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            position: "relative",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <EditIcon sx={{ color: "#1976D2" }} />
            Chỉnh sửa hóa đơn
          </Box>
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

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Thông tin cơ bản */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mb: 2 }}
              >
                <ReceiptIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Thông tin hóa đơn
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Mã hóa đơn"
                  fullWidth
                  value={editInvoice.invoiceId}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#666",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />

                <TextField
                  label="Tên hóa đơn"
                  fullWidth
                  value={editInvoice.name}
                  onChange={(e) =>
                    setEditInvoice({ ...editInvoice, name: e.target.value })
                  }
                  placeholder="Nhập tên hóa đơn"
                  required
                />

                <TextField
                  label="Mô tả"
                  fullWidth
                  multiline
                  rows={3}
                  value={editInvoice.description}
                  onChange={(e) =>
                    setEditInvoice({
                      ...editInvoice,
                      description: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả hóa đơn"
                />
              </Box>
            </Box>

            {/* Chọn phí */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mb: 2 }}
              >
                <AttachMoneyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Chọn các loại phí
              </Typography>

              <Autocomplete
                multiple
                options={allFees}
                getOptionLabel={(option) =>
                  `${option.name} - ${formatCurrency(option.unitPrice)}`
                }
                value={allFees.filter((fee) =>
                  editInvoice.feeIds.includes(fee.id)
                )}
                onChange={(event, newValues) => {
                  setEditInvoice({
                    ...editInvoice,
                    feeIds: newValues.map((fee) => fee.id),
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chọn các loại phí"
                    placeholder="Tìm kiếm và chọn phí..."
                    variant="outlined"
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ p: 2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Checkbox
                      style={{ marginRight: 12 }}
                      checked={selected}
                      color="primary"
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          {option.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={getFeeTypeName(option.feeTypeEnum)}
                            size="small"
                            sx={{
                              backgroundColor: `${getFeeTypeColor(
                                option.feeTypeEnum
                              )}22`,
                              color: getFeeTypeColor(option.feeTypeEnum),
                              fontSize: "11px",
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
                        {formatCurrency(option.unitPrice)}
                      </Typography>
                    </Box>
                  </Box>
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography variant="body2" fontWeight="500">
                            {option.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({formatCurrency(option.unitPrice)})
                          </Typography>
                        </Box>
                      }
                      {...getTagProps({ index })}
                      key={option.id}
                      variant="outlined"
                      color="primary"
                      sx={{
                        height: "auto",
                        py: 0.5,
                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  ))
                }
                disableCloseOnSelect
                filterSelectedOptions
                noOptionsText="Không tìm thấy phí nào"
                sx={{
                  "& .MuiAutocomplete-tag": {
                    margin: "2px",
                  },
                }}
              />

              {/* Hiển thị tổng tiền */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Số phí đã chọn: {editInvoice.feeIds.length}
                  </Typography>
                </Box>
                {editInvoice.feeIds.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() =>
                      setEditInvoice({ ...editInvoice, feeIds: [] })
                    }
                    sx={{ mt: 1, fontSize: "12px", textTransform: "none" }}
                  >
                    Xóa tất cả
                  </Button>
                )}
              </Box>
            </Box>

            {/* Preview các phí đã chọn */}
            {editInvoice.feeIds.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  Xem trước danh sách phí ({editInvoice.feeIds.length})
                </Typography>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ maxHeight: 300 }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#F5F5F5" }}>
                        <TableCell>
                          <strong>ID</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Tên phí</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Loại phí</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Đơn giá</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allFees
                        .filter((fee) => editInvoice.feeIds.includes(fee.id))
                        .map((fee, index) => (
                          <TableRow
                            key={fee.id}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "#FAFAFA" : "#FFFFFF",
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold">
                                {fee.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {fee.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {fee.description}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getFeeTypeName(fee.feeTypeEnum)}
                                size="small"
                                sx={{
                                  backgroundColor: `${getFeeTypeColor(
                                    fee.feeTypeEnum
                                  )}22`,
                                  color: getFeeTypeColor(fee.feeTypeEnum),
                                  fontWeight: 500,
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="primary"
                              >
                                {formatCurrency(fee.unitPrice)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            color="primary"
            disabled={!editInvoice.name || editInvoice.feeIds.length === 0}
          >
            Cập nhật hóa đơn
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Invoices;
