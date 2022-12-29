const express = require('express');
const path = require('path');
const { title } = require('process');
const Campground = require('./models/campground');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=>{
        console.log("Data base Connection Open!!");
    })
    .catch(()=>{
        console.log("Error in Connecting Data Base");
    })

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campground',async (req,res)=>{
    const camp = new Campground({title : 'BackYard Camping'})
    await camp.save();
    res.send(camp);
})

app.listen(3000,()=>{
    console.log("Listening on port 3000!!");
})