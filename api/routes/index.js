const express = require('express');
const router = express.Router()
const ctrlHotels = require('../controllers/hotels.controller');
const ctrlReviews = require('../controllers/reviews.controller');
const ctrlUsers = require('../controllers/users.controller');

router
  .route('/hotels')
  .get(ctrlHotels.hotelsGetAll)
  //.get(ctrlUsers.authenticate, ctrlHotels.hotelsGetAll)
  .post(ctrlHotels.hotelsAddOne);

router
  .route('/hotels/:hotelId')
  .get(ctrlHotels.hotelsGetOne)
  .put(ctrlHotels.hotelsUpdateOne)
  .delete(ctrlHotels.hotelsDeleteOne);


// REVIEWS ROUTES 

router
  .route('/hotels/:hotelId/reviews')
  .get(ctrlReviews.reviewsGetAll)
  .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);

router
  .route('/hotels/:hotelId/reviews/:reviewId')
  .get(ctrlReviews.reviewsGetOne)
  .put(ctrlReviews.reviewsUpdateOne)
  .delete(ctrlReviews.reviewsDeleteOne);


// Authentication
router
  .route('/users/register')
  .post(ctrlUsers.register)
router
  .route('/users/login')
  .post(ctrlUsers.login)

module.exports = router