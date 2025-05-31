import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography, Box,
} from '@mui/material';
import {
  Search as SearchIcon,

} from '@mui/icons-material';

import PaginationMui from './pagination';


const ClassTable = ({ columns, rows,allowSearching  }) => {

  // Lấy dữ liệu tìm kiếm
  const [searchValues, setSearchValues] = useState({});

  const handleSearchChange = (value, index) => {
    const column = columns[index];
    const updated = {
      ...searchValues,
      [column.field]: {
        title: column.headerName,
        key: value,
      },
    };
    setSearchValues(updated);

    //Gửi dữ liệu này lên backend hoặc xử lý tại đây:
    console.log('Search Data Sent to Backend:', updated[column.field]);
  }
  // ------------------Lấy thông tin phần tick-------------------------------
  const [selectedIds, setSelectedIds] = useState([]);
  const isAllSelected = selectedIds.length === rows.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      console.log([]); // 🧹 Bỏ chọn tất cả
    } else {
      const allIds = rows.map(row => row.id);
      setSelectedIds(allIds);
      console.log(rows); // ✅ In ra toàn bộ dữ liệu
    }
  };

  const toggleSelectRow = (id) => {
    const isSelected = selectedIds.includes(id);
    let updatedIds;
    if (isSelected) {
      updatedIds = selectedIds.filter(item => item !== id);
    } 
    else {
      updatedIds = [...selectedIds, id];
      const rowData = rows.find(row => row.id === id);
      console.log(rowData); // ✅ In ra dữ liệu dòng đó
    }
    setSelectedIds(updatedIds);
  };
  return (
    <TableContainer component={Paper} >
      {/* phần bảng */}
      <Table sx={{ tableLayout: "auto", width: "100%"}}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#EEEEF0',position:'sticky',zIndex:'1' }}>
            {columns.map((column,index)=>{
              if(column.field==="id"){
                return(
                  <TableCell className='checkall' key={index} padding="checkbox" sx={{ borderLeft: '1px solid #e0e0e0', gap: '10px', borderBottom: 'none'}}>
                    <Checkbox sx={{ color: '#C02135' }} checked={isAllSelected} onChange={toggleSelectAll}/>
                  </TableCell>
                )
              }
              else{
                return (
                  <TableCell style={{ minWidth:column.minWidth}} sx={{ borderLeft: '1px solid #e0e0e0', padding:'0px 12px', gap: '10px', borderBottom: 'none'}}>
                    <Typography sx={{ fontWeight: '700', fontSize: '13px', lineHeight: '20px', color: '#C02135', }}>
                      {column.headerName}
                    </Typography>
                  </TableCell>
                )}
            })}
          </TableRow>
          {/* Hàng tìm kiếm */}
          {allowSearching && (
            <TableRow variant="head"
              sx={{ backgroundColor: '#EEEEF0' }}
            >
              {columns.map((column,idx)=>{
                if(column.field==="id"){
                  return (
                    <TableCell key={idx} padding="checkbox" sx={{ borderLeft: '1px solid #e0e0e0', borderTop: 'none' }}>
                      
                    </TableCell>
                  )
                }
                if(column.field === "thaoTac"){
                  return (
                    <TableCell sx={{ borderLeft: '1px solid #e0e0e0', padding: '8px 4px 8px 6px', gap: '10px', borderTop: 'none'}}>
  
                    </TableCell>
                  )
                }
                else{
                  return column.disableSearch === 'search' ? (
                    <TableCell key={idx} sx={{ borderLeft: '1px solid #e0e0e0', padding: '8px 4px 8px 6px', gap: '10px', borderTop: 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <SearchIcon fontSize="13px" type="submit" />
                        <input
                          type="text"
                          placeholder="Nhập từ khóa"
                          style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '13px',
                            width: '65px'
                          }}
                          onChange={(e) => { handleSearchChange(e.target.value, idx) }}
                        />
                      </Box>
                    </TableCell>
                  ) : (
                    <TableCell key={idx} sx={{ borderLeft: '1px solid #e0e0e0', padding: '8px 4px 8px 6px', gap: '10px', borderTop: 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {/* Không có ô tìm kiếm */}
                      </Box>
                    </TableCell>
                  )
                  
                }
              })}
            </TableRow>
          )}
          
        </TableHead>
        {/* <body>
          { columns.map(item) => (
            <div style={minWidth: item.minWidth}>{item.customColumn ? item.customColumn() : <div>{row[item.field]}</div>}</div>
          )}
        </body> */}

        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover sx={{ borderLeft: '1px solid #ddd', gap: '10px' }}>
              {columns.map((column,index)=>{
                if (column.field === "id") {
                  return (
                    <TableCell padding="checkbox" key={index} className='checkbox'>
                      <Checkbox 
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                      />
                    </TableCell>
                  )
                  
                }
                if(column.field==="thaoTac"){
                  return (
                    <TableCell sx={{ borderLeft: '1px solid #e0e0e0', padding: '0px 12px', gap: '10px', borderRight: '1px solid #ddd',textAlign:"center", alignItems:'center'}}>
                      {column.renderCell ? column.renderCell(row) : null}
                    </TableCell>
                  )
                }
                
                else{
                  return(
                    <TableCell  sx={{ borderLeft: '1px solid #e0e0e0', padding: `${column.field ==='id' ? '0px 12px':'8px'}`, gap: '10px'  }}>
                      <Typography sx={{ fontSize: '13px', fontWeight: '400', lineHeight: '20px' }}>{row[column.field]}</Typography>
                    </TableCell> 
                  )
                }
              })
            }
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* phần pagination */}
      <PaginationMui/>
    </TableContainer>
  );
};

export default ClassTable;