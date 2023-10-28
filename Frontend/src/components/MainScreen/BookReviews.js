import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Rating } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

function BookReviews(params) {
  const [isReviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loader, setloader] = useState(false)



  let baseURL = process.env.PRODUCTION_BACKEND_URL || process.env.REACT_APP_BACKEND_PORT;

  const handleReviewSubmit = async () => {

    if(comment.length < 4 ){
      params.setNotification({ open: true, message: "Review must have atleast 4 characters", severity: "error" });
      return;
    }
    let url = baseURL + 'addReview';
    let newReview = {
      comment: comment,
      rating: rating,
      bookID: params.book._id
    }
    setloader(true);
    let response = await axios.post(url, { newReview }, { headers: { 'Authorization': localStorage.getItem('token') } })
    setloader(false);
    if (response.data.Success === true) {

      params.setNotification({ open: true, message: "Review Added", severity: "success" });

    }
    else {
      params.setNotification({ open: true, message: "You need To Login first to add a review", severity: "error" });

    }
  };

  useEffect(() => {
    async function getReviews() {
      let url = baseURL + 'getReviews/' + params.book._id;
      setloader(true);
      let response = await axios.get(url)
      if (response?.data && response?.data[0]?.reviews?.length > 0) {
        setReviews(response.data[0].reviews);
      }
      setloader(false);


    }

    if (isReviewDialogOpen === true) getReviews();
  }, [isReviewDialogOpen])

  return (
    <div>
      {loader &&
        <Backdrop
          sx={{ color: '#fff', zIndex:  9999 }}
          open={loader}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      <Dialog open={isReviewDialogOpen} maxWidth="sm" fullWidth={true} onClose={() => {
        setReviewDialogOpen(false);
      }}>
        <DialogTitle>{<Typography variant="h6" fontWeight={'Bold'} >Reviews</Typography>}</DialogTitle>
        <DialogContent >


          {reviews.map((review) => (

            <div key={review._id}>
              <Typography fontWeight={'Bold'}>{review.user.firstName} {review.user.lastName}  </Typography>
              <Typography>
                Rating: {review.rating} Stars
              </Typography>

              <Typography>{review.comment}</Typography>

              <br />
            </div>

          )
          )}
          <div style={{ marginTop: '20px' }}>
            <div>
              <Rating
                value={rating}
                precision={0.5}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
            </div>
            <textarea
              style={{ width: '100%' }}
              rows="5"
              placeholder="Write your review here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setReviewDialogOpen(false);
          }} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Button onClick={() => setReviewDialogOpen(true)}>Reviews</Button>

    </div>
  );
}

export default BookReviews;
