import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Select,
  FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import UploadIcon from '@mui/icons-material/Upload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { NavLink } from 'react-router-dom';
const HeaderClassManager = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [semester, setSemester] = useState('20251');

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{padding:'12px',borderRadius:'8px',gap:'12px',backgroundColor:'#FFFF' }}
    >
      {/* Tiêu đề */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', color: '#C01235' }}
      >
        Quản lý lớp học kỳ {semester}
      </Typography>

      {/* Dropdown + Nút */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">Chọn kỳ học khác:</Typography>
          <FormControl size="small">
            <Select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              sx={{ minWidth: 90 }}
            >
              <MenuItem value="20251">20251</MenuItem>
              <MenuItem value="20242">20242</MenuItem>
              <MenuItem value="20241">20241</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Nút Thêm lớp học mới */}
        <Button
          variant="contained"
          onClick={handleMenuClick}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            backgroundColor: '#0B57D0',
            textTransform: 'none',
            borderRadius: '999px',
            paddingX: 2,
            fontWeight: 500
          }}
        >
          <AddIcon sx={{ fontSize: 18, mr: 1 }} />
          Thêm lớp học mới
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          <MenuItem onClick={handleMenuClose} component={NavLink} to="/lop-hoc/them-lop-thu-cong">
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Thêm lớp học thủ công" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={NavLink} to="/lop-hoc/them-lop-tu-ehust">
            <ListItemIcon>
              <GridViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Thêm lớp từ eHUST" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={NavLink} to="/them-lop-bang-file">
            <ListItemIcon>
              <UploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Thêm lớp bằng file" />
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default HeaderClassManager;
