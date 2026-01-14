import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import type { Register as RegisterDTO } from "../types/auth";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function Register() {
  const [form, setForm] = useState<RegisterDTO>({ email: "", password: "", fullName: "" });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: RegisterDTO) => register(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      window.location.reload();
    },
    onError: () => {
      setError("Registration failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(form);
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" mb={3}>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </Box>
        <Typography variant="body2" mt={2}>
          Do you have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
