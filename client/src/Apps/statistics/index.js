import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent, Accordion,
    AccordionSummary, AccordionDetails, TableCell, TableRow, TableContainer,
    Paper, Table, TableBody, TableHead, IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClassTable from "../../components/Table";
import { listApartMent } from "../../service/apartment.service";
import { listBillByAdressNuber } from "../../service/statistical.service"; // 👈 API mới
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

const Statistics = () => {
    const [apartment, setApartment] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBills, setSelectedBills] = useState([]);
    const [dialogTitle, setDialogTitle] = useState('');

    const fetchApi = async () => {
        const response = await listApartMent();
        setApartment(response.data.result);
    };

    const handleViewClick = async (id) => {
        setDialogTitle(`Danh sách hóa đơn của phòng ${id}`);
        const res = await listBillByAdressNuber(id); // Truyền ID addressNumber
        console.log(res)
        setSelectedBills(res.data);
        setOpenDialog(true);
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
                <Box display="flex" justifyContent="flex-start" gap="15px" sx={{ cursor: "pointer" }} alignItems="center">
                    <VisibilityIcon sx={{ color: '#627' }} onClick={() => handleViewClick(row.addressNumber)} />
                    <EditIcon sx={{ color: "#0D81ED" }} />
                    <DeleteIcon sx={{ color: "#C02135" }} />
                </Box>
            ),
        },
    ];

    return (
        <>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ padding: '12px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFFF' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C01235' }}>
                    Trang thống kê hóa đơn
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderRadius: '10px' }}>
                    <Button variant="contained" sx={{ backgroundColor: '#0B57D0', textTransform: 'none', borderRadius: '999px', paddingX: 2, fontWeight: 500 }}>
                        <AddIcon sx={{ fontSize: 18, mr: 1 }} />
                        Thêm thống kê mới
                    </Button>
                </Box>
            </Box>

            <Box padding="12px" gap="12px" borderRadius="8px" backgroundColor="#fff" marginTop="20px">
                <ClassTable columns={columns} rows={apartment} allowSearching />
            </Box>
            {/* dialog hiển thị hóa đơn */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md" sx={{borderRadius: '12px'}}>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#C01235', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {dialogTitle}
                    <IconButton onClick={() => setOpenDialog(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedBills.map((bill, index) => {
                        const total = bill.feeList.reduce((sum, fee) => sum + fee.amount, 0);

                        return (
                            <Accordion key={index} sx={{ mb: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        {bill.name} – <b style={{ color: bill.paymentStatus === "Unpaid" ? "red" : "green" }}>{bill.paymentStatus}</b>
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* Table MUI */}
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><b>Tên dịch vụ</b></TableCell>
                                                    <TableCell><b>Kiểu dịch vụ</b></TableCell>
                                                    <TableCell><b>Số tiền</b></TableCell>
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
                                                    <TableCell colSpan={2}><b>Tổng cộng:</b></TableCell>
                                                    <TableCell>
                                                        <b style={{ color: bill.paymentStatus === "unpaid" ? "#C01235" : "green" }}>
                                                            {bill.paymentStatus === "Unpaid" ? `${total.toLocaleString()}₫` : "0₫"}
                                                        </b>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Nếu chưa thanh toán thì hiển thị nút thanh toán */}
                                    {bill.paymentStatus === "Unpaid" && (
                                        <Box display="flex" justifyContent="flex-end" mt={2}>
                                            <Button variant="contained" color="primary" sx={{ borderRadius: '999px' }}>
                                                Thanh toán
                                            </Button>
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </DialogContent>
            </Dialog>

        </>
    );
}

export default Statistics;
