import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Pagination,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';

const PaginationMui = ({
  totalRecords = 200,
  currentPage = 1,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
      }}
    >
      <Typography fontSize="14px" fontWeight='400' lineHeight='24px'>Tổng số bản ghi: {totalRecords}</Typography>

      <Stack direction="row" spacing={2} alignItems="center" padding='0px 8px' gap='20px'>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => onPageChange(value)}
          showFirstButton
          showLastButton
          size="small"
          sx={{
            '& .Mui-selected': {
              backgroundColor: '#C02135 !important',
              color: 'white',
              fontWeight: 700,
            },
          }}
        />

        <FormControl size="small" margin='0'>
          <Select
            value={rowsPerPage}
            onChange={(e) => {
              onRowsPerPageChange(parseInt(e.target.value));
            }}
            sx={{ fontSize: '13px', height: '32px', width: '60px' }}
          >
            {[5, 10, 20, 50].map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography fontSize="13px" lineHeight='20px' fontWeight='400'>Dòng trên trang</Typography>
      </Stack>
    </Box>
  );
};

export default PaginationMui;
