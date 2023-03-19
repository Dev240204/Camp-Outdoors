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
    for(let i=0;i<100;i++){
        const random400 = Math.floor(Math.random()*400);
        const price = Math.floor(Math.random()*10000)+1000;
        const camp = new Campground({
            author : '640344956fd253c6dfcb9f2d',
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
                  url: 'https://res.cloudinary.com/dchlc6jte/image/upload/v1678601135/YelpCamp/yqwcvm2n4pnibjqp13ns.jpg',
                  filename: 'YelpCamp/yqwcvm2n4pnibjqp13ns',
                },
                {
                  url: 'https://res.cloudinary.com/dchlc6jte/image/upload/v1678601135/YelpCamp/thq9kznkc03pmkln6adp.jpg',
                  filename: 'YelpCamp/thq9kznkc03pmkln6adp',
                }
              ]
        })
        await camp.save();
    }
} 

seedDb().then(() => {
    mongoose.connection.close();
})
