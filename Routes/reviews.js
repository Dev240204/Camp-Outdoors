const express = require('express');
const router = express.Router({mergeParams : true});
const WrapAsync = require('../Utils/WrapAsync')
const review = require('../connectors/reviews');
const {ValidateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

// To create new Review
router.get('/new',isLoggedIn,WrapAsync(review.createReview));
router.post('/',isLoggedIn,ValidateReview,WrapAsync(review.saveReview));

// To delete a review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,WrapAsync(review.deleteReview));

module.exports = router;