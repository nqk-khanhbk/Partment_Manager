import {
    Box, Typography, Button,
    TextField,
    MenuItem,
    FormControl,
    Select,
} from "@mui/material";

const ClassHand = () => {
    return (
        <>
            {/* header */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFFF' }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C01235' }}>Thêm lớp học mới</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderRadius: '10px' }}>
                    <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: 'none' }}>Hủy</Button>
                    <Button variant="contained" sx={{ borderRadius: "20px", textTransform: 'none', }}>Lưu và tiếp tục</Button>
                </Box>
            </Box>
            <Box
                padding="16px"
                borderRadius="8px"
                backgroundColor="#fff"
                marginTop="20px"
                display="flex"
                flexDirection="column"
                gap="20px"
            >
                <Typography variant="h6" fontWeight="bold" textAlign="left">
                    Thông tin chung
                </Typography>

                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="24px">
                    {/* Chọn mã học phần */}
                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
                        <Typography fontSize={14} mb={0.5} textAlign="left">
                            Chọn mã học phần: <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select defaultValue="IT2025" displayEmpty  sx={{ textAlign: "left" }}>
                                <MenuItem value="IT2025">IT2025</MenuItem>
                                <MenuItem value="IT3030">IT3030</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Tên học phần */}
                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
                        <Typography fontSize={14} mb={0.5} textAlign="left">
                            Tên học phần: <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value="Cấu trúc dữ liệu và thuật toán"
                            InputProps={{ readOnly: true }}
                        />
                    </Box>

                    {/* Đơn vị */}
                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
                        <Typography fontSize={14} mb={0.5} textAlign="left">
                            Đơn vị: <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value="Trường Công nghệ thông tin và Truyền thông"
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                </Box>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="24px">
                    {/* Mã lớp */}
                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                        <Typography fontSize={14} mb={0.5} textAlign="left">
                            Mã lớp: <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField fullWidth size="small" placeholder="Nhập mã lớp" />
                    </Box>

                    {/* Giảng viên */}
                    <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                        <Typography fontSize={14} mb={0.5} textAlign="left">
                            Giảng viên: <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select defaultValue="" displayEmpty  sx={{ textAlign: "left" }}>
                                <MenuItem value="">Chọn giảng viên</MenuItem>
                                <MenuItem value="GV01">Nguyễn Văn A</MenuItem>
                                <MenuItem value="GV02">Trần Thị B</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="24px">
                     {/* Loại lớp */}
                     <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                        <Typography fontSize={14} mb={0.5} textAlign="left">
                            Loại lớp:
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select defaultValue="" displayEmpty sx={{textAlign:'left'}}>
                                <MenuItem value="">Lớp học</MenuItem>
                                <MenuItem value="LT">Lý thuyết</MenuItem>
                                <MenuItem value="TH">Thực hành</MenuItem>
                            </Select>
                        </FormControl>
                     </Box>
                     <Box sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
                        <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gap="24px">
                            {/* Lịch học */}
                            <Box sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
                                <Typography fontSize={14} mb={0.5} textAlign="left">
                                    Lịch học:
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select defaultValue="" displayEmpty sx={{textAlign:"left"}}>
                                        <MenuItem value="">Chọn thứ</MenuItem>
                                        <MenuItem value="2">Thứ 2</MenuItem>
                                        <MenuItem value="3">Thứ 3</MenuItem>
                                        <MenuItem value="4">Thứ 4</MenuItem>
                                        <MenuItem value="5">Thứ 5</MenuItem>
                                        <MenuItem value="6">Thứ 6</MenuItem>
                                        <MenuItem value="7">Thứ 7</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ gridColumn: { xs: "span 12", md: "span 3" } }}>
                                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="24px">
                                    {/* Từ tiết */}
                                    <Box sx={{ gridColumn: { xs: "span 2", md: "span 2" } }}>
                                        <Typography fontSize={14} mb={0.5} textAlign="left">
                                            Từ tiết:
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Select defaultValue="">
                                                {[...Array(12)].map((_, i) => (
                                                    <MenuItem key={i} value={i + 1}>
                                                        {i + 1}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    {/* Đến tiết */}
                                    <Box sx={{ gridColumn: { xs: "span 2", md: "span 2" } }}>
                                        <Typography fontSize={14} mb={0.5} textAlign="left">
                                            Đến tiết:
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Select defaultValue="">
                                                {[...Array(12)].map((_, i) => (
                                                    <MenuItem key={i} value={i + 1}>
                                                        {i + 1}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </Box>
                            
                            
                        </Box>   
                    </Box>
                </Box>
            </Box>
        </>
    )
}
export default ClassHand;