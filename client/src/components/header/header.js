import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import { BsBell, BsChatDots} from 'react-icons/bs';
import AccountMenu from './accountMenu';
import { getCookie } from '../../helper/cookies.helper';
const Header = () => {
  const name = getCookie("name");
  return (
    <AppBar position="static" sx={{ backgroundColor: '#C02135' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box component="img" src="/assets/images/hust.png" alt="logo" sx={{ height: 40 }} />
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
              BLUEMOON APARTMANT SYSTEM
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              HỆ THỐNG QUẢN LÝ CHUNG CƯ BLUEMOON
            </Typography>
          </Box>
        </Stack>

        {/* Right */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton sx={{ color: 'white' }}><BsBell /></IconButton>
          <IconButton sx={{ color: 'white' }}><BsChatDots /></IconButton>
          <Typography variant="body1">{name}</Typography>
          <AccountMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


















// import { BsBell, BsChatDots, BsChevronDown } from 'react-icons/bs';
// import './header.css';
// const Header = () => {
//   return (
//     <div className="header">
//       <div className="header_left">
//         <div className="header_left-image">
//           <img src="/assets/images/hust.png" alt="logo" />
//         </div>
//         <div className="header_left-title">
//           <h5> BLUEMOON APARTMANT SYSTEM </h5>
//           <span> HỆ THỐNG QUẢN LÝ CHUNG CƯ BLUEMOON</span>
//         </div>
//       </div>

//       <div className="header_right">
//         <BsBell className="icon" />
//         <BsChatDots className="icon" />
//         <div className="user_info">
//           <div className="avatar"></div>
//           <span className="username">Người dùng 1</span>
//           <BsChevronDown className="dropdown-icon" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;
