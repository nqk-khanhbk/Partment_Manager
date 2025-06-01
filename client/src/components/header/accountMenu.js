import React from 'react';
import {
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    Tooltip,Stack
} from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonIcon from '@mui/icons-material/Person';
import {BsChevronDown} from 'react-icons/bs'
import { Link } from 'react-router-dom';
import { deleteCookie } from '../../helper/cookies.helper';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AccountMenu = () => {
     const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        deleteCookie("accessToken");
        deleteCookie("name"); 
        navigate("/login"); 
        toast.success("Đăng xuất thành công!"); 
    };
    return (
        <>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <Tooltip title="Tài khoản / Cài đặt / Đăng xuất">
                    <IconButton onClick={handleClick} size="small">
                        <Avatar sx={{ width: 32, height: 32 }}>K</Avatar>
                    </IconButton>
                </Tooltip>
                <BsChevronDown onClick={handleClick} style={{ cursor: 'pointer' }} />
            </Stack>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        minWidth: 200,
                        overflow: 'visible',
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem component={Link} to="/profile">
                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                    Thông tin cá nhân
                </MenuItem>
                <MenuItem component={Link} to="/change-password">
                    <ListItemIcon><LockResetIcon fontSize="small" /></ListItemIcon>
                    Đổi mật khẩu
                </MenuItem>
                <MenuItem component={Link} to="/settings">
                    <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                    Cài đặt
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                    Đăng xuất
                </MenuItem>
            </Menu>
        </>
    );
};

export default AccountMenu;
