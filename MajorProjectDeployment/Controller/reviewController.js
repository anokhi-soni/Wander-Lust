let Listing = require("../models/listing.js");
const {ListingSchema, ReviewSchema} = require("../models/listingSchema.js"); // Joi scehma for listings
const MyError = require('../utils/MyErrorClass.js');

module.exports.validateReview = (req, res, next) => {
    let result = ReviewSchema.validate(req.body);
    if(result.error){
        // console.log("HOOOOOO");
        let errMsg = result.error.details.map((el)=> el.message).join(", ");
        console.log(errMsg);
        throw new MyError(400, errMsg);
    } else next();
}

module.exports.postReview = async(req, res, next)=>{
    let {id} = req.params;
    let currListing = await Listing.findById(`${id}`);

    let newReview = new Review({...req.body.reviews, author : req.user._id}); // req.body ke andar ke reviews object access kar rahe hain hum aur uss hi me author attribute aur add kar rahe hain jo current logged in user ki id store karta hai
    currListing.reviews.push(newReview);

    await newReview.save()
    await currListing.save(); // Saving is neccessary, otherwise added reviews won't reflect into the db
    req.flash("success", "review added successfully");
    return res.redirect(`/listings/${id}`);
}

module.exports.deletReview =  async (req, res)=>{ // id is the id of a listing and reviewId is the id of an individual review 
    let {id, reviewId} = req.params;
    let review = await Review.findByIdAndDelete(`${reviewId}`);   
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}}); // means find document with id 'id' in Listing model/collection and then update it as => remove (ie., $pull) the entity from the array 'reviews' which matches the value 'reviewId'
    req.flash("success", "review deleted successfully");
    return res.redirect(`/listings/${id}`);
}