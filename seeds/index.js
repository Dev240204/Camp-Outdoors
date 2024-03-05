if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp"

mongoose.set('strictQuery',true);
const options ={
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

mongoose.connect(dbUrl,options)
    .then(()=>{
        console.log("Data base Connection Open!!");
    })
    .catch(()=>{
        console.log("Error in Connecting Data Base");
    })

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDb = async() =>{
    await Campground.deleteMany({});
    for(let i=0;i<100;i++){
        const random400 = Math.floor(Math.random()*400);
        const price = Math.floor(Math.random()*10000)+1000;
        const camp = new Campground({
            author : '64c12224e1cffba6b17d82cb',
            location : `${cities[random400].city},${cities[random400].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate enim, ex, similique, maxime sunt ullam aperiam quo alias hic ut quam libero ducimus rem et? Perferendis aliquam voluptates consequatur atque!',
            price,
            geometry: { type: 'Point', coordinates: [ 
                cities[random400].long,
                cities[random400].lat,
             ] },
            images: [
                {
                  url: 'https://res.cloudinary.com/dchlc6jte/image/upload/v1699507945/YelpCamp/3_kypgyn.jpg',
                  filename: 'YelpCamp/3_kypgyn.jpg',
                },
                {
                  url: 'https://res.cloudinary.com/dchlc6jte/image/upload/v1699507936/YelpCamp/2_q9vkys.webp',
                  filename: 'YelpCamp/2_q9vkys',
                }
              ]
        })
        await camp.save();
    }
} 

seedDb().then(() => {
    mongoose.connection.close();
})
