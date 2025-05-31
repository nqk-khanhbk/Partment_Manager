import { Box, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import LoginIcon from '@mui/icons-material/Login';
import ActionMenu from "../components/actionMenu";
export const data = [
    {
        id: 1,
        maHocPhan: 'IT2025',
        maLop: '128495',
        tenHocPhan: 'Cấu trúc dữ liệu và thuật toán',
        soSV: 50,
        loaiLop: 'Lớp học',
        lichHoc: 'Thứ 2, Tiết 4-6',
        donVi: 'Trường CNTT&TT',
        giangVien: 'Nguyễn Văn An',
        trangThai: 'Hiển thị',
        ghiChu: 'Ghi chú',
        
    },
    {
      id: 2,
      maHocPhan: 'IT2025',
      maLop: '128495',
      tenHocPhan: 'Cấu trúc dữ liệu và thuật toán',
      soSV: 50,
      loaiLop: 'Lớp học',
      lichHoc: 'Thứ 2, Tiết 4-6',
      donVi: 'Trường CNTT&TT',
      giangVien: 'Nguyễn Văn An',
      trangThai: 'Hiển thị',
      ghiChu: 'Ghi chú',
      
  },
  {
    id: 3,
    maHocPhan: 'IT2025',
    maLop: '128495',
    tenHocPhan: 'Cấu trúc dữ liệu và thuật toán',
    soSV: 50,
    loaiLop: 'Lớp học',
    lichHoc: 'Thứ 2, Tiết 4-6',
    donVi: 'Trường CNTT&TT',
    giangVien: 'Nguyễn Văn An',
    trangThai: 'Hiển thị',
    ghiChu: 'Ghi chú',
    
},
{
  id: 4,
  maHocPhan: 'IT2025',
  maLop: '128495',
  tenHocPhan: 'Cấu trúc dữ liệu và thuật toán',
  soSV: 50,
  loaiLop: 'Lớp học',
  lichHoc: 'Thứ 2, Tiết 4-6',
  donVi: 'Trường CNTT&TT',
  giangVien: 'Nguyễn Văn An',
  trangThai: 'Hiển thị',
  ghiChu: 'Ghi chú',
  
},
{
  id: 5,
  maHocPhan: 'IT2025',
  maLop: '128495',
  tenHocPhan: 'Cấu trúc dữ liệu và thuật toán',
  soSV: 50,
  loaiLop: 'Lớp học',
  lichHoc: 'Thứ 2, Tiết 4-6',
  donVi: 'Trường CNTT&TT',
  giangVien: 'Nguyễn Văn An',
  trangThai: 'Hiển thị',
  ghiChu: 'Ghi chú',
  
},
]

export const dataTitle= [
    { field: "id", headerName: " " },
    { field: "maHocPhan", headerName: "Mã học phần",disableSearch:'search' },
    { field: "maLop", headerName: "Mã lớp",disableSearch:'search' },
    { field: "tenHocPhan", headerName: "Tên học phần",disableSearch:'search'},
    { field: "soSV", headerName: "Số SV" },
    { field: "loaiLop", headerName: "Loại lớp" },
    { field: "lichHoc", headerName: "Lịch học" },
    { field: "donVi", headerName: "Đơn vị"},
    { field: "giangVien", headerName: "Giảng viên" ,disableSearch:'search'},
    { field: "trangThai", headerName: "Trạng thái" },
    { field: "ghiChu", headerName: "Ghi chú"},
    {
      field: "thaoTac",
      headerName: "Thao tác",
      renderCell: (row) => <ActionMenu row={row} />
    }
  ];
export const dataTitle1= [
  { field: "id", headerName: " " },
  { field: "maHocPhan", headerName: "Mã học phần",disableSearch:'search'},
  { field: "maLop", headerName: "Mã lớp",disableSearch:'search' },
  { field: "tenHocPhan", headerName: "Tên học phần",disableSearch:'search' },
  { field: "soSV", headerName: "Số SV" },
  { field: "loaiLop", headerName: "Loại lớp"},
  { field: "lichHoc", headerName: "Lịch học" },
  { field: "donVi", headerName: "Đơn vị" },
  { field: "giangVien", headerName: "Giảng viên",disableSearch:'search' },
  { field: "trangThai", headerName: "Trạng thái" },
  { field: "ghiChu", headerName: "Ghi chú"},
  {
    field: "thaoTac",
    headerName: "Thao tác",
    // customColumn: "xoa_edit_logout"
    renderCell:(row)=>(
      <Box display="flex" gap="10px" sx={{cursor:'pointer'}}>
        <LoginIcon  sx={{color:"#5C606D"}} />
        <EditIcon sx={{color:'#0D81ED'}} />
        <DeleteIcon sx={{color:"#C02135"}}/>
    </Box>
    )
  }
];

export const dataTitle2 = [
  // { field: "id", headerName: " ", disableSearch},
  { field: "id", headerName: " "},
  { field:'mssv',headerName:"MSSV",disableSearch:'search'},
  { field:'tensinhvien',headerName:"Tên sinh viên",disableSearch:'search'},
  { field:'email',headerName:'Email',disableSearch:'search'},
  { field:'diemgkck',headerName:"Điểm GK/CK"},
  { field:'diemdanh',headerName:'Điểm danh'},
  { field:'ghichu',headerName:"Ghi chú",minWidth:250},
  {
    field:'thaoTac',
    headerName:'Thao tác',
    renderCell: (row) => (
      <IconButton>
        <DeleteIcon onClick={() => console.log("Xóa", row)} sx={{color:"#C02135",cursor:'pointer'}}/>
      </IconButton>
     
    )
  }
]
export const data2 = [
  {
    id:1,
    mssv:'20225866',
    tensinhvien:'Nguyễn Quốc Khánh',
    email:"Khanh.nq225866@sis.hust.edu.vn",
    diemgkck:"9/10",
    diemdanh:'10/10',
    ghichu:' ',
  }
]

export const dataTitle3 = [
  { field: 'mahocphan', headerName: 'Mã học phần',minWidth:'200' },
  { field: 'malop', headerName: 'Mã lớp' },
  { field: 'tenhocphan', headerName: 'Tên học phần',color:'#287DF4' },
  { field: 'loailop', headerName: 'Loại lớp' },
  { field: 'lichhoc', headerName: 'Lịch học' },
  { field: 'donvi', headerName: 'Đơn vị' },
  { field: 'giangvien', headerName: 'Giảng viên' },
  { field: 'trangthai', headerName: 'Trạng thái' }
]
export const data3 = [
  {
    mahocphan: "IT2025",
    malop: "128495",
    tenhocphan: "Cấu trúc dữ liệu và thuật toán",
    loailop: "Lớp học",
    lichhoc: "Thứ 2, Tiết 4-6",
    donvi: "Trường CNTT&TT",
    giangvien: "Nguyễn Văn An",
    trangthai: "Lớp mới"
  },
  {
    mahocphan: "IT2025",
    malop: "128495",
    tenhocphan: "Cấu trúc dữ liệu và thuật toán",
    loailop: "Lớp học",
    lichhoc: "Thứ 2, Tiết 4-6",
    donvi: "Trường CNTT&TT",
    giangvien: "Nguyễn Văn An",
    trangthai: "Lớp mới"
  },
  {
    mahocphan: "IT2025",
    malop: "128495",
    tenhocphan: "Cấu trúc dữ liệu và thuật toán",
    loailop: "Lớp học",
    lichhoc: "Thứ 2, Tiết 4-6",
    donvi: "Trường CNTT&TT",
    giangvien: "Nguyễn Văn An",
    trangthai: "Lớp mới"
  },

]