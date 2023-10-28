import React, { useContext, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material'; // Import icons
import { CartContext, UserContext } from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const OrderSummary = (params) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  let { CartDetails, setCartDetails } = useContext(CartContext);
  const baseURL = process.env.PRODUCTION_BACKEND_URL || process.env.REACT_APP_BACKEND_PORT;
  const [loader, setloader] = useState(false)

  const calculateTotal = () => {
    return CartDetails.cart.reduce((total, product) => total + (product.price) * CartDetails.quantities[product._id], 0);
  };

  async function handleChangeInCart(product, quantity, requestType) {
    try {
        let url = baseURL + "addToCart";
        const sendObj = {
            bookID: product._id,
            quantity: quantity
        }
        setloader(true);
        const response = requestType === 'post' ? await axios.post(url, sendObj, { headers: { 'Authorization': localStorage.getItem('token') } }) : await axios.put(url, sendObj, { headers: { 'Authorization': localStorage.getItem('token') } });
        setloader(false);
        
        if (response.data.Success === true) {

            return {
                Success: true,
            };
        }
        else if (response.data.Success === false) {

            params.setNotification({ open: true, message: "You need to login first.", severity: "error" });
            return {
                Success: false
            }
        }

        return {
            Success: false,
            Error: response.data.Error
        }
    } catch (error) {
        
    }
}

  const handleIncrement = async (product) => {
    let res = await handleChangeInCart(product, 1, "put");
    if (res.Success === true) {
       
        let qty = CartDetails.quantities;
        qty[product._id] += 1;

        setCartDetails({
            cart: CartDetails.cart,
            quantities: qty
        });

    }
};

const handleDecrement = async (product) => {
    let res = await handleChangeInCart(product, -1, "put");
    
    if (res.Success === true) {
       
        let qty = CartDetails.quantities;
        if (qty[product._id] > 0) {
            qty[product._id] -= 1;
        }

        if (qty[product._id] === 0) {
            
            const newCart = CartDetails.cart.filter(item => item._id !== product._id);
            delete qty[product._id];
            setCartDetails({
                cart: newCart,
                quantities: qty
            });
        }
        else{
            setCartDetails({
                cart: CartDetails.cart,
                quantities: qty
            });
        }

    }
};

  const handleCheckout =  () => {
    
    setCartDetails({
      cart :[],
      quantities : {},
    })
      params.setNotification({ open: true, message: "Thanks for shopping come again...", severity: "success" });
    
  }

  return (
    <>
    {loader  && 
    <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={loader}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  }

      { CartDetails.cart.length ? <div>
        <Typography variant="h4" style={{ textAlign: 'center', margin: '20px' }}>Cart</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CartDetails.cart.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleDecrement(product)}}>
                      <Remove />
                    </IconButton>
                    {CartDetails.quantities[product._id]}
                    <IconButton onClick={()=>{handleIncrement(product)}}>
                      <Add />
                    </IconButton>
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <Typography variant="h6">Total Amount: {calculateTotal()}</Typography>
        </div>
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <Button variant="contained" color="primary" onClick={() => { navigate('/') }}>
            Back to Products
          </Button>
        </div>
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </div> : <></>}

      {(CartDetails.cart && CartDetails.cart.length===0) && 
          <Typography fontFamily={'cursive'} fontSize={33} >Cart Empty</Typography>
      }
    </>
  );
};

export default OrderSummary;

