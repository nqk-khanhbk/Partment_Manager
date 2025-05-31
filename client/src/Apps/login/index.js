import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Paper
} from '@mui/material';

const Login = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#ffe6ec', // Màu nền hồng nhạt
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h5" align="center" color="#C02135" fontWeight="bold">
          Đăng nhập
        </Typography>

        <TextField
          label="Tên đăng nhập"
          variant="outlined"
          fullWidth
        />

        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
        />

        <FormControlLabel
          control={<Checkbox sx={{ color: '#C02135' }} />}
          label="Nhớ mật khẩu"
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#C02135',
            '&:hover': {
              bgcolor: '#a1172b',
            },
          }}
        >
          Đăng nhập
        </Button>

        <Typography variant="body2" align="center">
          Nếu chưa có tài khoản?{' '}
          <Link href="/register" underline="hover" sx={{ color: '#C02135' }}>
            Đăng ký
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
