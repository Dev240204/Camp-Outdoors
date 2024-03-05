const { cloudinary } = require('../Cloudinary');
const Campground = require('../models/campground');
const axios = require("axios"); 

//Index page to display all the campgrounds
module.exports.campgroundIndex = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

// To create new Campground
module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}
module.exports.createCampground = async (req,res)=>{
    const campground = new Campground(req.body.campground);
    const geodata = await axios.get(`https://nominatim.openstreetmap.org/search?q=${req.body.campground.location}&format=geojson`)
    if(geodata.data.features.length !== 0){
        campground.geometry = geodata.data.features[0].geometry;
    }else{
        req.flash('error','Invalid Location Entered')
        res.redirect("/campgrounds/new")
    }
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully created a Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

// To display details of specific Campground
module.exports.showCampground = async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error','Cannot find the Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}

// To edit or Update Campground details
module.exports.renderEditForm = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find the Campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}
module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    // console.log(campground)
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...images)
    await campground.save();
    // console.log(req.body)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull :{images :{filename : {$in : req.body.deleteImages}}}})
    }
    // console.log(campground)
    req.flash('success','Successfully Updated a Campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

// To delete a Campground 
module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted a Campground');
    res.redirect('/campgrounds');
}