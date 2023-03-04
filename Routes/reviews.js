const express = require('express');
const router = express.Router({mergeParams : true});
const Review = require('../models/review');
const ExpressError = require('../Utils/ExpressError')
const WrapAsync = require('../Utils/WrapAsync')
const {ReviewSchema} = require('../schemas');
const Campground = require('../models/campground');

// Middleware to validate the review data
const ValidateReview = (req,res,next)=>{
    const {error} = ReviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

// To create new Review
router.get('/new',WrapAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('../reviews/new',{campground});
}))
router.post('/',ValidateReview,WrapAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully Added a new Review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// To delete a review
router.delete('/:reviewId',WrapAsync(async (req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted a Review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;