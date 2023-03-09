const {CampgroundSchema,ReviewSchema } = require('./schemas');
const ExpressError = require('./Utils/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review');

// Middleware to check if the user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
// Middleware to validate the data
module.exports.ValidateData = (req,res,next)=>{
    const {error} = CampgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

// Middleware for Authorization
module.exports.isAuthor = async(req,res,next)=>{
    const {id}  =req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Middleware for Authorization of review
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}  =req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Middleware to validate the review data
module.exports.ValidateReview = (req,res,next)=>{
    const {error} = ReviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}