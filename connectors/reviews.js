const Review = require('../models/review');
const Campground = require('../models/campground');

// To create new Review
module.exports.createReview = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('../reviews/new',{campground});
}
module.exports.saveReview = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully Added a new Review');
    res.redirect(`/campgrounds/${campground._id}`);
}

// To delete a review
module.exports.deleteReview = async (req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id , {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted a Review');
    res.redirect(`/campgrounds/${id}`);
}