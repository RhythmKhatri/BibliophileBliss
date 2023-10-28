
import React, { useContext, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { CartContext } from '../../context/Context';
import axios from 'axios';
import BookReviews from './BookReviews';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const MyCard = (params) => {
    let { CartDetails, setCartDetails } = useContext(CartContext);
    const [loader, setloader] = useState(false)

    const baseURL = process.env.PRODUCTION_BACKEND_URL || process.env.REACT_APP_BACKEND_PORT;


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


    const handleAddToCart = async (product) => {
        let res = await handleChangeInCart(product, 1, "post");
        if (res.Success === true) {
            let temp = CartDetails.cart;
            temp.push(product);
            let qty = CartDetails.quantities;
            qty[product._id] = 1;

            setCartDetails({
                cart: temp,
                quantities: qty
            });

        }

    };

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
            else {
                setCartDetails({
                    cart: CartDetails.cart,
                    quantities: qty
                });
            }


        }
    };

    const isProductInCart = (product) => {

        return CartDetails.cart.find(obj => obj._id === product._id);

    }

    const getQuantity = (product) => CartDetails.quantities[product._id] || 0;



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
            <Grid container spacing={1}>
                {params.books.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={4} lg={4} >
                        <Card style={{ backgroundColor: 'lightblue', marginLeft: '20px', marginRight: '20px' }}>
                            <CardContent >
                                <style>
                                    {`
                                            @import url('https://fonts.googleapis.com/css?family=Tilt+Neon');
                                            `}
                                </style>
                                <Grid container spacing={2} >
                                    <Grid item>
                                        <div>
                                            <Typography variant="h2" style={{ fontFamily: 'Tilt Neon, sans-serif', fontWeight: 'bold', fontSize: '24px' }}>{product.title}</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} >
                                    <Grid className='item1' item xs={12} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
                                        <div style={{ display: 'inline' }}>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Author : </Typography>
                                        </div>
                                        <div style={{ display: 'inline', marginLeft: '12px' }}>
                                            <Typography variant="subtitle1">{product.author}</Typography>
                                        </div>
                                    </Grid>
                                    <Grid className='item2' item xs={12} style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '2px' }}>
                                        <div style={{ display: 'inline', marginTop: '2px' }}>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>ISBN : </Typography>
                                        </div>
                                        <div style={{ display: 'inline', marginLeft: '12px', marginTop: '2px' }}>
                                            <Typography variant="subtitle1">{product.isbn}</Typography>
                                        </div>
                                    </Grid>

                                    <Grid className='item3' item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '2px' }}>
                                        <div style={{ display: 'inline' }}>
                                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Price : {product.price}</Typography>
                                        </div>

                                    </Grid>
                                    <Grid className='item3' item xs={5} sm={5} style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '2px' }}>
                                        <BookReviews setNotification={params.setNotification}
                                            notification={params.notification}
                                            book={product} />

                                    </Grid>
                                    <Grid item xs={7} sm={7} style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>

                                        {isProductInCart(product) ? (
                                            <div>
                                                <Button
                                                    variant='contained'
                                                    size='small'
                                                    color='primary'
                                                    onClick={() => handleDecrement(product)}
                                                >
                                                    -
                                                </Button>
                                                <span style={{ padding: '0 8px' }}>{getQuantity(product)}</span>
                                                <Button
                                                    variant='contained'
                                                    size='small'
                                                    color='primary'
                                                    onClick={() => handleIncrement(product)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant='contained'
                                                size='small'
                                                color='primary'
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Add to cart
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>



                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </>
    );
};

export default MyCard;

