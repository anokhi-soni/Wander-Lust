const Joi = require("joi");
const review = require("./review");

let ListingSchema = Joi.object({ // Joi.object() => it takes an object.
    // This "listings" is the object which we are passing to the Joi.object
    listings : Joi.object({  // this Joi.object again takes an object
        title : Joi.string().required(), // here we are specifying that the title property of listings must be a string and it is required to be entered by the user
        description : Joi.string().required().max(1000), // here we are specifying that the description property of listings must be a string , it is required to be entered by the user and it's max length can be 1000 only
        image : Joi.string().allow("", null), // here we are specifying that the image property of listings must be a string , it can be empty or null as weel, ie., user can leave it empty
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required()
    }).required()// yaani ye jo "listings" naam ki object hai ye aani hi chahiye user ke paas se
});

let ReviewSchema = Joi.object({
    reviews : Joi.object({
        comment : Joi.string().required(),
        ratings : Joi.number().required().min(1).max(5),
        date : Joi.date(),
        // author : Joi.object().required(),
    }).required()
})

module.exports = {ListingSchema, ReviewSchema};