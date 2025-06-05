import {
    Box, Typography, Button,
} from "@mui/material";
import ClassTable from "../../components/Table";
import { data3,dataTitle3} from '../../data/feckdata';
const columns1 = dataTitle3;
const rows = data3;
const ClassCreateEhust = () => {
    return (
        <>
            {/* header */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ padding: '12px', borderRadius: '8px', gap: '12px', backgroundColor: '#FFFF' }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C01235' }}>Thêm lớp học mới từ Ehust</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderRadius: '10px' }}>
                    <Button variant="outlined" sx={{ borderRadius: "20px", textTransform: 'none' }}>Hủy</Button>
                    <Button variant="contained" sx={{ borderRadius: "20px", textTransform: 'none', }}>Lưu</Button>
                </Box>
            </Box>
            <Box padding="12px" gap="12px" borderRadius="8px" backgroundColor="#fff" marginTop="20px">
                <Box>
                     <Typography fontWeight="700" fontSize="16px" color="#4B4E59" textAlign="left">Danh sách lớp được thêm</Typography>
                </Box>
                <Box marginTop="20px">
                    <ClassTable columns={columns1} rows={rows} allowSearching/>
                </Box>
                
            </Box>
        </>
    )
}
export default ClassCreateEhust;