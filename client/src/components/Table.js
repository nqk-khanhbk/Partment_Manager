import { useState, useMemo } from 'react';
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
  TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';

const ClassTable = ({ columns, rows, allowSearching, onSearchChange }) => {

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
    if (onSearchChange) {
      onSearchChange(updated);
      setPage(0); // Reset về trang đầu nếu tìm kiếm
    } else {
      console.log('Search Data Sent to Backend:', updated[column.field]);
    }
  }
  // ✅ Lọc dữ liệu theo từ khóa
  const filteredRows = useMemo(() => {
    return rows.filter(row =>
      Object.entries(searchValues).every(([field, keyword]) => {
        const cell = row[field];
        return cell?.toString().toLowerCase().includes(keyword.key?.toLowerCase());
      })
    );
  }, [rows, searchValues]);
  // Phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  // ------------------Lấy thông tin phần tick-------------------------------
  const [selectedIds, setSelectedIds] = useState([]);
  const isAllSelected = selectedIds.length === rows.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      console.log([]); //  Bỏ chọn tất cả
    } else {
      const allIds = rows.map(row => row.id);
      setSelectedIds(allIds);
      console.log(rows); // In ra toàn bộ dữ liệu
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
      console.log(rowData); //  In ra dữ liệu dòng đó
    }
    setSelectedIds(updatedIds);
  };
  return (
    <>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
        {/* phần bảng */}
        <Table sx={{ tableLayout: "auto", width: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#EEEEF0', position: 'sticky', zIndex: '1' }}>
              <TableCell padding="checkbox">
                <Checkbox sx={{ color: '#C02135' }} checked={isAllSelected} onChange={toggleSelectAll} />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  style={{ minWidth: column.minWidth }}
                  sx={{ borderLeft: '1px solid #e0e0e0', padding: '0px 12px', gap: '10px', borderBottom: 'none' }}
                >
                  <Typography sx={{ fontWeight: '700', fontSize: '16px', lineHeight: '20px', color: '#C02135' }}>
                    {column.headerName}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>

            {/* Hàng tìm kiếm */}
            {allowSearching && (
              <TableRow variant="head" sx={{ backgroundColor: '#EEEEF0' }}>
                {/* Cột checkbox trống */}
                <TableCell padding="checkbox" sx={{ borderLeft: '1px solid #e0e0e0', borderTop: 'none' }} />

                {columns.map((column, idx) => {
                  if (column.field === "thaoTac") {
                    return (
                      <TableCell
                        key={idx}
                        sx={{
                          borderLeft: '1px solid #e0e0e0',
                          padding: '8px 4px 8px 6px',
                          gap: '10px',
                          borderTop: 'none'
                        }}
                      />
                    );
                  }

                  // Nếu disableSearch là 'search', thì hiện ô tìm kiếm
                  if (column.disableSearch === 'search') {
                    return (
                      <TableCell
                        key={idx}
                        sx={{
                          borderLeft: '1px solid #e0e0e0',
                          padding: '8px 4px 8px 6px',
                          gap: '10px',
                          borderTop: 'none'
                        }}
                      >
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
                              width: '80px'
                            }}
                            onChange={(e) => handleSearchChange(e.target.value, idx)}
                          />
                        </Box>
                      </TableCell>
                    );
                  }

                  // Nếu không có ô tìm kiếm
                  return (
                    <TableCell
                      key={idx}
                      sx={{
                        borderLeft: '1px solid #e0e0e0',
                        padding: '8px 4px 8px 6px',
                        gap: '10px',
                        borderTop: 'none'
                      }}
                    />
                  );
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
            {paginatedRows.map((row) => (
              <TableRow key={row.id} hover sx={{ borderLeft: '1px solid #ddd' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelectRow(row.id)}
                    sx={{ color: '#C02135' }}
                  />
                </TableCell>
                {columns.map((column, colIdx) => (
                  <TableCell key={colIdx} 
                    sx={{
                      borderLeft: '1px solid #e0e0e0',
                      padding: '0px 12px',
                      gap: '10px',
                      borderRight: '1px solid #ddd',
                      textAlign: "center",
                      alignItems: 'center'
                    }}>
                    {column.renderCell ? column.renderCell(row) : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* phân trang */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 15]}
        labelRowsPerPage="Số dòng mỗi trang:"
        sx={{
          borderTop: '1px solid #ccc', // Đường viền trên cùng
          mt: 2, // Margin top
          '& .MuiTablePagination-toolbar': {
            fontSize: '16px',
            justifyContent: 'space-between',
            padding: '8px 16px',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '16px',
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiInputBase-root': {
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            paddingLeft: '8px',
            backgroundColor: '#fff',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiTablePagination-actions': {
            display: 'flex',
            alignItems: 'center',
          }
        }}
      />

    </>

  );
};

export default ClassTable;