import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ cursor: "pointer" }}
          onClick={() =>
            navigate(role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard")
          }
        >
          PSYCare
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: 2 }}>
          {role === "doctor" && (
            <>
              <Button color="inherit" onClick={() => navigate("/link1")}>
                Link_1
              </Button>
              <Button color="inherit" onClick={() => navigate("/link2")}>
                Link_2
              </Button>
            </>
          )}

          {role === "patient" && (
            <>
              <Button color="inherit" onClick={() => navigate("/link3")}>
                Link_3
              </Button>
              <Button color="inherit" onClick={() => navigate("/link4")}>
                Link_4
              </Button>
            </>
          )}
        </Box>

        {/* RIGHT: Profile dropdown */}
        <Button color="inherit" onClick={handleMenuOpen}>
          Profile
        </Button>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
