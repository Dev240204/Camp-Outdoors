const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema ({
    title : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    images : [
        {
            url : String,
            filename : String,
        }
    ],
    author :{
            type :Schema.Types.ObjectId,
            ref : "User"
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]
});

CampgroundSchema.post('findOneAndDelete',async function(data){
    if(data){
        await Review.remove({
            _id : {
                $in: data.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);