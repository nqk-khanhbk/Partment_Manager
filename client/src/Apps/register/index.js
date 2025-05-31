import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Paper
} from '@mui/material';

const Register = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        bgcolor: '#ffe6ec',
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
          Đăng ký
        </Typography>

        <TextField
          label="Họ và tên"
          variant="outlined"
          fullWidth
          autoComplete="off"
        />

        <TextField
          label="Tên đăng nhập"
          variant="outlined"
          fullWidth
          autoComplete="off"
        />

        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          autoComplete="new-password"
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
          Đăng ký
        </Button>

        <Typography variant="body2" align="center">
          Đã có tài khoản?{' '}
          <Link href="/login" underline="hover" sx={{ color: '#C02135' }}>
            Đăng nhập
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
