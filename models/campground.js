const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url : {
        type : String,
        required : true
    },
    filename : {
        type : String,
        required : true
    }
})
// ImageSchema.virtual("thumbnail").get(function (){
//     return this.url.replace('/upload','/upload/w_200');
// })
const opts = { toJSON : { virtuals : true }};
const CampgroundSchema = new Schema ({
    title : {
        type : String,
        required : true
    },
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
        },
        coordinates : {
            type : [Number],
        }
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
    images : [ImageSchema],
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
},opts);
CampgroundSchema.virtual("properties.popUp").get(function (){
    return `<h5>${this.title}</h5>
            <p>${this.description.slice(0,30)}</p>
            <a href="/campgrounds/${this._id}">Visit</a>`
})
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