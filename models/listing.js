let Mongoose = require('mongoose');
let {Review} = require('./review');
let {User} = require("./user");
const { required } = require('joi');
// async function main(){
//     return Mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }
// main()
// .then(()=>{ 
//     console.log("connection successfull");
// })
// .catch((err)=>{
//     console.log("err");
// })

let listingSchema = Mongoose.Schema({
    title : {
        type : String,
        // required : true
    },
    description : {
        type : String,
        // required : true
    },
    image : { // we'll be taking url from the user
        url : String,
        filename : String
    },
    price : {
        type : Number,
        // required : true
    },
    location : {
        type : String,
        // required : true
    },
    country : {
        type : String,
        // required : true
    },
    reviews : [
        {
            type : Mongoose.Schema.Types.ObjectId,
            ref : "Review" // jis varibale me hume Review ke model ko import kiya hai wahi
        }
    ],
    owner : {
        type : Mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type : {
            type : String,
            enum : ["Point"],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{ // can keep the variables name anything
    console.log("Post middleware For listingSchema has been executed is executed!");
    await Review.deleteMany({_id : {$in : listing.reviews}}); // yaani listing.reviews me jo bhi ids hain unn ids ke document ko Review model/collectionse delete kar do
    console.log("hello");
    // the above syntax means => id : all ids from listings.reviews
})

let listing = Mongoose.model("listing", listingSchema);
module.exports = listing;