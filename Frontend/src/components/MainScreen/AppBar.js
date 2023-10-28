import React, { useState, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext, UserContext } from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

export default function PrimarySearchAppBar(params) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [tempInput, setTempInput] = useState(null);
  const { CartDetails } = useContext(CartContext)
  const { user } = useContext(UserContext);
  const [loader, setloader] = useState(false)

  let baseURL = process.env.PRODUCTION_BACKEND_URL || process.env.REACT_APP_BACKEND_PORT;

  const handleInputChange = (event) => {
    setTempInput(event.target.value);
  };

  const handleOnClick = () => {
    params.setInputText(tempInput);
  }
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setloader(true);
    try {
      let url = baseURL + 'signOut'

      let res = await axios.post(url, {}, { headers: { 'Authorization': localStorage.getItem('token') } });
      if (res.data.Success === true) {

        params.setNotification({ open: true, message: "Logged Out Successfully", severity: "success" });
        localStorage.removeItem('token');
        navigate('/signIn');
      }
    } catch (error) {
      throw error;
    }
    setloader(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };


  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => { navigate('/OrderSummary') }}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit" >
          <Badge badgeContent={CartDetails.cart ? CartDetails.cart.length : 0} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>

      {(Object.keys(user).length === 0 || user._id) && <MenuItem onClick={() => {
        if (user._id) navigate('/signIn'); else {
          params.setNotification({ open: true, message: "You need to SignIn First", severity: "error" });
        }
      }}>

        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"

        >
          <AccountCircle />
        </IconButton>
        SignIn
      </MenuItem>}
      {Object.keys(user).length !== 0 && <MenuItem onClick={handleSignOut}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"

        >
          <AccountCircle />
        </IconButton>
        SignOut
      </MenuItem>}

    </Menu>
  );

  return (
    <>
      {loader &&
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              fontFamily="Tilt Neon"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Bibliophile Bliss
            </Typography>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search by title, author or ISBN here"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleInputChange}
              />
            </Search>
            <Button
              variant='contained'
              color='primary'
              onClick={handleOnClick}
            >
              Search
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={CartDetails.cart ? CartDetails.cart.length : 0} color="error">
                  <ShoppingCartIcon onClick={() => {
                    if (user._id) navigate('/OrderSummary'); else {
                      params.setNotification({ open: true, message: "You need to SignIn First", severity: "error" })
                    }
                  }} />
                </Badge>
              </IconButton>

              {(Object.keys(user).length === 0 || user._id === undefined) ? <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={() => { navigate('/signIn') }}
                color="inherit"
              >
                SignIn
              </IconButton>
                : <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleSignOut}
                  color="inherit"
                >
                  SignOut
                </IconButton>}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </Box>
    </>
  );
}