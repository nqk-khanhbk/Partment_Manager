import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from "react-toastify";
import { register } from '../../service/user.service';
import { useNavigate } from "react-router-dom";
// import { setCookie } from '../../helper/cookies.helper';
const theme = createTheme();

const Register = () => {
  const navigator = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    // Kiểm tra dữ liệu
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Tạo object chỉ chứa 3 trường cần gửi
      const dataToSend = { name, email, password };
      const res = await register(dataToSend);
      if(res){
        // đáng ra phải lưu token và name vào cookies sau khi đăng ký xong,nhưng ở đây sau khi dky xong ko tự sinh token .BE nỏ vãi Huy à
        toast.success("Đăng ký thành công!");
        navigator('/login');//đăng ký xong vào trang tổng quan luôn
      }
      else{
        toast.error("Đăng ký thất bại!");
      }
      
    } 
    catch (err) {
      toast.error(err?.response?.data?.message || "Đăng ký thất bại!");
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffcdd2',
          backgroundImage: 'linear-gradient(45deg, #ffcdd2 0%, #f8bbd0 100%)',
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Đăng ký tài khoản
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Họ và tên"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#e91e63',
                  '&:hover': {
                    backgroundColor: '#d81b60',
                  },
                }}
              >
                Đăng ký
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2">
                    Bạn đã có tài khoản?{' '}
                    <Link href="/login" variant="body2" sx={{ color: '#e91e63' }}>
                      Đăng nhập ngay
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Register;