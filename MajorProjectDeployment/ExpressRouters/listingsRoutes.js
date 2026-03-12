let Express = require('express');
let router = Express.Router();


const MyError = require('../utils/MyErrorClass.js');
const wrapAsync = require("../utils/WrapAsync.js");
let Listing = require("../models/listing.js");
let {reviewSchemaOG, Review} = require("../models/review.js");
const {ListingSchema, ReviewSchema} = require("../models/listingSchema.js"); // Joi scehma for listings
let {isLoggedIn, isOwner} = require("../middlewares.js");
const { populate } = require('../models/user.js');

let Multer = require("multer"); // this package handels multipart/form-data
let {cloudinary, storage} = require("../cloudConfig.js");
const upload = Multer({storage}); // It means we're going to store all the files inside the storage variable which stores the files uploaded by the user onto our clodinary account
// const upload = Multer({dest : "uploads"}); // It means we're going to store all the files inside the "uploads" folder. dest => destination 

let listingController = require("../Controller/listingController.js");



router
    .route("/")
    .get(wrapAsync(listingController.allListings)) //Index Route => Will print the list of all the houses
    .post(listingController.validateListing, upload.single("listings[image]"), wrapAsync(listingController.postListing)) //To add the new house on the page
    // .post(upload.single("listings[image]"), (req, res)=>{
    //     res.send(req.file);
    // })
    /*
    upload.single("listings[image]") => this means we're storing the files inside the listing.image 
    req.files => gives the info of all the files uploaded
*/

//New Route // Always write this get on route "/listings/add" before "/listings/:id" otherwise the server will take "add" as a parameter to :id
router.get("/add", isLoggedIn, listingController.renderNewForm);


router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show Route => Will print the specefic house with id "id"
    .patch(isLoggedIn, isOwner, listingController.validateListing, upload.single("listings[image]"), wrapAsync(listingController.postEdit)) // To edit the route
    .delete(isLoggedIn, isOwner, listingController.deleteListing); //To delete a house 

    //To render edit form
router.get("/edit/:id", isLoggedIn, isOwner, wrapAsync(listingController.renderEditFrom));
module.exports = router;