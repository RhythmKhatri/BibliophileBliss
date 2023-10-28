
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import MainScreen from './components/MainScreen/MainScreen';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import {UserContext, CartContext} from './context/Context';
import OrderSummary from './components/MainScreen/OrderSummary';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

function App() {
  const [notification, setNotification] = useState({open:false});
  const [user, setUser] = useState({});
  const [loader, setloader] = useState(false)
  const [CartDetails, setCartDetails] = useState({
    cart :[],
    quantities : {},
  });
  let baseURL = process.env.PRODUCTION_BACKEND_URL || process.env.REACT_APP_BACKEND_PORT;
  const updateUser = (newUser) => {
    setUser(newUser);
  };
  const updateCart = (newCart) => {
    setCartDetails(newCart);
  };
  const handleClose = () =>{
    setNotification({open:false});
  }
  useEffect(() => {

    async function getUserInfo(){

      let url = baseURL + "getUserInfo"
      setloader(true);
    try {
      
      const response = await axios.get(url,  { headers: { 'Authorization': localStorage.getItem('token') || 'undefined' }});
      
      if (response.data) {

        let userObj = {
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          cart : response.data.cart,
          _id : response.data._id
        }
        updateUser(userObj);

        if(response.data.cart ){
          let cartObj={
            cart :[],
            quantities : {},
          };
          response.data.cart.items.forEach(element => {
            cartObj.cart.push(element.book);
            cartObj.quantities[element.book._id]=element.quantity;
    
          });
         
          updateCart(cartObj);
    
        }
      }
      else {
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setloader(false);
  }
  if(Object.keys(user).length===0) getUserInfo();

  }, [user])
  
  return (
    <>
    <UserContext.Provider value={{ user, updateUser }}>
    <CartContext.Provider value={{ CartDetails, setCartDetails }}>
    
    {loader  && 
    <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loader}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  }
    <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleClose}  anchorOrigin={{
            vertical: 'top', 
            horizontal: 'right', 
          }}>
      <Alert
        severity={notification.severity}
        onClose={handleClose}
      >
        {notification.message}
      </Alert>
    </Snackbar>
    
    <Router>
      <Routes>
      
        <Route path="/" element={<MainScreen notification={notification} setNotification={setNotification} loader={loader} setloader={setloader} />} />
        <Route path="/SignIn" element={<SignIn notification={notification} setNotification={setNotification} loader={loader} setloader={setloader} />} />
        <Route path="/SignUp" element={<SignUp notification={notification} setNotification={setNotification} loader={loader} setloader={setloader} />} />
        <Route path="/OrderSummary" element={<OrderSummary notification={notification} setNotification={setNotification} loader={loader} setloader={setloader} />} />
        
      </Routes>
    </Router>
    </CartContext.Provider>
    </UserContext.Provider>
    </>
  );
}

export default App;
