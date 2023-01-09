const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const mongoose = require('mongoose');

mongoose.set('strictQuery',true);

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=>{
        console.log("Data base Connection Open!!");
    })
    .catch(()=>{
        console.log("Error in Connecting Data Base");
    })

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDb = async() =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random400 = Math.floor(Math.random()*400);
        const price = Math.floor(Math.random()*10000)+1000;
        const camp = new Campground({
            location : `${cities[random400].city},${cities[random400].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate enim, ex, similique, maxime sunt ullam aperiam quo alias hic ut quam libero ducimus rem et? Perferendis aliquam voluptates consequatur atque!',
            image : 'https://source.unsplash.com/collection/483251',
            price,
        })
        await camp.save();
    }
} 

seedDb().then(() => {
    mongoose.connection.close();
})
