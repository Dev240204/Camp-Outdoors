const express = require('express');
const path = require('path');
const Campground = require('./models/campground');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const campground = require('./models/campground');

mongoose.set('strictQuery',true);

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=>{
        console.log("Data base Connection Open!!");
    })
    .catch(()=>{
        console.log("Error in Connecting Data Base");
    })

const app = express();

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// Home Page
app.get('/',(req,res)=>{
    res.render('home');
})
//Index page to display all the campgrounds
app.get('/campgrounds',async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
// To create new Campground
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds',async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

// To display details of specific Campground
app.get('/campgrounds/:id',async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
})

// To edit or Update Campground details
app.get('/camgrounds/:id/edit',async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
})
app.put('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000,()=>{
    console.log("Listening on port 3000!!");
})