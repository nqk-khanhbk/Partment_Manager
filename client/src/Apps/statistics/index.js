import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableHead,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClassTable from "../../components/Table";
import { listApartMent } from "../../service/apartment.service";
import {
  listBillByAdressNuber,
  listUtilityBillByAdressNuber,
  updateInvoiceStatus,
  updateUtilityBillStatus,
} from "../../service/statistical.service";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

const Statistics = () => {
  const [apartment, setApartment] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBills, setSelectedBills] = useState([]);
  const [selectedUtilityBills, setSelectedUtilityBills] = useState([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState({});

  const fetchApi = async () => {
    const response = await listApartMent();
    setApartment(response.data.result);
  };

  const handleViewClick = async (id) => {
    setDialogTitle(`Danh sách hóa đơn của phòng ${id}`);

    try {
      // Lấy cả hóa đơn thường và hóa đơn tiện ích
      const [billRes, utilityBillRes] = await Promise.all([
        listBillByAdressNuber(id),
        listUtilityBillByAdressNuber(id),
      ]);

      console.log("Bills:", billRes);
      console.log("Utility Bills:", utilityBillRes);

      setSelectedBills(billRes.data);
      setSelectedUtilityBills(utilityBillRes.data);
      setActiveTab(0); // Reset về tab đầu tiên
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Xử lý thanh toán hóa đơn dịch vụ
  const handlePayServiceBill = async (billId, billIndex) => {
    setPaymentLoading((prev) => ({ ...prev, [`service_${billIndex}`]: true }));

    try {
      await updateInvoiceStatus(billId);

      // Cập nhật trạng thái trong state
      setSelectedBills((prevBills) =>
        prevBills.map((bill, index) =>
          index === billIndex ? { ...bill, paymentStatus: "Paid" } : bill
        )
      );

      console.log("Thanh toán hóa đơn dịch vụ thành công");
    } catch (error) {
      console.error("Lỗi khi thanh toán hóa đơn dịch vụ:", error);
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
    } finally {
      setPaymentLoading((prev) => ({
        ...prev,
        [`service_${billIndex}`]: false,
      }));
    }
  };

  // Xử lý thanh toán hóa đơn tiện ích
  const handlePayUtilityBill = async (billId, billIndex) => {
    setPaymentLoading((prev) => ({ ...prev, [`utility_${billIndex}`]: true }));

    try {
      await updateUtilityBillStatus(billId);

      // Cập nhật trạng thái trong state
      setSelectedUtilityBills((prevBills) =>
        prevBills.map((bill, index) =>
          index === billIndex ? { ...bill, paymentStatus: "Paid" } : bill
        )
      );

      console.log("Thanh toán hóa đơn tiện ích thành công");
    } catch (error) {
      console.error("Lỗi khi thanh toán hóa đơn tiện ích:", error);
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
    } finally {
      setPaymentLoading((prev) => ({
        ...prev,
        [`utility_${billIndex}`]: false,
      }));
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const columns = [
    { field: "addressNumber", headerName: "Số nhà", disableSearch: "search" },
    {
      field: "thaoTac",
      headerName: "Hành động",
      flex: 1,
      renderCell: (row) => (
        <Box
          display="flex"
          justifyContent="flex-start"
          gap="15px"
          sx={{ cursor: "pointer" }}
          alignItems="center"
        >
          <VisibilityIcon
            sx={{ color: "#627" }}
            onClick={() => handleViewClick(row.addressNumber)}
          />
          <EditIcon sx={{ color: "#0D81ED" }} />
          <DeleteIcon sx={{ color: "#C02135" }} />
        </Box>
      ),
    },
  ];

  const renderServiceBills = () => {
    return selectedBills.map((bill, index) => {
      const total = bill.feeList.reduce((sum, fee) => sum + fee.amount, 0);
      const isLoading = paymentLoading[`service_${index}`];

      return (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {bill.name} –{" "}
              <b
                style={{
                  color: bill.paymentStatus === "Unpaid" ? "red" : "green",
                }}
              >
                {bill.paymentStatus}
              </b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Tên dịch vụ</b>
                    </TableCell>
                    <TableCell>
                      <b>Kiểu dịch vụ</b>
                    </TableCell>
                    <TableCell>
                      <b>Số tiền</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bill.feeList.map((fee, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{fee.name}</TableCell>
                      <TableCell>{fee.feeType}</TableCell>
                      <TableCell>{fee.amount.toLocaleString()}₫</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}>
                      <b>Tổng cộng:</b>
                    </TableCell>
                    <TableCell>
                      <b
                        style={{
                          color:
                            bill.paymentStatus === "Unpaid"
                              ? "#C01235"
                              : "green",
                        }}
                      >
                        {bill.paymentStatus === "Unpaid"
                          ? `${total.toLocaleString()}₫`
                          : "0₫"}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {bill.paymentStatus === "Unpaid" && (
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "999px" }}
                  onClick={() => handlePayServiceBill(bill.id, index)}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading ? "Đang xử lý..." : "Thanh toán"}
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  const renderUtilityBills = () => {
    return selectedUtilityBills.map((utilityBill, index) => {
      const total =
        utilityBill.electricity + utilityBill.water + utilityBill.internet;
      const isLoading = paymentLoading[`utility_${index}`];

      return (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {utilityBill.name} –{" "}
              <b
                style={{
                  color:
                    utilityBill.paymentStatus === "Unpaid" ? "red" : "green",
                }}
              >
                {utilityBill.paymentStatus}
              </b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Loại tiện ích</b>
                    </TableCell>
                    <TableCell>
                      <b>Số tiền</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Tiền điện</TableCell>
                    <TableCell>
                      {utilityBill.electricity.toLocaleString()}₫
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tiền nước</TableCell>
                    <TableCell>{utilityBill.water.toLocaleString()}₫</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tiền internet</TableCell>
                    <TableCell>
                      {utilityBill.internet.toLocaleString()}₫
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Tổng cộng:</b>
                    </TableCell>
                    <TableCell>
                      <b
                        style={{
                          color:
                            utilityBill.paymentStatus === "Unpaid"
                              ? "#C01235"
                              : "green",
                        }}
                      >
                        {utilityBill.paymentStatus === "Unpaid"
                          ? `${total.toLocaleString()}₫`
                          : "0₫"}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {utilityBill.paymentStatus === "Unpaid" && (
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "999px" }}
                  onClick={() => handlePayUtilityBill(utilityBill.id, index)}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                  {isLoading ? "Đang xử lý..." : "Thanh toán"}
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  return (
    <>
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
          Trang thống kê hóa đơn
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
          >
            <AddIcon sx={{ fontSize: 18, mr: 1 }} />
            Thêm thống kê mới
          </Button>
        </Box>
      </Box>

      <Box
        padding="12px"
        gap="12px"
        borderRadius="8px"
        backgroundColor="#fff"
        marginTop="20px"
      >
        <ClassTable columns={columns} rows={apartment} allowSearching />
      </Box>

      {/* Dialog hiển thị hóa đơn với tabs */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
        sx={{ borderRadius: "12px" }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#C01235",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {dialogTitle}
          <IconButton onClick={() => setOpenDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Tabs để chuyển đổi giữa hóa đơn dịch vụ và hóa đơn tiện ích */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Hóa đơn dịch vụ" />
            <Tab label="Hóa đơn tiện ích" />
          </Tabs>

          {/* Tab content */}
          {activeTab === 0 && (
            <Box>
              {selectedBills.length > 0 ? (
                renderServiceBills()
              ) : (
                <Typography sx={{ textAlign: "center", py: 4, color: "#666" }}>
                  Không có hóa đơn dịch vụ nào.
                </Typography>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {selectedUtilityBills.length > 0 ? (
                renderUtilityBills()
              ) : (
                <Typography sx={{ textAlign: "center", py: 4, color: "#666" }}>
                  Không có hóa đơn tiện ích nào.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Statistics;
