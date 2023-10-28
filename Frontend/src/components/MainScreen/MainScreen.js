import React, { useState, useEffect } from 'react';
import PrimarySearchAppBar from "./AppBar";
import CustomPagination from "./Pagination";
import MyCard from "./MyCard";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const MainScreen = (params) => {


  const [currentPage, setcurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [books, setBooks] = useState([]);
  const [inputText, setInputText] = useState(null);
  const baseURL = process.env.PRODUCTION_BACKEND_URL || process.env.REACT_APP_BACKEND_PORT;
  const [loader, setloader] = useState(false)


  const getBooks = async () => {

    if (inputText === null || inputText === undefined || inputText === '') return;

    let url = baseURL + "getBooks?inputValue=" + encodeURIComponent(inputText) + "&offset=" + Number((currentPage - 1) * 12) + "&limit=" + Number(12);
    setloader(true);
    try {
      const response = await axios.get(url);
      setBooks(response.data.booksList);
      let totalNumberOfPages = Math.ceil(response.data.totalLength / 12);
      setTotalPages(totalNumberOfPages);

    } catch (error) {
      console.log('Error:', error.message);
    }
    setloader(false);
  }


  useEffect(() => {
    getBooks();
  }, [inputText, currentPage])

  useEffect(() => {
    setcurrentPage(1);
  }, [inputText])


  useEffect(() => {
    async function getHomepageBooks() {

      let url = baseURL + 'getHomepageBooks'
      setloader(true);
      let res = await axios.get(url);
      setloader(false);
      setBooks(res.data)

    }
    getHomepageBooks();

  }, [])



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
      <PrimarySearchAppBar
        setInputText={setInputText}
        setNotification={params.setNotification}
        notification={params.notification}
        
      />
      <br></br>
      <br></br>
      <MyCard
        books={books}
        setNotification={params.setNotification}
        notification={params.notification}
        
      />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>


        {totalPages > 1 && <CustomPagination
          totalPages={totalPages}
          currentPage={currentPage}
          setcurrentPage={setcurrentPage}
        />}
      </div>
    </>
  );
};

export default MainScreen;
