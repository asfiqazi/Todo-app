import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material';
import { auth } from '../services/api';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await auth.login(values.email, values.password);
        localStorage.setItem('token', response.data.token);
        navigate('/tasks');
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              margin="normal"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/signup">Don't have an account? Sign up</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
