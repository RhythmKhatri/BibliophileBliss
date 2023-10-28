import React from 'react';
import Pagination from '@mui/material/Pagination';

const CustomPagination = ({ totalPages, currentPage, setcurrentPage }) => {
  const handleChange = (event, page) => {
    setcurrentPage(page);
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handleChange}
      color="primary"
    />
  );
};

export default CustomPagination;
