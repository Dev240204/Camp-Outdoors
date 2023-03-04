const express = require('express');
const router = express.Router();
const ExpressError = require('../Utils/ExpressError')
const WrapAsync = require('../Utils/WrapAsync')
const {CampgroundSchema } = require('../schemas');
const Campground = require('../models/campground');

const ValidateData = (req,res,next)=>{
    const {error} = CampgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

//Index page to display all the campgrounds
router.get('/',WrapAsync(async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))
// To create new Campground
router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
})
router.post('/',ValidateData,WrapAsync(async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully created a Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// To display details of specific Campground
router.get('/:id',WrapAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find the Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}))

// To edit or Update Campground details
router.get('/:id/edit',WrapAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find the Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}))
router.put('/:id',ValidateData,WrapAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully Updated a Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id',WrapAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted a Campground');
    res.redirect('/campgrounds');
}))

module.exports = router;