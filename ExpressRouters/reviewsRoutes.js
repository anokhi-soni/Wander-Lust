let Express = require('express');
let router = Express.Router({ mergeParams: true }); // Doing this is compulsory if the routes of current file (reviewsRoutes.js) consists of ids (/:id) of other files (listingsRoutes.js)  or of parent routes because, By default, Express routers DO NOT inherit params from parent routes. 

const MyError = require('../utils/MyErrorClass.js');
const wrapAsync = require("../utils/WrapAsync.js");
let Listing = require("../models/listing.js");
let {reviewSchemaOG, Review} = require("../models/review.js");
const {ListingSchema, ReviewSchema} = require("../models/listingSchema.js"); // Joi scehma for listings
const {isLoggedIn, isAuthor} = require("../middlewares.js");

let reviewContoller = require("../Controller/reviewController.js");

//To add a review
router.post("/", isLoggedIn, reviewContoller.validateReview, wrapAsync(reviewContoller.postReview));
// To delete a review
router.delete("/:reviewId", isLoggedIn, isAuthor, reviewContoller.deletReview);

module.exports = router;