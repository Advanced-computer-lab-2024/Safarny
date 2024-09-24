import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar >
      <Toolbar>

        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Safarny
        </Typography>


        <Box sx={{ flexGrow: 1, justifyContent: 'center' }}>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/landmarks">Landmarks</Button>
        </Box>

        <Button color="inherit" component={Link} to="/signin">Sign In</Button>

        <IconButton
          color="inherit"
          onMouseEnter={handleMenuOpen} // Open on hover
          onClick={handleMenuOpen} // Also open on click
        >
          <AccountCircleIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onMouseLeave={handleMenuClose} 
        >
          <MenuItem component={Link} to="/signup">Register</MenuItem>
          <MenuItem component={Link} to="/TourGuide">Be a tour Guide?</MenuItem>
          <MenuItem component={Link} to="/Advertiser">Be an Advertiser?</MenuItem>
          <MenuItem component={Link} to="/seller">Be a Seller?</MenuItem>
          <MenuItem component={Link} to="/settings">Settings</MenuItem>
          <MenuItem component={Link} to="/logout">Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
